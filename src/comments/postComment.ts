import { ACTION_IDENTIFY_TEXT } from './constants';
import {
  type CommentContent,
  type Octokit,
  type OctokitContext,
} from './types';

function MainText(content: CommentContent) {
  return `
Hey ${content.logins.join(', ')}!

It seems the discussion is dragging on. Perhaps instead of text communication, you could try having a conversation via face-to-face or video call, or even try mob programming?
`;
}
function debugText(content: CommentContent) {
  return `
<details>
<summary>number of comments</summary>
the number of the comments is ${content.numberOfComments}
threshold: ${content.threshold}
</details>
`;
}

function getText(content: CommentContent) {
  return `${ACTION_IDENTIFY_TEXT}

${MainText(content)}

${debugText(content)}
`;
}

export async function postComment(
  octokit: Octokit,
  octokitContext: OctokitContext,
  content: CommentContent,
) {
  const { owner, repo, prNumber } = octokitContext;

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: getText(content),
  });
}
