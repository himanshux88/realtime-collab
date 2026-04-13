"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "services/supabaseClient";
import { getCurrentUser, signOut } from "features/auth/api";
import { getSharedDocuments } from "features/documents/api";

import Sidebar from "components/layout/Sidebar";
import MobileDrawer from "components/layout/MobileDrawer";
import SearchBar from "components/dashboard/SearchBar";
import DocumentGrid from "components/dashboard/DocumentGrid";
import Button from "components/ui/Button";

export default function SharedWithMe() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sharedDocs, setSharedDocs] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
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

  /* ── Fetch shared documents ── */
  useEffect(() => {
    if (!user) return;
    const fetchShared = async () => {
      setDocumentsLoading(true);
      try {
        const docs = await getSharedDocuments();
        setSharedDocs(docs);
      } catch (err) {
        console.error("Failed to fetch shared documents:", err);
      } finally {
        setDocumentsLoading(false);
      }
    };
    fetchShared();
  }, [user]);

  /* ── Logout ── */
  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  /* ── Filter ── */
  const filteredDocs = sharedDocs.filter((doc) =>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Shared with Me
                </h1>
                <p className="text-slate-500 mt-0.5">
                  Documents others have shared with you
                </p>
              </div>
            </div>
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

              {/* Back to dashboard */}
              <Button
                variant="secondary"
                onClick={() => router.push("/dashboard")}
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
                <span className="hidden sm:inline">My Docs</span>
              </Button>
            </div>
          </div>

          {/* Content */}
          {documentsLoading ? (
            <DocumentGrid loading viewMode={viewMode} documents={[]} />
          ) : sharedDocs.length === 0 ? (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-32 h-32 mb-8 relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/10 rotate-6" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 -rotate-3" />
                <div className="relative w-full h-full rounded-3xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No shared documents yet
              </h3>
              <p className="text-slate-500 text-sm mb-8 text-center max-w-sm">
                When someone invites you to collaborate on a document, it will
                appear here.
              </p>
              <Button
                variant="secondary"
                onClick={() => router.push("/dashboard")}
                size="lg"
              >
                Go to My Documents
              </Button>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400">
                No shared documents matching &quot;{searchQuery}&quot;
              </p>
            </div>
          ) : (
            <DocumentGrid
              documents={filteredDocs}
              viewMode={viewMode}
              onDocumentClick={(docId) => router.push(`/documents/${docId}`)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
