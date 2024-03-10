import {
  type CommentContent,
  type Octokit,
  type OctokitContext,
  type User
} from './types'
import { getLoginNames } from './getLoginNames'
import { isAlreadyCommented } from './isAlreadyCommented'

type Args = {
  threshold: number
}

export async function getCommentContent(
  octokit: Octokit,
  octokitContext: OctokitContext,
  args: Args
): Promise<CommentContent | null> {
  const { owner, repo, prNumber } = octokitContext

  const comments = (
    await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber
    })
  ).data

  if (isAlreadyCommented(comments)) {
    return null
  }

  const reviewComments = (
    await octokit.rest.pulls.listReviewComments({
      owner,
      repo,
      pull_number: prNumber
    })
  ).data

  const numberOfComments = comments.length + reviewComments.length
  if (numberOfComments < args.threshold) {
    return null
  }

  const users1: User[] = comments
    .map(comment => comment.user)
    .filter((user): user is Exclude<typeof user, null> => user !== null)
  const users2: User[] = reviewComments
    .map(comment => comment.user)
    .filter((user): user is Exclude<typeof user, null> => user !== null)

  const logins = getLoginNames(users1.concat(users2))

  return {
    logins,
    numberOfComments,
    threshold: args.threshold
  }
}
