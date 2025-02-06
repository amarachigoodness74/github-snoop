import { useEffect, useState } from "react";
import RepoData from "./RepositoryData";
import FollowData from "./FollowData";
import { Stat } from "@/interfaces/user";
import EventData from "./EventData";
import GistData from "./GistData";
import OrganizationData from "./OrganizationData";

const statToTitle = {
  orgs: "Organization",
  events: "GitHub Events",
  received_events: "Recieved Events",
  starred: "Starred Repos",
  gists: "Public Gists",
  repos: "Public Repos",
  following: "Following",
  followers: "Followers",
};

const typeToComponent = {
  repo: RepoData,
  follow: FollowData,
  event: EventData,
  gist: GistData,
  organization: OrganizationData,
};

const UserStats = ({ selectedStat }: { selectedStat: Stat }) => {
  const [statData, setStatData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { type, stat, username } = selectedStat;

  const fetchStatData = async () => {
    if (!selectedStat) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/${stat}`
      );
      if (!response.ok) throw new Error("There was an error getting stat");
      const data = await response.json();
      setStatData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setStatData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatData();
  }, [selectedStat]);

  // Dynamically select the component based on `type`
  const Component = typeToComponent[type];
  const title = statToTitle[stat];

  if (loading) {
    return <div className="text-green-500">Loading...</div>;
  }

  if (statData && statData.length < 1) {
    return <h2>No {title}</h2>;
  }

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      {statData && Component ? (
        <Component statData={statData} title={title} />
      ) : null}
    </>
  );
};

export default UserStats;
