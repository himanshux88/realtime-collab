"use client";

import { useState } from "react";
import Modal from "components/ui/Modal";
import Button from "components/ui/Button";
import Badge from "components/ui/Badge";
import { cn } from "utils/cn";

export default function ShareModal({
  isOpen,
  onClose,
  documentId,
  isPublic,
  onToggleAccess,
}) {
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/documents/${documentId}`
      : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Document">
      <div className="space-y-6">
        {/* Access toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Document Access
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isPublic
                ? "Anyone with the link can view"
                : "Only you can access this document"}
            </p>
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

        <div className="flex items-center gap-2">
          <Badge variant={isPublic ? "success" : "default"} dot>
            {isPublic ? "Public" : "Private"}
          </Badge>
        </div>

        {/* Copy link */}
        {isPublic && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 truncate focus:outline-none"
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
        )}

        {/* Invite (UI only) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Invite People
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email address..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <Button variant="secondary" size="md">
              Invite
            </Button>
          </div>
          <p className="text-xs text-slate-400">
            Invite members to collaborate on this document
          </p>
        </div>
      </div>
    </Modal>
  );
}
