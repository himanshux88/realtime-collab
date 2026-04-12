"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "services/supabaseClient";
import { getCurrentUser, signOut } from "features/auth/api";
import { createDocument, getDocuments } from "features/documents/api";

import Sidebar from "components/layout/Sidebar";
import MobileDrawer from "components/layout/MobileDrawer";
import SearchBar from "components/dashboard/SearchBar";
import DocumentGrid from "components/dashboard/DocumentGrid";
import EmptyState from "components/dashboard/EmptyState";
import Button from "components/ui/Button";
import Modal from "components/ui/Modal";
import Input from "components/ui/Input";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ── Auth check ── */
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/login");
        } else {
          setUser(currentUser);
          setLoading(false);
        }
      } catch {
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);

  /* ── Auth listener ── */
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) router.push("/login");
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  /* ── Fetch documents ── */
  useEffect(() => {
    if (!user) return;
    const fetchDocuments = async () => {
      setDocumentsLoading(true);
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setDocumentsLoading(false);
      }
    };
    fetchDocuments();
  }, [user]);

  /* ── Create document ── */
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await createDocument(newTitle.trim());
      setNewTitle("");
      setShowCreateModal(false);
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error("Failed to create document:", err);
    } finally {
      setCreating(false);
    }
  };

  /* ── Logout ── */
  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  /* ── Filter ── */
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar – desktop */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="md:pl-[280px]">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-slate-200/60 sticky top-0 z-20">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CollabSpace
          </span>
          <div className="w-10" />
        </div>

        <div className="p-6 md:p-8 lg:p-10 max-w-6xl">
          {/* Page heading */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              My Documents
            </h1>
            <p className="text-slate-500 mt-1">
              Create and manage your documents
            </p>
          </div>

          {/* Actions bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="flex-1"
            />

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                    />
                  </svg>
                </button>
              </div>

              {/* Create button */}
              <Button onClick={() => setShowCreateModal(true)}>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="hidden sm:inline">New Document</span>
              </Button>
            </div>
          </div>

          {/* Content */}
          {documentsLoading ? (
            <DocumentGrid loading viewMode={viewMode} documents={[]} />
          ) : documents.length === 0 ? (
            <EmptyState onCreateDocument={() => setShowCreateModal(true)} />
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400">
                No documents matching &quot;{searchQuery}&quot;
              </p>
            </div>
          ) : (
            <DocumentGrid
              documents={filteredDocuments}
              viewMode={viewMode}
              onDocumentClick={(id) => router.push(`/documents/${id}`)}
            />
          )}
        </div>
      </main>

      {/* Create Document Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewTitle("");
        }}
        title="Create New Document"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className="space-y-6"
        >
          <Input
            label="Document Title"
            placeholder="Enter a title for your document..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                setNewTitle("");
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
