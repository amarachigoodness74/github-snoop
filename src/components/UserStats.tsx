import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import RepoData from "./RepositoryData";
import FollowData from "./FollowData";
import { GroupName, Stat } from "@/interfaces/others";
import EventData from "./EventData";
import GistData from "./GistData";
import OrganizationData from "./OrganizationData";
import { fetchUserStats, statToTitle } from "@/lib/utils";

const typeToComponent = {
  repo: RepoData,
  follow: FollowData,
  event: EventData,
  gist: GistData,
  organization: OrganizationData,
};

const UserStats = ({ selectedStat }: { selectedStat: Stat }) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(1);
  const { username, stat, type, group } = selectedStat;
  const perPage = group === GroupName.Table ? 15 : 21;

  /*** PAGINATION LOGIC (TABLE) ***/
  const {
    data: paginatedData,
    error: paginatedError,
    isLoading: paginatedLoading,
    isFetching,
  } = useQuery({
    queryKey: ["userStats", username, stat, page],
    queryFn: () => fetchUserStats({ username, stat, pageParam: page, perPage }),
    staleTime: 5000,
    enabled: group === GroupName.Table, // Run only for tables
  });

  /*** LAZY LOADING LOGIC (CARD) ***/
  const {
    data: infiniteData,
    error: infiniteError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: infiniteLoading,
  } = useInfiniteQuery({
    queryKey: ["userStats", username, stat],
    queryFn: ({ pageParam = 1 }) =>
      fetchUserStats({ username, stat, pageParam, perPage }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === perPage ? pages.length + 1 : undefined,
    enabled: group === GroupName.Card, // Run only for cards
  });

  // Scroll Observer for Lazy Loading
  useEffect(() => {
    if (!loadMoreRef.current || group !== GroupName.Card) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, group]);

  // Dynamically select the component based on `type`
  const Component = typeToComponent[type];
  const title: string = statToTitle[stat as keyof typeof statToTitle];

  // Render PAGINATION
  if (group === GroupName.Table) {
    const hasNextPage = paginatedData?.length === perPage;
    if (paginatedLoading)
      return <div className="text-green-500">Loading...</div>;
    if (paginatedError)
      return (
        <p className="text-red-500">{(paginatedError as Error).message}</p>
      );
    if (paginatedData.length === 0) return <h2>No {title} found</h2>;
    return (
      <div>
        <Component statData={paginatedData || []} />
        <div className="flex justify-center space-x-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isFetching ? "Loading" : "Previous"}
          </button>
          <button
            disabled={!hasNextPage || paginatedLoading}
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isFetching ? "Loading" : "Next"}
          </button>
        </div>
      </div>
    );
  }

  // Render LAZY LOADING
  if (group === GroupName.Card) {
    if (infiniteLoading)
      return <div className="text-green-500">Loading...</div>;
    if (infiniteError)
      return <p className="text-red-500">{(infiniteError as Error).message}</p>;
    if (infiniteData?.pages.flat().length === 0)
      return <h2>No {title} found</h2>;

    return (
      <div className="space-y-4">
        {infiniteData && Component && (
          <Component statData={infiniteData.pages.flat()} />
        )}
        {/* Lazy Load Trigger */}
        <div ref={loadMoreRef} className="h-10" />
        {isFetchingNextPage && (
          <p className="text-gray-400 text-center">Loading more...</p>
        )}
      </div>
    );
  }

  return null;
};

export default UserStats;
