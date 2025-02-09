export enum StatType {
  Follow = "follow",
  Repo = "repo",
  Event = "event",
  Gist = "gist",
  Org = "organization",
}

export enum GroupName {
  Card = "card",
  Table = "table",
}

export type Stat = {
  stat: string;
  type: StatType;
  username: string;
  group?: GroupName;
};
