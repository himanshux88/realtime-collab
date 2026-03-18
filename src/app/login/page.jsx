"use client"

import { signIn } from "features/auth/api";
import { useState } from "react";

export default function LoginPage () {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleLogin = async() =>{
        try {
            await signIn(email,password)
            alert("Logged In!")
        } catch (error) {
            alert(error.message)
        }
    }
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
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    );
}