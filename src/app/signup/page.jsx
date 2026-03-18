"use client";

import { useState } from "react";
import { signUp } from "features/auth/api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await signUp(email, password);
      alert("Signup successful! Check email.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={handleSignup}
      >
        Sign Up
      </button>
    </div>
  );
}
