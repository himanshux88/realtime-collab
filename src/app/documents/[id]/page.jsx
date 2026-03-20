"use client";

import { getDocumentsById, updateDocument } from "features/documents/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "services/supabaseClient";

export default function DocumentPage() {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [isLocalChange, setIsLocalChange] = useState(false);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel("realtime-doc")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "documents",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (!isLocalChange) {
            console.log("Realtime Update:", payload);
            setContent(payload.new.content);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase.channel(`presence-${id}`, {
      config: {
        presence: {
          key: Math.random().toString(),
        },
      },
    });

    channel.on(
      "presence",
      {
        event: "sync",
      },
      () => {
        const state = channel.presenceState();
        console.log("Users in doc:", state);

        const users = Object.values(state).flat();
        setUsers(users);
      },
    );

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user_id: Date.now(),
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    const fetchDoc = async () => {
      const doc = await getDocumentsById(id);
      setDocument(doc);
      setContent(doc.content || "");
    };

    fetchDoc();
  }, [id]);

  useEffect(() => {
    if (!document || !isLocalChange) return;

    setSaving(true);
    const timeout = setTimeout(async () => {
      await updateDocument(id, content);
      setIsLocalChange(false);
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [content, isLocalChange]);

  if (!document) return <div>Loading...</div>;
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">{document.title}</h1>

      <textarea
        className="w-full h-100 border p-4"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsLocalChange(true);
        }}
      />
      <p className="text-sm text-gray-500">{saving ? "Saving..." : "Saved"}</p>
      <div className="mb-4">
        <h2 className="font-semibold">Active Users:</h2>
        {users.length === 0 ? (
          <p>No one online</p>
        ) : (
          users.map((user, index) => (
            <div key={index} className="text-sm">
              User {user.user_id}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
