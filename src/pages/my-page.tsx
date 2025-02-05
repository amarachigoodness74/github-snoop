"use client";

import { useState } from "react";
import Image from "next/image";
import { IUserData } from "@/interfaces/user";
import UserProfile from "@/components/UserModel";

export default function PublicUser() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchUserData = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error("User not found");
      const data = await response.json();
      console.log("==============", data);
      setUserData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">GitHub Snoop</h1>
      <div className="flex mb-6 w-[90vw] sm:w-[90vw] md:w-[60vw] lg:w-[50vw]">
        <input
          type="text"
          placeholder="Enter GitHub username..."
          className="p-2 rounded-l-lg bg-gray-800 text-white focus:outline-none w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-r-lg"
          onClick={fetchUserData}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <hr className="border-dotted border-t-2 border-gray-400 w-[90vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] my-4" />
      {userData && <UserProfile userData={userData} />}
    </div>
  );
}
