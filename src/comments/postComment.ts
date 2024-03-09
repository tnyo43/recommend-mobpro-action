import { ACTION_IDENTIFY_TEXT } from './constants'
import { CommentContent } from './types'

function MainText(content: CommentContent) {
  return `
Hey ${content.logins.join(', ')}!

It seems the discussion is dragging on. Perhaps instead of text communication, you could try having a conversation via face-to-face or video call, or even try mob programming?
`
}
function debugText(content: CommentContent) {
  return `
<details>
<summary>number of comments</summary>
the number of the comments is ${content.numberOfComments}
threshold: ${content.threshold}
</details>
`
}

export async function postComment(content: CommentContent) {
  const rawMessage = `${ACTION_IDENTIFY_TEXT}

${MainText(content)}

${debugText(content)}
`
}
