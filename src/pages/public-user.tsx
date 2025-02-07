"use client";

import { useEffect, useState } from "react";
import { IUserData, Stat, StatType } from "@/interfaces/user";
import UserStats from "@/components/UserStats";
import Line from "@/components/Line";
import GitHubSearch from "@/components/GitHubSearch";
import UserCard from "@/components/UserCard";
import GitHubStats from "@/components/GitHubStats";
import { statToTitle } from "@/lib/utils";

const PublicUser = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);

  // Function to handle stat selection
  const handleSelectStat = (stat: Stat) => {
    setSelectedStat(stat);
  };

  const title: string =
      statToTitle[selectedStat?.stat as keyof typeof statToTitle];

  useEffect(() => {
    handleSelectStat({
      type: StatType.Follow,
      username,
      stat: "followers",
    });
  }, [userData]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <GitHubSearch
        username={username}
        setUserData={setUserData}
        setUsername={setUsername}
      />

      {userData && (
        <>
          <Line />

          <div className="flex flex-col md:flex-row gap-6 w-[80vw]">
            <div className="w-2/6">
              <UserCard userData={userData} />

              <GitHubStats
                userData={userData}
                handleSelectStat={handleSelectStat}
                className="mt-6 w-90"
              />
            </div>

            {userData && selectedStat && (
              <div className="w-4/6">
                <h3 className="text-lg font-semibold text-white mb-4 py-2">
                  {title}
                </h3>
                <UserStats selectedStat={selectedStat} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PublicUser;
