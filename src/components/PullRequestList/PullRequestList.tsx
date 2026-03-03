import { Octokit } from "octokit";
import { pullRequestsQuery, type PullRequestsData } from "../../lib/queries/pull_requests";
import type { User } from "better-auth";
import { useEffect, useState } from "react";

interface PullRequestsListProps {
  accessToken: string;
  user: User | null;
}

export const PullRequestList = ({ accessToken, user }: PullRequestsListProps) => {
  const [pullRequests, setPullRequests] = useState<PullRequestsData | null>(null);

  useEffect(() => {
    const fetchPRs = async () => {
      if (pullRequests !== null) {
        return;
      }

      if (!accessToken || !user) {
        console.error("No access accessToken or user found. Something doesn't work");
        return;
      }

      const octokit = new Octokit({ auth: accessToken });

      // Ideally, I should be able to add this `review-requested:${login} OR ${joinedTeamsFilter}`.
      // This does not work, see https://github.com/orgs/community/discussions/5289?sort=old
      /*const teams = await octokit.rest.teams.listForAuthenticatedUser();
      const joinedTeamsFilter = teams.data
      .map(
        (team) => `team-review-requested:${team.organization.login}/${team.slug}`,
        )
        .join(" AND ");*/

      const login = "@me";
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      const prResponse = await octokit.graphql<PullRequestsData>(pullRequestsQuery, {
        myOpenQuery: `is:pr is:open author:${login}`,
        assignedOpenQuery: `is:pr is:open review-requested:${login}`,
        myClosedRecentQuery: `is:pr is:closed author:${login} closed:>=${twoWeeksAgo}`,
        assignedClosedRecentQuery: `is:pr is:closed reviewed-by:@me closed:>=${twoWeeksAgo}`,
      });
      setPullRequests(prResponse);
    };

    void fetchPRs();
  }, [accessToken, user]);

  const closedPRs = [
    ...(pullRequests?.myClosedRecentPRs.nodes || []),
    ...(pullRequests?.assignedClosedRecentPRs.nodes || []),
  ]
    .filter((pr, index, self) => index === self.findIndex((p) => p.id === pr.id))
    .sort((a, b) => new Date(b.closedAt ?? 0).getTime() - new Date(a.closedAt ?? 0).getTime());

  return (
    <div>
      <h1>My Open PRs</h1>
      <ul>
        {pullRequests?.myOpenPRs.nodes.map((pr) => (
          <li key={pr.id}>
            <a href={pr.url}>{pr.title}</a> in {pr.repository.nameWithOwner}
          </li>
        ))}
      </ul>

      <h1>Assigned Open PRs</h1>
      <ul>
        {pullRequests?.assignedOpenPRs.nodes.map((pr) => (
          <li key={pr.id}>
            <a href={pr.url}>{pr.title}</a> in {pr.repository.nameWithOwner}
          </li>
        ))}
      </ul>

      <h1>Closed PRs</h1>
      <ul>
        {closedPRs.map((pr) => (
          <li key={pr.id}>
            <a href={pr.url}>{pr.title}</a> in {pr.repository.nameWithOwner}
          </li>
        ))}
      </ul>
    </div>
  );
};
