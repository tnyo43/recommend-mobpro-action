import {
  type CommentContent,
  type Octokit,
  type OctokitContext,
  type User,
} from './types';
import { getLoginNames } from './getLoginNames';
import { getExistingCommentUrl } from './getExistingCommentUrl';

export async function getCommentContent(
  octokit: Octokit,
  octokitContext: OctokitContext,
  threshold: number,
): Promise<CommentContent | null> {
  const { owner, repo, prNumber } = octokitContext;

  const comments = (
    await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber,
    })
  ).data;

  const existingCommentUrl = getExistingCommentUrl(comments);
  if (!existingCommentUrl) {
    console.log(
      'a recommending comment has already been posted: ',
      existingCommentUrl,
    );
    return null;
  }

  const reviewComments = (
    await octokit.rest.pulls.listReviewComments({
      owner,
      repo,
      pull_number: prNumber,
    })
  ).data;

  const numberOfComments = comments.length + reviewComments.length;
  console.log('number of the obtained comments is ', numberOfComments);

  if (numberOfComments < threshold) {
    console.log("It's not necessary to send a recommending comment yet.");
    return null;
  }

  const users1: User[] = comments
    .map((comment) => comment.user)
    .filter((user): user is Exclude<typeof user, null> => user !== null);
  const users2: User[] = reviewComments
    .map((comment) => comment.user)
    .filter((user): user is Exclude<typeof user, null> => user !== null);

  const logins = getLoginNames(users1.concat(users2));

  return {
    logins,
  };
}
