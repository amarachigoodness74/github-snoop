import { useEffect, useState } from "react";
import RepoData from "./RepositoryData";
import FollowData from "./FollowData";
import { Stat } from "@/interfaces/user";

const statToComponent = {
  repo: RepoData,
  follow: FollowData,
};

const UserStats = ({
  selectedStat,
}: {
  selectedStat: Stat;
}) => {
  const [statData, setStatData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { type } = selectedStat;

  return <div className="flex flex-col md:flex-row gap-6"></div>;
};

export default UserStats;
