export type User = {
  // login id of user: ex. tnyo43
  login: string

  // type of user: "User" or "Bot"
  type: string
}

export type Comment = {
  user: User | null
  body?: string
}

export type CommentContent = {
  logins: string[]

  numberOfComments: number
  threshold: number
}
