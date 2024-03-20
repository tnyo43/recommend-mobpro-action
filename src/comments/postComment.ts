import { setFailed } from '@actions/core';
import { ACTION_IDENTIFY_TEXT } from './constants';
import {
  type CommentContent,
  type Octokit,
  type OctokitContext,
} from './types';

function MainText(content: CommentContent) {
  return `
Hey ${content.logins.map((login) => '@' + login).join(', ')}!

It seems the discussion is dragging on. Perhaps instead of text communication, you could try having a conversation via face-to-face or video call, or even try mob programming?
`;
}

function getText(content: CommentContent) {
  return `${ACTION_IDENTIFY_TEXT}

${MainText(content)}
`;
}

export async function postComment(
  octokit: Octokit,
  octokitContext: OctokitContext,
  content: CommentContent,
) {
  const { owner, repo, prNumber } = octokitContext;

  try {
    const result = await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: getText(content),
    });

    console.log(
      'a recommending comment has been posted: ',
      result.data.html_url,
    );
  } catch (error) {
    console.error(error);
    setFailed('failed to post comment');
  }
}
