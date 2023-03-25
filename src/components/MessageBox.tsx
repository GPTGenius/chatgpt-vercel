import { FC, useContext, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';
import mdHighlight from 'markdown-it-highlightjs';
import mdKbd from 'markdown-it-kbd';
import GlobalContext from '@contexts/global';
import { Message } from '@interfaces';

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
        dangerouslySetInnerHTML={{
          __html: md.render(message.content),
        }}
        className={`shadow-sm p-4 ${
          message.role === 'user'
            ? 'bg-gradient text-white rounded-br-none'
            : 'rounded-bl-none bg-[#f1f2f6]'
        } break-words overflow-hidden rounded-[20px]`}
      ></div>
    </div>
  );
};

const MessageBox: FC<{ messages: Message[]; loading: boolean }> = ({
  messages,
  loading,
}) => {
  const { i18n } = useContext(GlobalContext);

  useEffect(() => {
    const element = document.querySelector('#content');
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  return (
    <div
      id="content"
      className="pt-[2rem]"
      style={{
        paddingBottom: 'calc(74px + 4rem)',
      }}
    >
      {messages.length === 0 ? (
        <div className="text-gray-400 mb-[20px]">{i18n.default_tips}</div>
      ) : null}
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      {loading && (
        <div className="loading text-center text-gray-400">
          {i18n.status_loading}
        </div>
      )}
    </div>
  );
};

export default MessageBox;
