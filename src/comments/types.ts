import { getOctokit } from '@actions/github';

export type Octokit = ReturnType<typeof getOctokit>;

export type OctokitContext = {
  owner: string;
  repo: string;
  prNumber: number;
};

export type User = {
  // login id of user: ex. tnyo43
  login: string;

  // type of user: "User" or "Bot"
  type: string;
};

export type Comment = {
  user: User | null;
  body?: string;
  html_url: string;
};

export type CommentContent = {
  logins: string[];

  numberOfComments: number;
  threshold: number;
};
