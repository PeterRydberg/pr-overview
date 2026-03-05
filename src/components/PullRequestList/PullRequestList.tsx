import type { User } from "better-auth";
import { Octokit } from "octokit";
import { useEffect, useState } from "react";
import { getTranslations } from "../../i18n/utils";
import { pullRequestsQuery, type PullRequestsData } from "../../lib/queries/pull_requests";
import styles from "./PullRequestList.module.css";
import { Avatar } from "../Avatar/Avatar";

interface PullRequestsListProps {
  accessToken: string;
  user: User | null;
  locale?: string;
}

export const PullRequestList = ({ accessToken, user, locale }: PullRequestsListProps) => {
  const [pullRequests, setPullRequests] = useState<PullRequestsData | null>(null);
  const t = getTranslations(locale);

  useEffect(() => {
    const fetchPRs = async () => {
      if (pullRequests !== null) return;

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

  const fetchedPRs = pullRequests !== null;
  const openPRs = pullRequests?.myOpenPRs.nodes;
  const openAssignedPRs = pullRequests?.assignedOpenPRs.nodes;
  const closedPRs = [
    ...(pullRequests?.myClosedRecentPRs.nodes || []),
    ...(pullRequests?.assignedClosedRecentPRs.nodes || []),
  ]
    .filter((pr, index, self) => index === self.findIndex((p) => p.id === pr.id))
    .sort((a, b) => new Date(b.closedAt ?? 0).getTime() - new Date(a.closedAt ?? 0).getTime());

  return (
    <div className={styles.prContainer}>
      <h1>{t("pullRequestList.myOpenPRs.title")}</h1>

      {fetchedPRs && openPRs?.length === 0 && (
        <p className={styles.prNoneText}>{t("pullRequestList.myOpenPRs.none")}</p>
      )}

      <ul className={styles.prList}>
        {openPRs?.map((pr) => (
          <li key={pr.id} className={styles.prListItem}>
            <a href={pr.url} target="_blank" rel="noopener noreferrer" className={styles.prLink}>
              <div className={styles.prInfo}>
                <span className={styles.prTitle}>{pr.title}</span>
                <span className={styles.prRepo}>
                  {t("pullRequestList.in")} {pr.repository.nameWithOwner}
                </span>
              </div>

              {pr.author && <Avatar name={pr.author.login} image={pr.author.avatarUrl} />}
            </a>
          </li>
        ))}
      </ul>

      <h1>{t("pullRequestList.assignedOpenPRs.title")}</h1>

      {fetchedPRs && openAssignedPRs?.length === 0 && (
        <p className={styles.prNoneText}>{t("pullRequestList.assignedOpenPRs.none")}</p>
      )}

      <ul className={styles.prList}>
        {openAssignedPRs?.map((pr) => (
          <li key={pr.id} className={styles.prListItem}>
            <a href={pr.url} target="_blank" rel="noopener noreferrer" className={styles.prLink}>
              <div className={styles.prInfo}>
                <span className={styles.prTitle}>{pr.title}</span>
                <span className={styles.prRepo}>
                  {t("pullRequestList.in")} {pr.repository.nameWithOwner}
                </span>
              </div>

              {pr.author && <Avatar name={pr.author.login} image={pr.author.avatarUrl} />}
            </a>
          </li>
        ))}
      </ul>

      <h1>{t("pullRequestList.closedPRs.title")}</h1>

      {fetchedPRs && closedPRs.length === 0 && (
        <p className={styles.prNoneText}>{t("pullRequestList.closedPRs.none")}</p>
      )}

      <ul className={styles.prList}>
        {closedPRs.map((pr) => (
          <li key={pr.id} className={styles.prListItem}>
            <a href={pr.url} target="_blank" rel="noopener noreferrer" className={styles.prLink}>
              <div className={styles.prInfo}>
                <span className={styles.prTitle}>{pr.title}</span>
                <span className={styles.prRepo}>
                  {t("pullRequestList.in")} {pr.repository.nameWithOwner}
                </span>
              </div>

              {pr.author && <Avatar name={pr.author.login} image={pr.author.avatarUrl} />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
