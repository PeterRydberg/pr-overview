export const pullRequestList = {
  in: "in",
  myOpenPRs: {
    title: "Opened by me",
    none: "No open PRs created by you.",
  },
  assignedOpenPRs: {
    title: "Needs my review",
    none: "No open PRs assigned to you for review.",
  },
  closedPRs: {
    title: "Merged & closed",
    none: "No recently closed PRs.",
  },
} as const;
