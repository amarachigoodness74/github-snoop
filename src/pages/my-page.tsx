"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Stat } from "@/interfaces/others";
import { IUserData } from "@/interfaces/user";
import UserStats from "@/components/UserStats";
import Line from "@/components/Line";
import GitHubSearch from "@/components/GitHubSearch";
import UserCard from "@/components/UserCard";
import GitHubStats from "@/components/GitHubStats";
import { addUser, fetchUsers, statToTitle } from "@/lib/utils";
import LogoutBtn from "@/components/LogoutBtn";
import SlideUserStats from "@/components/SlideUserStats";
import ScrollToTop from "@/components/ScroolToTopBtn";

const UsersPage = () => {
  const { data: session, status } = useSession();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);
  const [saving, setSaving] = useState(false);
  const [hoverStates, setHoverStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleMouseEnter = (userId: string) => {
    setHoverStates((prev) => ({ ...prev, [userId]: true }));
  };

  const handleMouseLeave = (userId: string) => {
    setHoverStates((prev) => ({ ...prev, [userId]: false }));
  };

  const handleSelectStat = (stat: Stat) => {
    setSelectedStat(stat);
  };

  const title: string =
    statToTitle[selectedStat?.stat as keyof typeof statToTitle];

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: infiniteLoading,
  } = useInfiniteQuery({
    queryKey: ["users", search],
    queryFn: ({ pageParam = 1 }) =>
      fetchUsers({ pageParam, limit: 12, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/");
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (userData) {
      setSaving(true);
      mutation.mutate(userData, {
        onSettled: () => {
          setSaving(false);
        },
      });
    }
    setSearch("");
  }, [userData]);

  // Scroll Observer for Lazy Loading
  useEffect(() => {
    if (!loadMoreRef.current) return;
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
  }, [fetchNextPage, hasNextPage]);

  return (
    <>
      {session && (
        <div className="fixed top-0 right-0 z-50">
          <LogoutBtn />
        </div>
      )}
      <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
        <GitHubSearch
          username={username}
          setUserData={setUserData}
          setUsername={setUsername}
          saving={saving}
        />
        <Line />

        {/* Search Input */}
        {(search !== "" ||
          (data?.pages[0]?.users && data?.pages[0]?.users.length > 3)) && (
          <div className="flex justify-start relative w-full max-w-xs my-4 self-start">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 rounded-l bg-blue-800 text-white focus:outline-none w-full pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-0 bg-gray-200 text-gray-600 py-2 px-3 hover:bg-gray-300 rounded-r"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="text-lg text-red-500 text-center">
            {(error as Error).message}
          </p>
        )}
        {infiniteLoading && (
          <p className="text-lg text-green-500 text-center">Loading...</p>
        )}

        {!infiniteLoading && data?.pages && (
          <>
            {data?.pages.map((page, index) => (
              <div key={index}>
                {page?.users && page?.users.length === 0 && (
                  <h3 className="flex justify-start self-start text-xl text-center text-bold">
                    No users found
                  </h3>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {page?.users &&
                    page?.users?.length > 0 &&
                    page?.users.map((userData: IUserData) => (
                      <div
                        className="relative bg-gray-800 p-6 rounded-lg text-center flex flex-col items-center justify-between w-full min-h-[300px] h-full"
                        key={userData.id}
                      >
                        <UserCard
                          userData={userData}
                          onHoverEnter={() => handleMouseEnter(userData.id)}
                          className="transition duration-300"
                        />

                        {/* GitHub Stats - Initially Hidden, Shows on Hover */}
                        {hoverStates[userData.id] && (
                          <GitHubStats
                            userData={userData}
                            handleSelectStat={handleSelectStat}
                            onHoverLeave={() => handleMouseLeave(userData.id)}
                            className="absolute min-h-[300px] h-full top-0 left-0 right-0 w-full transition duration-300"
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Load More Button */}
        <div ref={loadMoreRef} className="h-10" />
        {isFetchingNextPage && (
          <p className="text-gray-400 text-center">Loading more...</p>
        )}

        <ScrollToTop />

        {selectedStat && (
          <SlideUserStats
            title={title}
            selectedStat={selectedStat}
            setSelectedStat={setSelectedStat}
          />
        )}
      </div>
    </>
  );
};

export default UsersPage;
