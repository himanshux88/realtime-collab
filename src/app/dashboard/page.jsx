"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "services/supabaseClient";
import { getCurrentUser, signOut } from "features/auth/api";
import { createDocument, getDocuments } from "features/documents/api";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.push("/login");
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const docs = await getDocuments();
      setDocuments(docs);
    };
    fetchDocuments();
  }, []);

  const handleCreate = async () => {
    if (!title) return;

    await createDocument(title);
    setTitle("");
    const docs = await getDocuments();
    setDocuments(docs);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard 🚀</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      <div className="grid gap-4">
        {documents.length === 0 ? (
          <p>No documents yet 📄</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={()=>router.push(`/documents/${doc.id}`)}
              className="p-4 border rounded hover:bg-gray-100 cursor-pointer"
            >
              <h2 className="font-semibold">{doc.title}</h2>
              <p className="text-sm text-gray-500">
                {new Date(doc.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
