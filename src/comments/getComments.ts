import { type Octokit } from 'octokit'
import { type User } from './types'
import { getLoginNames } from './getLoginNames'

type Args = {
  owner: string
  repo: string
  prNumber: number
}

export async function getComments(octokit: Octokit, args: Args) {
  const { owner, repo, prNumber } = args

  const comments = (
    await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber
    })
  ).data
  const reviewComments = (
    await octokit.rest.pulls.listReviewComments({
      owner,
      repo,
      pull_number: prNumber
    })
  ).data

  const users1: User[] = comments
    .map(comment => comment.user)
    .filter((user): user is Exclude<typeof user, null> => user !== null)
  const users2: User[] = reviewComments
    .map(comment => comment.user)
    .filter((user): user is Exclude<typeof user, null> => user !== null)

  const logins = getLoginNames(users1.concat(users2))
}
