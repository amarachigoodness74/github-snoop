import { IUserData, IUsersResponse } from "@/interfaces/user";

export const statToTitle = {
  orgs: "Organization",
  events: "GitHub Events",
  received_events: "Recieved Events",
  starred: "Starred Repos",
  gists: "Public Gists",
  repos: "Public Repos",
  following: "Following",
  followers: "Followers",
};

export const fetchUsers = async ({
  pageParam,
  limit,
  search,
}: {
  pageParam: number;
  limit: number;
  search: string;
}): Promise<IUsersResponse> => {
  try {
    const res = await fetch(
      `/api/getUsers?page=${pageParam}&limit=${limit}&search=${search}`
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
  const res = await fetch("/api/saveUser", {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};
