"use client";

import { useEffect, useState } from "react";
import { IUserData } from "@/interfaces/user";
import { GroupName, Stat, StatType } from "@/interfaces/others";
import UserStats from "@/components/UserStats";
import Line from "@/components/Line";
import GitHubSearch from "@/components/GitHubSearch";
import UserCard from "@/components/UserCard";
import GitHubStats from "@/components/GitHubStats";
import { statToTitle } from "@/lib/utils";
import SlideUserStats from "@/components/SlideUserStats";
import ScrollToTop from "@/components/ScroolToTopBtn";

const PublicUser = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);

  const handleSelectStat = (stat: Stat) => {
    setSelectedStat(stat);
  };

  const title: string =
    statToTitle[selectedStat?.stat as keyof typeof statToTitle];

  useEffect(() => {
    const isMdScreen = window.matchMedia("(min-width: 768px)").matches;
    if (!isMdScreen) return; // Run only on md: and larger

    handleSelectStat({
      username,
      type: StatType.Follow,
      stat: "followers",
      group: GroupName.Card,
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

          <div className="flex flex-col gap-6 w-[80vw] md:flex-row w-full">
            <div className="w-full md:w-2/6 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
              <UserCard userData={userData} />

              <GitHubStats
                userData={userData}
                handleSelectStat={handleSelectStat}
                className="mt-6 w-90"
              />
            </div>
            <ScrollToTop />

            {/* Larger Device */}
            {userData && selectedStat && (
              <div className="hidden md:block w-full md:w-4/6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-4 py-2">
                  {title}
                </h3>
                <UserStats selectedStat={selectedStat} />
              </div>
            )}

            {/* Mobile Device */}
            {selectedStat && (
              <div className="md:hidden">
                <SlideUserStats
                  title={title}
                  selectedStat={selectedStat}
                  setSelectedStat={setSelectedStat}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PublicUser;
