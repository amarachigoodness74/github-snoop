"use client";

import { useEffect, useState } from "react";
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

const UsersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);

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
    queryFn: ({ pageParam = 1 }) => fetchUsers({ pageParam, search }),
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
      mutation.mutate(userData);
    }
    setSearch("");
  }, [userData]);

  return (
    <>
      {session && (
        <div className="fixed top-2 right-1">
          <LogoutBtn />
        </div>
      )}
      <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
        <GitHubSearch
          username={username}
          setUserData={setUserData}
          setUsername={setUsername}
        />
        <Line />

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
                {/* Search Input */}
                {page?.users && page?.users.length > 3 && (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {page?.users &&
                    page?.users?.length > 0 &&
                    page?.users.map((userData: IUserData) => (
                      <div
                        className="relative group bg-gray-800 p-6 rounded-lg text-center flex flex-col items-center justify-between w-full min-h-[300px] h-full"
                        key={userData.id}
                      >
                        <UserCard
                          userData={userData}
                          className="group-hover:opacity-50 transition duration-300"
                        />

                        {/* GitHub Stats - Initially Hidden, Shows on Hover */}
                        <GitHubStats
                          userData={userData}
                          handleSelectStat={handleSelectStat}
                          className="absolute top-0 left-0 right-0 w-full opacity-0 group-hover:opacity-100 transition duration-300"
                        />
                      </div>
                    ))}
                </div>
                {/* Load More Button */}
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                  </button>
                )}
              </div>
            ))}
          </>
        )}

        {selectedStat && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed top-0 right-0 w-4/6 h-full bg-gray-800 shadow-lg z-50 overflow-auto"
          >
            {/* Sticky header */}
            <div className="sticky top-0 w-full bg-gray-900 p-4 flex justify-between items-center z-50">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button
                className="text-white text-xl"
                onClick={() => setSelectedStat(null)}
              >
                ✖
              </button>
            </div>
            <div className="p-4">
              <UserStats selectedStat={selectedStat} />
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default UsersPage;
