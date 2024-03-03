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
      Number(core.getInput('github_token', { required: false }))
    if (isNaN(prNumber) || prNumber === 0) {
      core.setFailed('pr number is not set properly')
      return
    }

    const token = core.getInput('github_token', { required: true })
    const octokit = getOctokit(token)
    const owner = context.repo.owner
    const repo = context.repo.repo

    core.debug(`owner: ${owner}, repo: ${repo}, PR #${prNumber}`)

    const comments = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber
    })
    const reviewComments = await octokit.rest.pulls.listReviewComments({
      owner,
      repo,
      pull_number: prNumber
    })

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `the number of the comments is ${comments.data.length}\ncontents: \n${comments.data.map(c => `- ${c.user?.name}, ${c.body}`).join('\n')}
      
      the number of the review comments is ${reviewComments.data.length}\ncontents: \n${reviewComments.data.map(c => `- ${c.user?.name}, ${c.body}`).join('\n')}`
    })
    core.debug(`Commented on PR #${prNumber}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
