import { FC } from 'react';
import { Message } from '@interfaces';
import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';
import mdHighlight from 'markdown-it-highlightjs';
import mdKbd from 'markdown-it-kbd';

const MessageItem: FC<{ message: Message }> = ({ message }) => {
  const md = MarkdownIt({
    linkify: true,
    breaks: true,
  })
    .use(mdKatex)
    .use(mdHighlight, {
      inline: true,
    })
    .use(mdKbd);

  return (
    <div
      className={`flex mb-[8px] ${
        message.role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div
        dangerouslySetInnerHTML={{ __html: md.render(message.content) }}
        className={`shadow-sm p-4 ${
          message.role === 'user'
            ? 'bg-[#0086ff] text-white rounded-br-none'
            : 'rounded-bl-none bg-[#f1f2f6]'
        } break-words overflow-hidden rounded-[20px]`}
      ></div>
    </div>
  );
};

const MessageBox: FC<{ messages: Message[] }> = ({ messages }) => (
  <div>
    {messages.map((message, index) => (
      <MessageItem key={index} message={message} />
    ))}
  </div>
);

export default MessageBox;
