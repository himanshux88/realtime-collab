"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "services/supabaseClient";
import { addComment, getComments } from "features/comments/api";
import { getDocumentsById, updateDocument } from "features/documents/api";

import TopBar from "components/layout/TopBar";
import EditorToolbar from "components/editor/EditorToolbar";
import EditorArea from "components/editor/EditorArea";
import LiveCursor from "components/editor/LiveCursor";
import CommentsPanel from "components/comments/CommentsPanel";
import ShareModal from "components/share/ShareModal";
import { EditorSkeleton } from "components/ui/Skeleton";

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
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const channelRef = useRef(null);
  const userId = useRef(Date.now());
  const lastUpdateRef = useRef(0);

  /* ── Real-time document sync ── */
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

  /* ── Mouse tracking (throttled) ── */
  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < 30) return;
      lastUpdateRef.current = now;
      setCursor({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  /* ── Presence channel ── */
  useEffect(() => {
    if (!id) return;

    const newChannel = supabase.channel(`presence-${id}`, {
      config: {
        presence: { key: Math.random().toString() },
        broadcast: { self: true },
      },
    });

    channelRef.current = newChannel;

    newChannel.on("presence", { event: "sync" }, () => {
      const state = newChannel.presenceState();
      const users = Object.entries(state).flatMap(([key, value]) =>
        value.map((v) => ({ user_id: v.user_id || key })),
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
        await newChannel.track({ user_id: userId.current });
      }
    });

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [id]);

  /* ── Broadcast cursor position ── */
  useEffect(() => {
    if (!channelRef.current || channelRef.current.state !== "joined") return;
    channelRef.current.send({
      type: "broadcast",
      event: "cursor_move",
      payload: { user_id: userId.current, cursor },
    });
  }, [cursor]);

  /* ── Fetch document ── */
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

  /* ── Auto-save (1s debounce) ── */
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

  /* ── Text selection for comments ── */
  const handleTextSelect = () => {
    const selected = window.getSelection().toString();
    if (selected.length > 0) setSelectedText(selected);
  };

  /* ── Add comment ── */
  const handleAddComment = async () => {
    if (!commentText) return;
    await addComment({
      document_id: id,
      user_id: userId.current,
      text: commentText,
      selected_text: selectedText,
    });
    setCommentText("");
    setSelectedText("");
  };

  /* ── Fetch comments ── */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(id);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };
    fetchComments();
  }, [id]);

  /* ── Real-time comments ── */
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

  /* ── Toggle document access ── */
  const toggleAccess = async () => {
    const { error: err } = await supabase
      .from("documents")
      .update({ is_public: !document.is_public })
      .eq("id", id);

    if (!err) {
      setDocument((prev) => ({ ...prev, is_public: !prev.is_public }));
    }
  };

  /* ── Error state ── */
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-red-50 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Access Denied
          </h2>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  /* ── Loading state ── */
  if (!document) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-16 bg-white border-b border-slate-200/60" />
        <EditorSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <TopBar
        title={document.title}
        saving={saving}
        presenceUsers={presenceUsers.filter(
          (u) => u.user_id !== userId.current,
        )}
        onToggleComments={() => setShowComments(!showComments)}
        onShare={() => setShowShareModal(true)}
        commentsOpen={showComments}
        commentCount={comments.length}
      />

      <div className="flex-1 flex relative">
        {/* Editor section */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${showComments ? "md:mr-[360px]" : ""}`}
        >
          {/* Toolbar */}
          <div className="flex justify-center px-4 py-3 border-b border-slate-100">
            <EditorToolbar />
          </div>

          {/* Editor */}
          <EditorArea
            content={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsLocalChange(true);
            }}
            onMouseUp={handleTextSelect}
          />
        </div>

        {/* Comments Panel */}
        <CommentsPanel
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          comments={comments}
          selectedText={selectedText}
          commentText={commentText}
          onCommentTextChange={setCommentText}
          onAddComment={handleAddComment}
        />
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        documentId={id}
        isPublic={document.is_public}
        onToggleAccess={toggleAccess}
      />

      {/* Live cursors */}
      {presenceUsers
        .filter((user) => user.user_id !== userId.current)
        .map((user, index) => (
          <LiveCursor
            key={index}
            userId={user.user_id}
            position={cursorMap[user.user_id]}
          />
        ))}
    </div>
  );
}
