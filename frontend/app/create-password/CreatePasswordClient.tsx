"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, KeyRound, CheckCircle2 } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CreatePasswordClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const inviteToken = searchParams.get("token");

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // -----------------------------
    // STEP 1 → SEND OTP
    // -----------------------------
    const sendOtp = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${BASE_URL}/password/send-otp/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    token: inviteToken,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("OTP sent successfully!");
                setStep(2);
            } else {
                setError(data.detail || "Failed to send OTP");
            }
        } catch (err) {
            setError("Network error");
        }

        setLoading(false);
    };

    // -----------------------------
    // STEP 2 → VERIFY OTP
    // -----------------------------
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
                setStep(3);
            } else {
                setError(data.detail || "Invalid OTP");
            }
        } catch (err) {
            setError("Network error");
        }

        setLoading(false);
    };

    // -----------------------------
    // STEP 3 → CREATE PASSWORD
    // -----------------------------
    const createPassword = async () => {
        setLoading(true);
        setError("");

        // Validate
        if (!username) {
            setError("Username is required");
            setLoading(false);
            return;
        }

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
                    username,      // <-- ADDED
                    otp,
                    password,
                    token: inviteToken,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Password created successfully!");
                setStep(4);
                setTimeout(() => router.push("/login"), 1500);
            } else {
                setError(data.detail || "Failed to create password");
            }
        } catch (err) {
            setError("Network error");
        }

        setLoading(false);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-muted/30 p-8 rounded-xl shadow-xl">

                <h1 className="font-serif text-3xl text-center mb-6">
                    Create Your Account Password
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

                {/* STEP 1: ENTER EMAIL */}
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

                {/* STEP 2: ENTER OTP */}
                {step === 2 && (
                    <div className="space-y-6">
                        <p className="text-sm text-center text-muted-foreground">
                            OTP sent to <b>{email}</b>
                        </p>

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

                {/* STEP 3: CREATE USERNAME + PASSWORD */}
                {step === 3 && (
                    <div className="space-y-6">

                        {/* Username */}
                        <div>
                            <label className="block font-medium mb-2">Username</label>
                            <input
                                type="text"
                                className="w-full border px-4 py-2 rounded-md bg-background"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block font-medium mb-2">New Password</label>
                            <input
                                type="password"
                                className="w-full border px-4 py-2 rounded-md bg-background"
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block font-medium mb-2">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full border px-4 py-2 rounded-md bg-background"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            onClick={createPassword}
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
                        >
                            {loading ? "Saving…" : "Create Password"}
                        </button>
                    </div>
                )}


                {/* STEP 4: SUCCESS */}
                {step === 4 && (
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                        <p className="font-medium">Password created! Redirecting…</p>
                    </div>
                )}
            </div>
        </div>
    );
}
