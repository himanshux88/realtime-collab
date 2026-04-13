"use client";

import { useState, useEffect } from "react";
import Modal from "components/ui/Modal";
import Button from "components/ui/Button";
import Badge from "components/ui/Badge";
import Avatar from "components/ui/Avatar";
import { cn } from "utils/cn";
import {
  addCollaborator,
  getCollaborators,
  removeCollaborator,
  updateCollaboratorRole,
} from "features/collaborators/api";
import { useToast } from "hooks/useToast";

export default function ShareModal({
  isOpen,
  onClose,
  documentId,
  isPublic,
  onToggleAccess,
}) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);

  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/documents/${documentId}`
      : "";

  /* ── Fetch collaborators when modal opens ── */
  useEffect(() => {
    if (isOpen && documentId) {
      fetchCollaborators();
    }
  }, [isOpen, documentId]);

  const fetchCollaborators = async () => {
    setLoading(true);
    try {
      const data = await getCollaborators(documentId);
      setCollaborators(data);
    } catch (err) {
      console.error("Failed to fetch collaborators:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Invite handler ── */
  const handleInvite = async (e) => {
    e?.preventDefault();
    const email = inviteEmail.trim();
    if (!email) return;

    setInviting(true);
    try {
      const newCollab = await addCollaborator(documentId, email, inviteRole);
      setCollaborators((prev) => [...prev, newCollab]);
      setInviteEmail("");
      setInviteRole("viewer");
      addToast(`Invited ${newCollab.email} as ${inviteRole}`, "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setInviting(false);
    }
  };

  /* ── Remove handler ── */
  const handleRemove = async (collabId, email) => {
    try {
      await removeCollaborator(collabId);
      setCollaborators((prev) => prev.filter((c) => c.id !== collabId));
      addToast(`Removed ${email}`, "success");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  /* ── Role change handler ── */
  const handleRoleChange = async (collabId, newRole) => {
    try {
      await updateCollaboratorRole(collabId, newRole);
      setCollaborators((prev) =>
        prev.map((c) => (c.id === collabId ? { ...c, role: newRole } : c)),
      );
      addToast(`Role updated to ${newRole}`, "success");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  /* ── Copy link handler ── */
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    addToast("Link copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Document">
      <div className="space-y-6">
        {/* ── Invite Form ── */}
        <form onSubmit={handleInvite} className="space-y-3">
          <label className="text-sm font-medium text-slate-700">
            Invite People
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter email address..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full sm:flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <div className="flex gap-2">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <Button type="submit" loading={inviting} size="md">
                Invite
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Invite members to collaborate on this document
          </p>
        </form>

        {/* ── Collaborator List ── */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            People with access
          </label>

          {loading ? (
            <div className="space-y-3 py-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                  <div className="h-7 bg-slate-100 rounded-lg w-20" />
                </div>
              ))}
            </div>
          ) : collaborators.length === 0 ? (
            <div className="text-center py-6 rounded-xl bg-slate-50/50 border border-dashed border-slate-200">
              <svg
                className="w-8 h-8 text-slate-300 mx-auto mb-2"
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
              <p className="text-xs text-slate-400">
                No collaborators yet. Invite someone above.
              </p>
            </div>
          ) : (
            <div className="space-y-1 max-h-52 overflow-y-auto scrollbar-none">
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <Avatar
                    userId={collab.user_id}
                    name={collab.email}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {collab.email}
                    </p>
                  </div>
                  <select
                    value={collab.role}
                    onChange={(e) =>
                      handleRoleChange(collab.id, e.target.value)
                    }
                    className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <button
                    onClick={() => handleRemove(collab.id, collab.email)}
                    className="p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                    title="Remove collaborator"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-slate-100" />

        {/* ── Access Toggle ── */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                isPublic
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-slate-200 text-slate-500",
              )}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {isPublic ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12.75 3.03v.568c0 .334.148.65.405.864a11.04 11.04 0 0 1 2.649 2.647c.209.253.521.4.849.4H18a2.25 2.25 0 0 1 2.25 2.25v2.622a2.25 2.25 0 0 1-.659 1.591l-1.5 1.5a2.25 2.25 0 0 1-1.591.659H15a2.25 2.25 0 0 0-2.25 2.25v.878a2.25 2.25 0 0 1-.659 1.591l-1.5 1.5a2.25 2.25 0 0 1-3.182 0l-1.5-1.5a2.25 2.25 0 0 1-.659-1.591v-.878a2.25 2.25 0 0 0-2.25-2.25H2.25A2.25 2.25 0 0 0 0 13.5v2.622c0 .597.237 1.17.659 1.591l1.5 1.5a2.25 2.25 0 0 0 1.591.659H5.25M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                )}
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {isPublic ? "Public" : "Private"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isPublic
                  ? "Anyone with the link can view"
                  : "Only collaborators can access"}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleAccess}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer",
              isPublic ? "bg-primary" : "bg-slate-200",
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm",
                isPublic ? "translate-x-6" : "translate-x-1",
              )}
            />
          </button>
        </div>

        {/* ── Share Link ── */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Share Link
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="w-full sm:flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 truncate focus:outline-none"
            />
            <Button
              variant={copied ? "secondary" : "primary"}
              size="md"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
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
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
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
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                    />
                  </svg>
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
