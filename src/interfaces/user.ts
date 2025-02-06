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
