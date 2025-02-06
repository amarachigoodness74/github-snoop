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
  followers_url: string;
  following: number;
  following_url: string;
  public_repos: number;
  repos_url: string;
  public_gists: number;
  gists_url: string;
  starred_url: string;
  organizations_ur: string;
  location?: string;
  twitter_username?: string;
  url?: string;
  user_view_type?: string;
  received_events_url?: string;
  events_url?: string;
  created_at: string;
  updated_at: string;
}

export enum StatType {
  Follow = "follow",
  Repo = "repo",
  Event = "event",
  Gist = "gist",
  Org = "organization",
}

export type Stat = {
  stat: string;
  type: StatType;
  username: string;
};
