import { type Comment } from './types';
import { ACTION_IDENTIFY_TEXT } from './constants';

export function isAlreadyCommented(comments: Comment[]): boolean {
  return comments.some((comment) =>
    comment.body?.startsWith(ACTION_IDENTIFY_TEXT),
  );
}
