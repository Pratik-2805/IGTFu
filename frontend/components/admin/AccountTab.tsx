"use client";

import { MailCheck, Loader2 } from "lucide-react";
import { useAccount } from "@/hooks/useAccount";

export default function AccountTab() {
  const { user, loading, sendResetPasswordLink, resetLoading } = useAccount();

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading account info…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load user information.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* USER INFO */}
      <div className="bg-muted/30 p-6 rounded-lg border shadow-sm">
        <h2 className="font-serif text-3xl mb-4">Account Information</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        <button
          onClick={sendResetPasswordLink}
          disabled={resetLoading}
          className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 flex items-center gap-2"
        >
          {resetLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <MailCheck className="w-5 h-5" /> Send Reset Password Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
