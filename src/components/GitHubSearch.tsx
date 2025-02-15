import { IUserData } from "@/interfaces/user";
import Link from "next/link";
import React, { useState } from "react";

type HeaderProps = {
  username: string;
  setUserData: (userData: IUserData | null) => void;
  setUsername: (username: string) => void;
  saving?: boolean;
};

const GitHubSearch = ({
  username,
  setUserData,
  setUsername,
  saving,
}: HeaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error("User not found");
      const data: IUserData = await response.json();
      setUserData(data);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error("An unknown error occurred:", error);
        setError("An unknown error occurred");
      }
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        <Link href="/">GitHub Snoop</Link>
      </h1>
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
          disabled={loading || saving}
        >
          {loading ? "Loading..." : saving ? "Saving..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default GitHubSearch;
