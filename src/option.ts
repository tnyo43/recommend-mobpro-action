import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'

type Option = {
  token: string
  prNumber: number
}

function getPrNumber() {
  if (typeof context.payload.pull_request?.number === 'number') {
    return context.payload.pull_request.number
  }

  const url = getInput('pr_url', { required: false })
  const numberFromUrl = Number(url.substring(url.lastIndexOf('/') + 1))
  return numberFromUrl
}

export function getOption(): Option {
  const token = getInput('github_token', { required: true })

  const prNumber = getPrNumber()
  if (isNaN(prNumber) || prNumber === 0) {
    setFailed('pr number is not set properly')
  }

  return {
    token,
    prNumber
  }
}
