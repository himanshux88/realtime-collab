"use client";

import { addComment, getComments } from "features/comments/api";
import { getDocumentsById, updateDocument } from "features/documents/api";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "services/supabaseClient";

export default function DocumentPage() {
  const { id } = useParams();

  const [presenceUsers, setPresenceUsers] = useState([]);
  const [cursorMap, setCursorMap] = useState({});
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [isLocalChange, setIsLocalChange] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [commentText,setCommentText] = useState("");
  const [comments,setComments] = useState([]);
  const [error, setError] = useState(null);

  const channelRef = useRef(null);
  const userId = useRef(Date.now());
  const lastUpdateRef = useRef(0);

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
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < 30) return;

      lastUpdateRef.current = now;

      setCursor({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    const newChannel = supabase.channel(`presence-${id}`, {
      config: {
        presence: {
          key: Math.random().toString(),
        },
        broadcast: {
          self: true,
        },
      },
    });

    channelRef.current = newChannel;

    newChannel.on("presence", { event: "sync" }, () => {
      const state = newChannel.presenceState();

      const users = Object.entries(state).flatMap(([key, value]) =>
        value.map((v) => ({
          user_id: v.user_id || key,
        })),
      );

      setPresenceUsers(users);
    });

    newChannel.on("broadcast", { event: "cursor_move" }, (payload) => {
      setCursorMap((prev) => ({
        ...prev,
        [payload.payload.user_id]: payload.payload.cursor,
      }));
    });

    newChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await newChannel.track({
          user_id: userId.current,
        });
      }
    });

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [id]);

  useEffect(() => {
    if (!channelRef.current || channelRef.current.state !== "joined") return;

    channelRef.current.send({
      type: "broadcast",
      event: "cursor_move",
      payload: {
        user_id: userId.current,
        cursor,
      },
    });
  }, [cursor]);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const doc = await getDocumentsById(id);
        setDocument(doc);
        setContent(doc.content || "");
      } catch (err) {
        setError(err.message);
      }
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

  const handleTextSelect = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) setSelectedText(selectedText);
  };

  const handleAddComment = async() => {
    if(commentText)
    await addComment({
      document_id: id,
      user_id: userId.current,
      text: commentText,
      selected_text: selectedText,
    });
    setCommentText("");
    setSelectedText("");
  }

  useEffect(()=>{
    const fetchComments = async() => {
      const comments = await getComments(id);
      setComments(comments);
    }
    fetchComments();
  },[id])

  useEffect(() => {
    const channel = supabase
      .channel(`comments-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `document_id=eq.${id}`,
        },
        (payload) => {
          setComments((prev) => [...prev, payload.new]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleShare = async () => {
  const { error } = await supabase
    .from("documents")
    .update({ is_public: true })
    .eq("id", id);

  if (!error) {
    const link = `${window.location.origin}/documents/${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  }
};

const toggleAccess = async () => {
  const { error } = await supabase
    .from("documents")
    .update({ is_public: !document.is_public })
    .eq("id", id);

  if (!error) {
    setDocument((prev) => ({
      ...prev,
      is_public: !prev.is_public,
    }));
  }
};

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!document) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-6 relative">
      <h1 className="text-2xl font-bold mb-4">{document.title}</h1>

      <textarea
        className="w-full h-100 border p-4"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsLocalChange(true);
        }}
        onMouseUp={handleTextSelect}
      />

      <p className="text-sm text-gray-500">{saving ? "Saving..." : "Saved"}</p>
      <button
        className="bg-green-500 text-white px-4 py-2 mb-4"
        onClick={handleShare}
      >
        Share Document
      </button>
      <p className="text-sm text-gray-500">
        {document.is_public ? "Public" : "Private"}
      </p>
      {selectedText && (
        <div className="mt-4 p-2 border rounded">
          <p className="text-sm">Selected: "{selectedText}"</p>

          <input
            className="border p-2 w-full mt-2"
            placeholder="Add comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white px-4 py-2 mt-2"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      )}
      <div className="mt-6">
        <h2 className="font-semibold">Comments</h2>

        {comments.map((c) => (
          <div key={c.id} className="border p-2 mt-2 rounded">
            <p className="text-sm text-gray-500">On: "{c.selected_text}"</p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      {presenceUsers
        .filter((user) => user.user_id !== userId.current)
        .map((user, index) => {
          const userCursor = cursorMap[user.user_id];

          return (
            <div
              key={index}
              className="absolute pointer-events-none"
              style={{
                left: userCursor?.x || 0,
                top: userCursor?.y || 0,
              }}
            >
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                User {user.user_id}
              </div>
            </div>
          );
        })}
    </div>
  );
}
