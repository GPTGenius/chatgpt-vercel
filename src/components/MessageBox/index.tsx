import { FC, useCallback, useContext, useEffect } from 'react';
import { throttle } from 'lodash-es';
import GlobalContext from '@contexts/global';
import { ConversationMode, Message } from '@interfaces';
import markdown from '@utils/markdown';
import { getRelativeTime } from '@utils/date';
import SystemAvatar from '@components/Avatar/system';
import useCopyCode from '@hooks/useCopyCode';
import './index.css';

const MessageItem: FC<{ message: Message; index?: number }> = ({
  message,
  index,
}) => {
  const { i18n } = useContext(GlobalContext);
  const isExpired = message.expiredAt && message.expiredAt <= Date.now();
  const createdAt = getRelativeTime(message.createdAt, true);
  return (
    <div
      className={`msg-fade-in flex items-start relative ${
        index === 0 ? '' : 'mt-[24px]'
      } ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      {message.role === 'assistant' ? (
        <SystemAvatar className="mt-[14px] mr-2" />
      ) : null}
      <div
        dangerouslySetInnerHTML={{
          __html: isExpired
            ? i18n.status_image_expired
            : markdown.render(message.content),
        }}
        className={`prose message-box shadow-sm p-4 ${
          message.role === 'user' ? 'bg-gradient text-white' : 'bg-[#ebeced]'
        } break-words overflow-hidden rounded-[16px]`}
      />
      {createdAt ? (
        <div
          className={`message-box-time hover:visible invisible text-[#a1a7a8] text-sm absolute top-[-20px] ${
            message.role === 'user' ? 'right-0' : 'left-[calc(32px+0.5rem)]'
          }`}
        >
          {createdAt}
        </div>
      ) : null}
    </div>
  );
};

const MessageBox: FC<{
  streamMessage: string;
  messages: Message[];
  mode: ConversationMode;
  loading: boolean;
}> = ({ streamMessage, messages, mode, loading }) => {
  const { i18n } = useContext(GlobalContext);

  useCopyCode(i18n.success_copy);

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
    <div id="content">
      {messages.length === 0 ? (
        <div
          className="prose text-gray-500 mb-[20px]"
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
        <MessageItem key={index} index={index} message={message} />
      ))}
      {streamMessage ? (
        <MessageItem message={{ role: 'assistant', content: streamMessage }} />
      ) : null}
      {loading ? (
        <div className="loading text-center text-gray-400 mt-5 mb-5">
          {i18n.status_loading}
        </div>
      ) : null}
    </div>
  );
};

export default MessageBox;
