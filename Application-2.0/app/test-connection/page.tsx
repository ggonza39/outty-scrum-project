"use client";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function TestPage() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function checkConnection() {
      // We try to fetch from 'profiles'.
      // Even if it's empty, a '200 OK' means the keys and URL are correct.
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

      if (error) {
        setStatus(`❌ Connection Failed: ${error.message}`);
      } else {
        setStatus("✅ Connection Successful! Supabase is talking to Next.js.");
      }
    }
    checkConnection();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Outty System Check</h1>
        <p
          className={`text-lg ${status.includes("✅") ? "text-green-600" : "text-red-600"}`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}
