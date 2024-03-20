import { type Comment } from './types';
import { ACTION_IDENTIFY_TEXT } from './constants';

export function isAlreadyCommented(
  comments: Comment[],
  option: { debug: boolean },
): boolean {
  const comment = comments.find((comment) =>
    comment.body?.startsWith(ACTION_IDENTIFY_TEXT),
  );
  if (option.debug) {
    console.log('a recommending comment has already been posted', comment);
  }
  return !!comment;
}
