import { type User } from './types';

function uniqueStringArray(texts: string[]): string[] {
  if (texts.length === 0) return [];

  const sorted = texts.sort();
  const result = [sorted[0]];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] !== sorted[i]) {
      result.push(sorted[i + 1]);
    }
  }

  return result;
}

export function getLoginNames(users: User[]): string[] {
  const loginNameArray = users
    .filter((user) => user.type === 'User')
    .map((user) => user.login);

  return uniqueStringArray(loginNameArray);
}
