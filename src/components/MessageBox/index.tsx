import { FC, useCallback, useContext, useEffect } from 'react';
import { throttle } from 'lodash-es';
import type { MessageType } from 'midjourney-fetch';
import { Tag, message as GlobalMessage } from 'antd';
import GlobalContext from '@contexts/global';
import { ConversationMode, Message } from '@interfaces';
import markdown from '@utils/markdown';
import { getRelativeTime } from '@utils/date';
import SystemAvatar from '@components/Avatar/system';
import useCopyCode from '@hooks/useCopyCode';
import MidjourneyOperations from '@components/MidjourneyOperations';
import { hasUpscaleOrVariation } from '@utils/midjourney';
import './index.css';
import { copyToClipboard } from '@utils';

const { CheckableTag } = Tag;

const MessageItem: FC<{
  message: Message;
  onOperationClick?: (
    type: MessageType,
    customId: string,
    messageId: string,
    prompt: string
  ) => void;
  mode?: ConversationMode;
  index?: number;
}> = ({ message, onOperationClick, mode, index }) => {
  const { i18n, isMobile } = useContext(GlobalContext);
  const isExpired = message.expiredAt && message.expiredAt <= Date.now();
  const createdAt = getRelativeTime(message.createdAt, true);

  const onCopy = () => {
    copyToClipboard(message.content);
    GlobalMessage.success(i18n.success_copy);
  };

  return (
    <div
      className={`msg-fade-in flex items-start ${
        index === 0 ? '' : 'mt-[24px]'
      } ${message.role === 'user' ? 'flex-row-reverse ml-16' : 'mr-6'}`}
    >
      {message.role === 'assistant' ? (
        <SystemAvatar className="mt-[38px] mr-2" role={message.imageModel} />
      ) : null}
      <div className="overflow-hidden flex flex-col-reverse">
        {message.midjourneyMessage &&
        hasUpscaleOrVariation(message.midjourneyMessage) ? (
          <MidjourneyOperations
            message={message.midjourneyMessage}
            onClick={(type, customId) =>
              onOperationClick(
                type,
                customId,
                message.midjourneyMessage.id,
                message.midjourneyMessage.prompt
              )
            }
          />
        ) : null}
        <div
          dangerouslySetInnerHTML={{
            __html: isExpired
              ? i18n.status_image_expired
              : markdown.render(message.content),
          }}
          className={`prose message-box shadow-sm p-4 ${
            message.role === 'user' ? 'bg-gradient text-white' : 'bg-[#ebeced]'
          } ${
            mode === 'image' ? 'img-no-margin' : ''
          } break-words rounded-[16px]`}
        />
        <div
          className={`message-box-hover hover:visible flex justify-between items-center ${
            isMobile ? '' : 'invisible'
          }`}
        >
          {createdAt ? (
            <div className="text-[#a1a7a8] text-sm">{createdAt}</div>
          ) : (
            <div />
          )}
          <div className="flex items-center ml-1">
            {isMobile ? (
              <div className="text-[#a1a7a8] text-xs" onClick={onCopy}>
                {i18n.action_copy}
              </div>
            ) : (
              <CheckableTag
                checked={false}
                className="mb-[2px] mr-0 text-[#a1a7a8]"
                onClick={onCopy}
              >
                {i18n.action_copy}
              </CheckableTag>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageBox: FC<{
  streamMessage: string;
  messages: Message[];
  mode: ConversationMode;
  loading: boolean;
  onOperationClick?: (
    type: MessageType,
    customId: string,
    messageId: string,
    prompt: string
  ) => void;
}> = ({ streamMessage, messages, mode, loading, onOperationClick }) => {
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
        <MessageItem
          key={index}
          index={index}
          mode={mode}
          message={message}
          onOperationClick={loading ? () => null : onOperationClick}
        />
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
