export type PullRequestsData = {
  myOpenPRs: {
    issueCount: number;
    nodes: PullRequestNode[];
  };
  assignedOpenPRs: {
    issueCount: number;
    nodes: PullRequestNode[];
  };
  myClosedRecentPRs: {
    issueCount: number;
    nodes: PullRequestNode[];
  };
  assignedClosedRecentPRs: {
    issueCount: number;
    nodes: PullRequestNode[];
  };
};

export type PullRequestNode = {
  id: string;
  number: number;
  title: string;
  url: string;
  repository: {
    nameWithOwner: string;
    isPrivate: boolean;
  };
  createdAt: string;
  updatedAt: string | null;
  closedAt: string | null;
  merged: boolean | null;
  state: "OPEN" | "CLOSED" | "MERGED";
};

const pullRequestNodeQuery = `{
    id
    number
    title
    url
    repository { nameWithOwner isPrivate }
    createdAt
    updatedAt
    closedAt
    merged
    state
}`;

export const pullRequestsQuery = `
    query GetMyPRBuckets(
      $myOpenQuery: String!
      $assignedOpenQuery: String!
      $myClosedRecentQuery: String!
      $assignedClosedRecentQuery: String!
    ) {
      myOpenPRs: search(query: $myOpenQuery, type: ISSUE, first: 100) {
        issueCount
        nodes {
          ... on PullRequest ${pullRequestNodeQuery}
        }
      }

      assignedOpenPRs: search(query: $assignedOpenQuery, type: ISSUE, first: 100) {
        issueCount
        nodes {
          ... on PullRequest ${pullRequestNodeQuery}
            
        }
      }

      myClosedRecentPRs: search(query: $myClosedRecentQuery, type: ISSUE, first: 100) {
        issueCount
        nodes {
          ... on PullRequest ${pullRequestNodeQuery}
        }
      }

      assignedClosedRecentPRs: search(query: $assignedClosedRecentQuery, type: ISSUE, first: 100) {
        issueCount
        nodes {
          ... on PullRequest ${pullRequestNodeQuery}
        }
      }
    }
  `;
