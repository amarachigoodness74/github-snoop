import React from "react";
import clsx from "clsx";
import { Twitter, Github, Mail, Globe, Building, MapPin } from "lucide-react";
import { IUserData } from "@/interfaces/user";

const UserCard = ({
  userData,
  onHoverEnter,
  className = "",
}: {
  userData: IUserData;
  onHoverEnter?: () => void;
  className?: string;
}) => {
  return (
    <>
      <div
        className={clsx(
          "relative bg-gray-800 p-6 rounded-lg text-center",
          className
        )}
      >
        <img
          src={userData.avatar_url}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto"
        />
        <h2 className="text-xl mt-4">{userData.name || userData.login}</h2>
        {userData.name && (
          <span className="text-xs mt-2">{userData.login}</span>
        )}
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
            <span className="relative flex items-center group hover:text-green-400">
              <Building className="w-6 h-6" />

              {/* Tooltip */}
              <span className="absolute left-0 -top-8 w-max px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition">
                {userData.company}
              </span>
            </span>
          )}
          {userData.location && (
            <span className="relative flex items-center group hover:text-green-400">
              <MapPin className="w-6 h-6" />

              {/* Tooltip */}
              <span className="absolute left-0 -top-8 w-max px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition">
                {userData.location}
              </span>
            </span>
          )}
        </div>

        {className && (
          <button
            onMouseEnter={onHoverEnter}
            className="bg-gray-900 p-2 rounded text-center text-gray-300 text-sm"
          >
            More Stats
          </button>
        )}
      </div>
    </>
  );
};

export default UserCard;
