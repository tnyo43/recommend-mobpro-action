import { type Comment } from './types';
import { ACTION_IDENTIFY_TEXT } from './constants';

export function getExistingCommentUrl(comments: Comment[]): string | undefined {
  const comment = comments.find((comment) =>
    comment.body?.startsWith(ACTION_IDENTIFY_TEXT),
  );
  return comment?.html_url;
}
