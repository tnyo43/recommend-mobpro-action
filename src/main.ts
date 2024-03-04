import * as core from '@actions/core'
import { getOctokit, context } from '@actions/github'

const uniqueStringArray = (texts: string[]): string[] => {
  if (texts.length === 0) return []

  const sorted = texts.sort()
  const result = [sorted[0]]

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] !== sorted[i]) {
      result.push(sorted[i + 1])
    }
  }

  return result
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const prNumber =
      context.payload.pull_request?.number ||
      Number(core.getInput('pr_number', { required: false }))
    if (isNaN(prNumber) || prNumber === 0) {
      core.setFailed('pr number is not set properly')
      return
    }

    const token = core.getInput('github_token', { required: true })
    const octokit = getOctokit(token)
    const owner = context.repo.owner
    const repo = context.repo.repo

    core.debug(`owner: ${owner}, repo: ${repo}, PR #${prNumber}`)

    const comments = (
      await octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: prNumber
      })
    ).data.filter(c => c.user?.type !== 'Bot')

    const reviewComments = (
      await octokit.rest.pulls.listReviewComments({
        owner,
        repo,
        pull_number: prNumber
      })
    ).data.filter(c => c.user.type !== 'Bot')

    const hasMessageSent = comments.some(
      comment =>
        comment.user?.type === 'Bot' &&
        comment.body?.includes('It seems the discussion is dragging on.')
    )
    const threshold = Number(core.getInput('threshold', { required: true }))
    const commentCount = comments.length + reviewComments.length
    if (commentCount < threshold || hasMessageSent) {
      core.debug('a message has been sent')
      return
    }

    const userLogins = uniqueStringArray(
      comments
        .map(comment => comment.user?.login)
        .concat(reviewComments.map(comment => comment.user.login))
        .filter((comment): comment is string => !!comment)
    ).map(login => `@${login}`)

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `Hey ${userLogins.join(', ')}!

It seems the discussion is dragging on. Perhaps instead of text communication, you could try having a conversation via face-to-face or video call, or even try mob programming?

the number of the comments is ${comments.length} and the review comments is ${reviewComments.length}`
    })
    core.debug(`Commented on PR #${prNumber}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
