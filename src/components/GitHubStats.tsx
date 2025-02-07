import React from "react";

import clsx from "clsx";
import { GroupName, IUserData, Stat, StatType } from "@/interfaces/user";

const GitHubStats = ({
  userData,
  handleSelectStat,
  className = "",
}: {
  userData: IUserData;
  handleSelectStat: (stat: Stat) => void;
  className?: string;
}) => {
  return (
    <div className={clsx("bg-gray-800 p-6 rounded-lg", className)}>
      <h3 className="text-lg font-semibold text-white mb-4">GitHub Stats</h3>
      <div className="text-md text-gray-300 space-y-2">
        <p
          className="cursor-pointer hover:text-blue-400"
          onClick={() =>
            handleSelectStat({
              username: userData.login,
              type: StatType.Follow,
              stat: "followers",
              group: GroupName.Card,
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
              group: GroupName.Card,
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
              group: GroupName.Table,
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
              group: GroupName.Table,
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
              group: GroupName.Table,
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
              group: GroupName.Card,
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
                group: GroupName.Card,
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
                group: GroupName.Card,
              })
            }
          >
            🏷️ Received Events
          </p>
        )}
      </div>
    </div>
  );
};

export default GitHubStats;
