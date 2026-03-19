"use client";

import { getDocumentsById, updateDocument } from "features/documents/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DocumentPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchDoc = async () => {
      const doc = await getDocumentsById(id);
      setDocument(doc);
      setContent(doc.content || "");
    };

    fetchDoc();
  }, [id]);

  const handleSave = async () => {
    await updateDocument(id, content);
    alert("saved");
  };

  if (!document) return <div>Loading...</div>;
  return (
    <div className="min-h-screen p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">{document.title}</h1>

      {/* Editor */}
      <textarea
        className="w-full h-100 border p-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
