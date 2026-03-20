"use client";

import { getDocumentsById, updateDocument } from "features/documents/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DocumentPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      const doc = await getDocumentsById(id);
      setDocument(doc);
      setContent(doc.content || "");
    };

    fetchDoc();
  }, [id]);

  useEffect(() => {
    if (!document) return;

    setSaving(true);
    const timeout = setTimeout(async () => {
      await updateDocument(id, content);
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [content]);

  if (!document) return <div>Loading...</div>;
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">{document.title}</h1>

      <textarea
        className="w-full h-100 border p-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <p className="text-sm text-gray-500">{saving ? "Saving..." : "Saved"}</p>
    </div>
  );
}
