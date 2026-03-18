"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "services/supabaseClient";
import { getCurrentUser, signOut } from "features/auth/api";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.push("/login");
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);


  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
    
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard 🚀</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-lg">
          Welcome, <span className="font-semibold">{user?.email}</span>
        </p>
      </div>

      
      <div className="mt-6">
        <p className="text-gray-600">Your documents will appear here 📄</p>
      </div>
    </div>
  );
}
