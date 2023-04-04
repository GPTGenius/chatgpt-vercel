import { FC, useCallback, useContext, useEffect } from 'react';
import throttle from 'lodash.throttle';
import GlobalContext from '@contexts/global';
import { ConversationMode, Message } from '@interfaces';
import markdown from '@utils/markdown';

const MessageItem: FC<{ message: Message }> = ({ message }) => {
  const { i18n } = useContext(GlobalContext);
  const isExpired = message.expiredAt && message.expiredAt <= Date.now();

  return (
    <div
      className={`msg-fade-in flex mb-[8px] ${
        message.role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: isExpired
            ? i18n.status_image_expired
            : markdown.render(message.content),
        }}
        className={`shadow-sm p-4 ${
          message.role === 'user'
            ? 'bg-gradient text-white rounded-br-none'
            : 'rounded-bl-none bg-[#f1f2f6]'
        } break-words overflow-hidden rounded-[20px]`}
      />
    </div>
  );
};

const MessageBox: FC<{
  streamMessage: string;
  messages: Message[];
  mode: ConversationMode;
}> = ({ streamMessage, messages, mode }) => {
  const { i18n } = useContext(GlobalContext);

  const handleAutoScroll = useCallback(
    throttle(() => {
      const element = document.querySelector('#content');
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 300),
    []
  );

  useEffect(() => {
    handleAutoScroll();
  }, [streamMessage]);

  useEffect(() => {
    const clock = setTimeout(() => {
      handleAutoScroll();
    }, 300);

    return () => {
      clearTimeout(clock);
    };
  }, [messages]);

  return (
    <div
      id="content"
      className="pt-[2rem]"
      style={{
        paddingBottom: 'var(--footer-height)',
      }}
    >
      {messages.length === 0 ? (
        <div
          className="text-gray-500 mb-[20px]"
          dangerouslySetInnerHTML={{
            __html: markdown.render(
              mode === 'image'
                ? i18n.default_image_tips
                : i18n.default_text_tips
            ),
          }}
        />
      ) : null}
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      {streamMessage ? (
        <MessageItem message={{ role: 'assistant', content: streamMessage }} />
      ) : null}
    </div>
  );
};

export default MessageBox;
