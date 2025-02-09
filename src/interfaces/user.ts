export interface IUserData {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
  bio: string;
  html_url: string;
  blog?: string;
  company?: string;
  email?: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  location?: string;
  twitter_username?: string;
  received_events_url?: string;
  events_url?: string;
  created_at: string;
}

export interface IUsersResponse {
  users: IUserData[];
  totalUsers: number;
  hasMore: boolean;
}

export interface IUserSession {
  user: {
    name: string;
    email: string;
    image: string;
  };
  expires: string;
}
