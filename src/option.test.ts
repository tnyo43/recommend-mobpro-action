import { getOption } from './option';
import { context } from '@actions/github';

const mockedContext = jest.mocked(context);

const OPTIONS = {
  github_token: 'token:123',
  threshold: 100,
  debug: 'false',
};

jest.mock('@actions/core', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getInput: (name: string) => (OPTIONS as any)[name],
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
      token: 'token:123',
      prNumber: 5,
      threshold: 100,
      debug: false,
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
      token: 'token:123',
      prNumber: 5,
      threshold: 100,
      debug: false,
    });
  });
});
