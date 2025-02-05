import { IUserData } from "@/interfaces/user";
import { useState } from "react";

const UserProfile = ({ userData }: {userData: IUserData}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-96">
      {/* Avatar */}
      <img
        src={userData.avatar_url}
        alt="Avatar"
        className="w-24 h-24 rounded-full mx-auto"
      />

      {/* Name */}
      <h2 className="text-xl font-semibold mt-4">
        {userData.name || userData.login}
      </h2>

      {/* Bio */}
      <p className="text-gray-400">{userData.bio || "No bio available"}</p>

      {/* Followers & Following */}
      <div className="mt-4 flex justify-around text-sm">
        <p>👥 Followers: {userData.followers}</p>
        <p>🔄 Following: {userData.following}</p>
      </div>

      {/* Dropdown Toggle Button */}
      <button
        className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {showDropdown ? "Hide Details ▲" : "More Details ▼"}
      </button>

      {/* Dropdown Content */}
      {showDropdown && (
        <div className="mt-4 bg-gray-700 p-4 rounded-lg text-left text-sm">
          <p>📂 Public Repos: {userData.public_repos}</p>
          <p>⭐ Starred Repos: {userData.starred_url || "N/A"}</p>
          <p>🏢 Company: {userData.company || "N/A"}</p>
          <p>📍 Location: {userData.location || "N/A"}</p>
          <button
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg w-full"
            onClick={() => setShowModal(true)}
          >
            View Full Details
          </button>
        </div>
      )}

      {/* Modal for Detailed Info */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[40vw] text-white">
            <h2 className="text-2xl font-semibold">GitHub Details</h2>
            <p>📂 Public Repos: {userData.public_repos}</p>
            <p>⭐ Starred Repos: {userData.starred_url || "N/A"}</p>
            <p>🏢 Company: {userData.company || "N/A"}</p>
            <p>📍 Location: {userData.location || "N/A"}</p>
            <p>🕑 Created At: {new Date(userData.created_at).toDateString()}</p>

            {/* Links */}
            <div className="mt-4">
              <a
                href={userData.html_url}
                target="_blank"
                className="text-blue-400 hover:underline block"
                rel="noopener noreferrer"
              >
                🔗 View GitHub Profile
              </a>
              <a
                href={`${userData.html_url}?tab=repositories`}
                target="_blank"
                className="text-blue-400 hover:underline block"
                rel="noopener noreferrer"
              >
                📂 View Repositories
              </a>
              <a
                href={`${userData.html_url}?tab=stars`}
                target="_blank"
                className="text-blue-400 hover:underline block"
                rel="noopener noreferrer"
              >
                ⭐ View Starred Repos
              </a>
            </div>

            {/* Close Button */}
            <button
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg w-full"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
