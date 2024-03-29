import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';

type Option = {
  debug: boolean;
  token: string;
  prNumber: number;
  threshold: number;
};

function getPrNumber() {
  return (
    context.payload.issue?.number ||
    context.payload.pull_request?.number ||
    // expect to either issue.number or pull_request.number be non-undefined, so it wouldn't be NaN
    NaN
  );
}

export function getOption(): Option {
  const token = getInput('github_token', { required: true });

  const prNumber = getPrNumber();
  if (isNaN(prNumber)) {
    setFailed('fail to get pr number');
  }

  const threshold = Number(getInput('threshold', { required: true }));

  const debug = getInput('debug', { required: false }) === 'true';

  const option = {
    token,
    prNumber,
    threshold,
    debug,
  };

  if (debug) {
    console.log('******* DEBUG is ENABLED *******');
    console.log('option', option);
  }

  return option;
}
