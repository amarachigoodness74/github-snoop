import { useEffect, useState } from "react";

const RepoData = ({ url }: { url: string }) => {
  const [statData, setStatData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatData = async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${url}`);
      if (!response.ok) throw new Error("There was an error");
      const data = await response.json();
      console.log("==============", data);
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
  }, [url]);

  return <div className="flex flex-col md:flex-row gap-6"></div>;
};

export default RepoData;
