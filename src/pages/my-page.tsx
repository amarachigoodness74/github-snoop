"use client";

import { useState } from "react";
import { Twitter, Github, Mail, Globe, Building, MapPin } from "lucide-react";
import { IUserData } from "@/interfaces/user";

export default function PublicUser() {
  const [username, setUsername] = useState("");
  const [usersData, setUsersData] = useState<IUserData[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectUser = (user: IUserData) => {
    setSelectedUser(user);
  };

  const fetchUserData = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error("User not found");
      const data: IUserData = await response.json();
      setUsersData((usersData) => [data, ...usersData]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
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
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <hr className="border-dotted border-t-2 border-gray-400 w-[90vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] my-6" />

      {usersData.length > 0 &&
        usersData.map((userData) => (
          <>
            <div className="flex flex-col md:flex-row gap-6 w-[80vw]">
              <div className="w-2/6">
                <div className="bg-gray-800 p-6 rounded-lg text-center w-90">
                  <img
                    src={userData.avatar_url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full mx-auto"
                  />
                  <h2 className="text-xl mt-4">
                    {userData.name || userData.login}
                  </h2>
                  <h4 className="text-sm font-semibold mb-4">
                    Joined:
                    {new Date(userData.created_at).toLocaleDateString()}
                  </h4>
                  <p className="text-sm text-gray-400">{userData.bio}</p>

                  <div className="my-4 flex align-center justify-center gap-4 text-gray-400">
                    {userData.email && (
                      <a
                        href={userData.email}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-400"
                      >
                        <Mail className="w-6 h-6 hover:text-red-400" />
                      </a>
                    )}
                    {userData.twitter_username && (
                      <a
                        href={userData.twitter_username}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-400"
                      >
                        <Twitter className="w-6 h-6 hover:text-blue-700" />
                      </a>
                    )}
                    {userData.blog && (
                      <a
                        href={userData.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-400"
                      >
                        <Globe className="w-6 h-6 hover:text-green-400" />
                      </a>
                    )}
                    {userData.html_url && (
                      <a
                        href={userData.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-400"
                      >
                        <Github className="w-6 h-6 hover:text-gray-400" />
                      </a>
                    )}
                    {userData.company && (
                      <span className="flex items-center hover:text-green-400">
                        <Building className="w-6 h-6" />
                        <span className="ml-2">{userData.company}</span>
                      </span>
                    )}
                    {userData.location && (
                      <span className="flex items-center hover:text-green-400">
                        <MapPin className="w-6 h-6" />
                        <span className="ml-2">{userData.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
    </div>
  );
}
