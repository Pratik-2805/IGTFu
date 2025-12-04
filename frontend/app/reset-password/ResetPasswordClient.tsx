"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, KeyRound, CheckCircle2 } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [username, setUsername] = useState("");

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // --------------------------------
  // STEP 1 — SEND OTP
  // --------------------------------
  const sendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/password/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("OTP sent to your email!");
        setStep(2);
      } else {
        setError(data.detail || "Failed to send OTP");
      }
    } catch {
      setError("Network error");
    }

    setLoading(false);
  };

  // --------------------------------
  // STEP 2 — VERIFY OTP
  // --------------------------------
  const verifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/password/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("OTP verified!");

        // 🔥 Auto-fetch username for reset flow
        const meRes = await fetch(`${BASE_URL}/me/`, {
          method: "GET",
          credentials: "include",
        });

        const meData = await meRes.json();
        setUsername(meData.username); // <-- store automatically

        setStep(3);
      } else {
        setError(data.detail || "Invalid OTP");
      }
    } catch {
      setError("Network error");
    }

    setLoading(false);
  };

  // --------------------------------
  // STEP 3 — RESET PASSWORD (NO USERNAME)
  // --------------------------------
  const resetPassword = async () => {
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/password/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          password,
          token,
          username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password reset successfully!");
        setStep(4);

        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.detail || "Failed to reset password");
      }
    } catch {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-muted/30 p-8 rounded-xl shadow-xl">
        <h1 className="font-serif text-3xl text-center mb-6">
          Reset Your Password
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md text-sm mb-4">
            {successMessage}
          </div>
        )}

        {/* STEP 1 — Email */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-2">Email Address</label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-2">Enter OTP</label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </div>
        )}

        {/* STEP 3 — New Password */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-2">New Password</label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded-md bg-background"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded-md bg-background"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
            >
              {loading ? "Saving…" : "Reset Password"}
            </button>
          </div>
        )}

        {/* STEP 4 — Success */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <p className="font-medium">
              Password reset successfully! Redirecting…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
