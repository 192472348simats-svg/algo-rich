"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

interface SettingsContentProps {
  userName: string;
  userEmail: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function SettingsContent({
  userName,
  userEmail,
}: SettingsContentProps) {
  const [name, setName] = useState(userName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("algo-rich-sound-enabled");
    if (stored !== null) setSoundEnabled(stored !== "false");
  }, []);

  function handleSoundToggle(enabled: boolean) {
    setSoundEnabled(enabled);
    localStorage.setItem("algo-rich-sound-enabled", String(enabled));
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setProfileMsg(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      } else {
        setProfileMsg({ type: "error", text: data.error || "Failed to update" });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords don't match" });
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: "success", text: "Password changed!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: data.error || "Failed to change" });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Network error" });
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/user/settings", { method: "DELETE" });
      if (res.ok) {
        signOut({ callbackUrl: "/" });
      }
    } catch {
      setDeleting(false);
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-foreground opacity-70">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        variants={itemVariants}
        className="bg-card/60 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>👤</span> Profile
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm text-foreground mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-background/60 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full px-4 py-2.5 bg-background/40 border border-white/5 rounded-lg text-white/50 cursor-not-allowed"
            />
            <p className="text-xs text-foreground opacity-40 mt-1">
              Email cannot be changed
            </p>
          </div>
          {profileMsg && (
            <p
              className={`text-sm ${
                profileMsg.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {profileMsg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={saving || name.trim() === userName}
            className="px-6 py-2.5 bg-primary text-background font-semibold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>

      {/* Accessibility and feedback */}
      <motion.div
        variants={itemVariants}
        className="bg-card/60 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-2">Feedback</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white">Enable sound effects</p>
            <p className="text-xs text-foreground opacity-60">Play feedback tones for correct and incorrect submissions.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={soundEnabled}
            onClick={() => handleSoundToggle(!soundEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${soundEnabled ? "bg-primary" : "bg-white/20"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </motion.div>

      {/* Password Section */}
      <motion.div
        variants={itemVariants}
        className="bg-card/60 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>🔒</span> Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm text-foreground mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-background/60 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-background/60 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-background/60 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Confirm new password"
            />
          </div>
          {passwordMsg && (
            <p
              className={`text-sm ${
                passwordMsg.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {passwordMsg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={changingPassword || !currentPassword || !newPassword}
            className="px-6 py-2.5 bg-primary text-background font-semibold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        variants={itemVariants}
        className="bg-red-950/20 border border-red-500/20 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-red-400 mb-2 flex items-center gap-2">
          <span>⚠️</span> Danger Zone
        </h2>
        <p className="text-sm text-foreground opacity-60 mb-4">
          Once you delete your account, there is no going back. All your progress, submissions, and data will be permanently removed.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-2.5 bg-transparent border border-red-500/40 text-red-400 font-semibold rounded-lg hover:bg-red-500/10 transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-red-400">
              Are you absolutely sure?
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-5 py-2 bg-white/10 text-foreground rounded-lg hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
