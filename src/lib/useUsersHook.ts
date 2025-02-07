import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { IUserData } from "@/interfaces/user";

const fetchUsers = async ({ pageParam = 1, search = "" }) => {
  try {
    const res = await fetch(
      `/api/getUsers?page=${pageParam}&limit=10&search=${search}`
    );
    return res.json();
  } catch (error: any) {
    return error.message;
  }
};

export const fetchUserStats = async ({
  username,
  stat,
  pageParam = 1,
  perPage,
}: {
  username: string;
  stat: string;
  pageParam?: number;
  perPage: number;
}) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/${stat}?per_page=${perPage}&page=${pageParam}`
  );
  if (!response.ok) throw new Error("Error fetching data");
  return response.json();
};

export const addUser = async (newUser: IUserData) => {
  const res = await fetch("/api/addUser", {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const useUsers = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["users", search],
    queryFn: ({ pageParam }) => fetchUsers({ pageParam, search }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });
};
