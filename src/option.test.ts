import { getOption } from './option';
import { context } from '@actions/github';

const mockedContext = jest.mocked(context);

jest.mock('@actions/core', () => ({
  getInput: (name: string) => {
    if (name === 'threshold') return '100';
    return `value-${name}`;
  },
  setFailed: () => {
    throw new Error();
  },
}));

describe('if the event is triggered by "pull_request_review_comment"', () => {
  beforeEach(() => {
    mockedContext.payload = {
      pull_request: {
        number: 5,
      },
      issue: undefined,
    };
  });

  test('return pr number from "context.payload.pull_request.number"', () => {
    const option = getOption();
    expect(option).toStrictEqual({
      prNumber: 5,
      threshold: 100,
      token: 'value-github_token',
    });
  });
});

describe('if the event is triggered by "issue_comment"', () => {
  beforeEach(() => {
    mockedContext.payload = {
      pull_request: undefined,
      issue: {
        number: 5,
      },
    };
  });

  test('return pr number from "context.payload.issue.number"', () => {
    const option = getOption();
    expect(option).toStrictEqual({
      prNumber: 5,
      threshold: 100,
      token: 'value-github_token',
    });
  });
});
