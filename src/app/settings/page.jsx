"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "services/supabaseClient";
import { getCurrentUser, signOut } from "features/auth/api";
import { useToast } from "hooks/useToast";

import Sidebar from "components/layout/Sidebar";
import MobileDrawer from "components/layout/MobileDrawer";
import Button from "components/ui/Button";
import Input from "components/ui/Input";

export default function Settings() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Profile form
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Danger zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ── Auth check ── */
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/login");
        } else {
          setUser(currentUser);
          setEmail(currentUser.email || "");
          setDisplayName(
            currentUser.user_metadata?.display_name ||
              currentUser.email?.split("@")[0] ||
              "",
          );
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

  /* ── Update Profile ── */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });
      if (error) throw error;
      addToast("Profile updated successfully", "success");
    } catch (err) {
      addToast(err.message || "Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  /* ── Change Password ── */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      addToast("Password updated successfully", "success");
    } catch (err) {
      addToast(err.message || "Failed to update password", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  /* ── Logout ── */
  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

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
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
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

        <div className="p-6 md:p-8 lg:p-10 max-w-2xl">
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
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Settings
                </h1>
                <p className="text-slate-500 mt-0.5">
                  Manage your account preferences
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* ── Profile Section ── */}
            <section className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                Profile
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Your personal account information
              </p>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                {/* Avatar preview */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20">
                    {(displayName || email)?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {displayName || "User"}
                    </p>
                    <p className="text-xs text-slate-400">{email}</p>
                  </div>
                </div>

                <Input
                  label="Display Name"
                  placeholder="Your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400 mt-1.5">
                    Email cannot be changed
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" loading={savingProfile}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </section>

            {/* ── Password Section ── */}
            <section className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                Password
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Update your password to keep your account secure
              </p>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    loading={savingPassword}
                    disabled={!newPassword || !confirmPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </section>

            {/* ── Appearance Section ── */}
            <section className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                Preferences
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Customize your experience
              </p>

              <div className="space-y-4">
                {/* Editor font size */}
                <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Editor Font Size
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Adjust the text size in the editor
                    </p>
                  </div>
                  <select defaultValue="Medium" className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>

                {/* Auto-save */}
                <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Auto-save
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Automatically save changes while editing
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors cursor-pointer">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6 shadow-sm" />
                  </button>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Email Notifications
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Get notified when someone shares a document
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors cursor-pointer">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1 shadow-sm" />
                  </button>
                </div>
              </div>
            </section>

            {/* ── Danger Zone ── */}
            <section className="bg-white rounded-2xl border border-red-200/60 p-6">
              <h2 className="text-base font-semibold text-red-600 mb-1">
                Danger Zone
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Irreversible actions — proceed with caution
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Sign Out
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  className="!border-red-200 !text-red-600 hover:!bg-red-50"
                >
                  Sign Out
                </Button>
              </div>
            </section>
          </div>

          {/* Bottom spacing */}
          <div className="h-12" />
        </div>
      </main>
    </div>
  );
}
