import { getLoginNames } from './getLoginNames'

test('if the input is an empty array, the output is also empty', () => {
  const result = getLoginNames([])
  expect(result).toStrictEqual([])
})

describe('if the input is an array without duplicates, the output is a array with the same elements in alphabetical order', () => {
  test('in case: ["alice", "bob", "chris"]', () => {
    const result = getLoginNames([
      { login: 'alice', type: 'User' },
      { login: 'bob', type: 'User' },
      { login: 'chris', type: 'User' }
    ])
    expect(result).toStrictEqual(['alice', 'bob', 'chris'])
  })

  test('in case: ["freddy", "eric", "daniel"]', () => {
    const result = getLoginNames([
      { login: 'freddy', type: 'User' },
      { login: 'eric', type: 'User' },
      { login: 'daniel', type: 'User' }
    ])
    expect(result).toStrictEqual(['daniel', 'eric', 'freddy'])
  })
})

describe('if the input is an array containing duplicates, the output is an array where each name appears only once', () => {
  test('in case: ["alice", "bob", "chris", "alice", "chris", "alice"]', () => {
    const result = getLoginNames([
      { login: 'alice', type: 'User' },
      { login: 'bob', type: 'User' },
      { login: 'chris', type: 'User' },
      { login: 'alice', type: 'User' },
      { login: 'chris', type: 'User' },
      { login: 'alice', type: 'User' }
    ])
    expect(result).toStrictEqual(['alice', 'bob', 'chris'])
  })
})

test('if the input has elements whose "type" property is "Bot", the output is an array without those elements', () => {
  const result = getLoginNames([
    { login: 'bot1', type: 'Bot' },
    { login: 'bob', type: 'User' },
    { login: 'chris', type: 'User' },
    { login: 'bot2', type: 'Bot' },
    { login: 'bot3', type: 'Bot' },
    { login: 'bob', type: 'User' }
  ])
  expect(result).toStrictEqual(['bob', 'chris'])
})
