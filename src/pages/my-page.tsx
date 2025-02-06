"use client";

import { useEffect, useState } from "react";
import { Twitter, Github, Mail, Globe, Building, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { IUserData, Stat, StatType } from "@/interfaces/user";
import UserStats from "@/components/UserStats";

export default function PublicUser() {
  const [username, setUsername] = useState("");
  const [usersData, setUsersData] = useState<IUserData[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);

  // Function to handle stat selection
  const handleSelectStat = (stat: Stat) => {
    setSelectedStat(stat);
  };

  const fetchUserData = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error("User not found");
      const data: IUserData = await response.json();
      const userData = {
        id: data.id,
        avatar_url: data.avatar_url,
        name: data.name,
        login: data.login,
        created_at: data.created_at,
        bio: data.bio,
        email: data.email,
        twitter_username: data.twitter_username,
        blog: data.blog,
        html_url: data.html_url,
        company: data.company,
        location: data.location,
        followers: data.followers,
        following: data.following,
        public_repos: data.public_repos,
        public_gists: data.public_gists,
        events_url: data.events_url,
        received_events_url: data.received_events_url,
      };
      // Save user to MongoDB
      await fetch("/api/saveUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userData }),
      });
      // Update local state
      setUsersData((usersData) => [userData, ...usersData]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStoredUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getUsers");
        const users = await response.json();
        setUsersData(users);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoredUsers();
  }, []);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {usersData.length > 0 &&
          usersData.map((userData) => (
            <div
              className="relative group bg-gray-800 p-6 rounded-lg text-center flex flex-col items-center justify-between w-full min-h-[300px] h-full"
              key={userData.id}
            >
              {/* User Card */}
              <div className="bg-gray-800 p-6 rounded-lg text-center group-hover:opacity-50 transition duration-300">
                <img
                  src={userData.avatar_url}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full mx-auto"
                />
                <h2 className="text-xl mt-4">
                  {userData.name || userData.login}
                </h2>
                <h4 className="text-sm font-semibold mb-4">
                  Joined: {new Date(userData.created_at).toLocaleDateString()}
                </h4>
                <p className="text-sm text-gray-400">{userData.bio}</p>

                <div className="my-4 flex align-center justify-center gap-4 text-gray-400">
                  {userData.email && (
                    <a
                      href={`mailto:${userData.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-400"
                    >
                      <Mail className="w-6 h-6 hover:text-red-400" />
                    </a>
                  )}
                  {userData.twitter_username && (
                    <a
                      href={`https://twitter.com/${userData.twitter_username}`}
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

              {/* GitHub Stats - Initially Hidden, Shows on Hover */}
              <div className="absolute top-0 left-0 right-0 bg-gray-800 p-6 rounded-lg w-full opacity-0 group-hover:opacity-100 transition duration-300">
                <h3 className="text-lg font-semibold text-white mb-4">
                  GitHub Stats
                </h3>
                <div className="text-md text-gray-300 space-y-2">
                  <p
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() =>
                      handleSelectStat({
                        username: userData.login,
                        type: StatType.Follow,
                        stat: "followers",
                      })
                    }
                  >
                    👥 Followers: {userData.followers}
                  </p>
                  <p
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() =>
                      handleSelectStat({
                        username: userData.login,
                        type: StatType.Follow,
                        stat: "following",
                      })
                    }
                  >
                    🔄 Following: {userData.following}
                  </p>
                  <p
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() =>
                      handleSelectStat({
                        username: userData.login,
                        type: StatType.Repo,
                        stat: "repos",
                      })
                    }
                  >
                    📂 Public Repos: {userData.public_repos}
                  </p>
                  <p
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() =>
                      handleSelectStat({
                        username: userData.login,
                        type: StatType.Gist,
                        stat: "gists",
                      })
                    }
                  >
                    📝 Public Gists: {userData.public_gists}
                  </p>
                  <p
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() =>
                      handleSelectStat({
                        username: userData.login,
                        type: StatType.Repo,
                        stat: "starred",
                      })
                    }
                  >
                    ⭐ Starred Repos
                  </p>
                  <p
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() =>
                      handleSelectStat({
                        username: userData.login,
                        type: StatType.Org,
                        stat: "orgs",
                      })
                    }
                  >
                    🏢 Organizations
                  </p>
                  {userData.events_url && (
                    <p
                      className="cursor-pointer hover:text-blue-400"
                      onClick={() =>
                        handleSelectStat({
                          username: userData.login,
                          type: StatType.Event,
                          stat: "events",
                        })
                      }
                    >
                      🏷️ Created Events
                    </p>
                  )}
                  {userData.received_events_url && (
                    <p
                      className="cursor-pointer hover:text-blue-400"
                      onClick={() =>
                        handleSelectStat({
                          username: userData.login,
                          type: StatType.Event,
                          stat: "received_events",
                        })
                      }
                    >
                      🏷️ Received Events
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* {selectedStat && (
        <div className="w-4/6">
          <UserStats selectedStat={selectedStat} />
        </div>
      )} */}
      {selectedStat && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed top-0 right-0 w-4/6 h-full bg-gray-900 shadow-lg p-6 z-50"
        >
          <button
            className="absolute top-4 right-4 text-white text-xl"
            onClick={() => setSelectedStat(null)}
          >
            ✖
          </button>

          <UserStats selectedStat={selectedStat} />
        </motion.div>
      )}
    </div>
  );
}
