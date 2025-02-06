export interface IGist {
  id: number;
  name?: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  updated_at: string;
}
