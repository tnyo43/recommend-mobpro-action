import * as core from '@actions/core'
import { getOctokit, context } from '@actions/github'

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
    ).data.filter(c => c.user?.login === 'github-actions[bot]')

    const reviewComments = (
      await octokit.rest.pulls.listReviewComments({
        owner,
        repo,
        pull_number: prNumber
      })
    ).data

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `the number of the comments is ${comments.length}\n

      the number of the review comments is ${reviewComments.length}\n`
    })
    core.debug(`Commented on PR #${prNumber}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
