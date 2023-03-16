import { FC } from 'react'
import { Message } from '@interfaces'
import MarkdownIt from 'markdown-it'
import mdKatex from 'markdown-it-katex'
import mdHighlight from 'markdown-it-highlightjs'
import mdKbd from 'markdown-it-kbd'
import { mockMarkdownData } from '@mock/markdown'

const defaultMessage: Message[] = [{
  content: '\nhello!hello!hello!hello!hello!hhello!hello!hello!hello!hello!helloelhello!hello!hello!hello!hello!hellolohello!hello!hello!hello!hello!hello!\n\nhello!\n\nhello!hello!hello!hello!hello!hello!hello!\n\nhello!\n\nhello!',
  role: 'assistant'
}, {
  content: 'hel\nlo!\n\n',
  role: 'user'
}, {
  content: mockMarkdownData,
  role: 'assistant'
}]
const MessageBox: FC<{ messages?: Message[] }> = ({ messages = defaultMessage }) => {
  return (
    <div>
      {messages.map(message => <MessageItem message={message}/>)}
    </div>
  )
}

const MessageItem: FC<{ message: Message }> = ({ message }) => {
  const md = MarkdownIt({
    linkify: true,
    breaks: true
  })
    .use(mdKatex)
    .use(mdHighlight, {
      inline: true
    })
    .use(mdKbd)

  return (
    <div className={`flex mb-[8px] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div dangerouslySetInnerHTML={{ __html: md.render(message.content) }} className={`shadow-sm p-4 ${message.role === 'user' ? 'bg-[#0086ff] text-white rounded-br-none' : 'rounded-bl-none bg-[#f1f2f6]'} break-words overflow-hidden rounded-[20px]`}>
      </div>
    </div>
  )
}

export default MessageBox