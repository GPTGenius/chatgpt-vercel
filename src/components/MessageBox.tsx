import { FC, useEffect } from 'react';
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
      className={`msg-fade-in flex mb-[8px] ${
        message.role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div
        dangerouslySetInnerHTML={{ __html: md.render(message.content) }}
        className={`shadow-sm p-4 ${
          message.role === 'user'
            ? 'bg-gradient text-white rounded-br-none'
            : 'rounded-bl-none bg-[#f1f2f6]'
        } break-words overflow-hidden rounded-[20px]`}
      ></div>
    </div>
  );
};

const MessageBox: FC<{ messages: Message[] }> = ({ messages }) => {
  useEffect(() => {
    const element = document.querySelector('#content');
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  return (
    <div id="content" className="mb-[40px]">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </div>
  );
};

export default MessageBox;
