import * as core from '@actions/core';
import { getOctokit, context } from '@actions/github';
import { getOption } from './option';
import { getCommentContent } from './comments/getCommentContent';
import { OctokitContext } from './comments/types';
import { postComment } from './comments/postComment';
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const { token, prNumber, threshold, debug } = getOption();

    const octokit = getOctokit(token);
    const octokitContext: OctokitContext = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      prNumber,
    };

    const commentContent = await getCommentContent(
      octokit,
      octokitContext,
      threshold,
      { debug },
    );

    if (commentContent) {
      await postComment(octokit, octokitContext, commentContent);
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
