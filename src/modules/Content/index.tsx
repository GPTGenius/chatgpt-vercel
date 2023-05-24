/* eslint-disable no-console */
import { FC, useContext, useEffect, useState } from 'react';
import MessageBox from '@components/MessageBox';
import { Message, ReactSetState } from '@interfaces';
import GlobalContext from '@contexts/global';
import { hasMathJax, initMathJax, renderMaxJax } from '@utils/markdown';
import { hasMath } from '@utils';
import { midjourneyConfigs } from '@configs';
import {
  type MessageItem,
  type MessageType,
  isInProgress,
  getHashFromCustomId,
} from 'midjourney-fetch';
import { updateComponentStatus } from '@utils/midjourney';
import MessageInput from './MessageInput';
import ContentHeader from './ContentHeader';

interface ContentProps {
  setActiveSetting: ReactSetState<boolean>;
}

const Content: FC<ContentProps> = ({ setActiveSetting }) => {
  // input text
  const [text, setText] = useState('');
  const [streamMessageMap, setStreamMessageMap] = useState<
    Record<string, string>
  >({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  // prompt
  const [showPrompt, setShowPrompt] = useState(false);

  // controller
  const [controller, setController] = useState<AbortController>(null);

  const { configs, currentId, conversations, setConversations } =
    useContext(GlobalContext);

  const conversation = conversations[currentId];
  const messages = conversation?.messages ?? [];
  const mode = conversation?.mode ?? 'text';
  const streamMessage = streamMessageMap[currentId] ?? '';
  const loading = loadingMap[currentId];

  useEffect(() => {
    // lazyload, init mathJax when hasMath
    if (messages.some((message) => hasMath(message.content))) {
      initMathJax().then(() => renderMaxJax());
    }
  }, [messages]);

  // pre initialization
  useEffect(() => {
    if (hasMathJax()) return;
    if (hasMath(streamMessage)) {
      initMathJax();
    }
  }, [streamMessage]);

  const updateMessages = (msgs: Message[]) => {
    setConversations((msg) => ({
      ...msg,
      [currentId]: {
        ...conversations[currentId],
        updatedAt: msgs.slice(-1)?.[0]?.createdAt,
        messages: msgs,
        // If no title, set the first content
        title: conversations[currentId].title || msgs[0].content,
      },
    }));
  };

  const sendTextChatMessages = async (content: string) => {
    const current = currentId;
    // temp stream message
    let tempMessage = '';
    const input: Message[] = [
      {
        role: 'user',
        content,
        createdAt: Date.now(),
      },
    ];
    const allMessages: Message[] = messages.concat(input);
    updateMessages(allMessages);
    setText('');
    setLoadingMap((map) => ({
      ...map,
      [current]: true,
    }));
    try {
      const abortController = new AbortController();
      setController(abortController);
      const res = await fetch('/api/completions', {
        method: 'POST',
        body: JSON.stringify({
          key: configs.openAIApiKey,
          model: configs.model,
          messages: configs.continuous
            ? allMessages.slice(-1 * (configs.messagesCount ?? 4) - 1)
            : input,
          temperature: configs.temperature ?? 1,
          password: configs.password,
        }),
        signal: abortController.signal,
      });
      if (res.status < 400 && res.ok) {
        const stream = res.body;
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();
          if (value) {
            const char = decoder.decode(value);
            if (char === '\n' && tempMessage.endsWith('\n')) {
              continue;
            }
            if (char) {
              tempMessage += char;
              // eslint-disable-next-line no-loop-func
              setStreamMessageMap((map) => ({
                ...map,
                [current]: tempMessage,
              }));
            }
          }
          if (done) {
            break;
          }
        }
        updateMessages(
          allMessages.concat([
            {
              role: 'assistant',
              content: tempMessage,
              createdAt: Date.now(),
            },
          ])
        );
        setStreamMessageMap((map) => ({
          ...map,
          [current]: '',
        }));
        tempMessage = '';
      } else {
        const { msg, error } = await res.json();
        updateMessages(
          allMessages.concat([
            {
              role: 'assistant',
              content: `[${res.status}]Error: ${
                msg || error?.message || res.statusText || 'Unknown'
              }`,
              createdAt: Date.now(),
            },
          ])
        );
      }
    } catch (e) {
      // abort manually or not
      if (!tempMessage) {
        updateMessages(
          allMessages.concat([
            {
              role: 'assistant',
              content: `Error: ${e.message || e.stack || e}`,
              createdAt: Date.now(),
            },
          ])
        );
      }
    } finally {
      setController(null);
      setLoadingMap((map) => ({
        ...map,
        [current]: false,
      }));
    }
  };

  const stopGenerate = () => {
    controller?.abort?.();
    if (streamMessage) {
      updateMessages(
        messages.concat([
          {
            role: 'assistant',
            content: streamMessage,
            createdAt: Date.now(),
          },
        ])
      );
      setStreamMessageMap((map) => ({
        ...map,
        [currentId]: '',
      }));
    }
  };

  const sendImageChatMessages = async (
    content: string,
    type: MessageType = 'imagine',
    extraParams: Partial<{
      customId: string;
      messageId: string;
      index: number;
    }> = {}
  ) => {
    const { messageId, index } = extraParams;
    const current = currentId;
    let messageInput = content;
    let allMessages: Message[] = messages;
    if (
      (type === 'upscale' || type === 'variation') &&
      typeof index === 'number' &&
      messageId
    ) {
      // add flag to mark, only in frontend
      if (index > 0) {
        messageInput = `/${
          type === 'variation' ? 'V' : 'U'
        }${index} ${messageInput}`;
      } else {
        messageInput = `/🔄 ${messageInput}`;
      }

      // update status
      allMessages = updateComponentStatus({
        type,
        messages: allMessages,
        messageId,
        index,
      });
    }
    // concat user input
    allMessages = allMessages.concat([
      {
        role: 'user',
        content: messageInput,
        createdAt: Date.now(),
      },
    ]);

    updateMessages(allMessages);
    setText('');
    setLoadingMap((map) => ({
      ...map,
      [current]: true,
    }));
    const model = configs.imageModel;
    let params: Record<string, string | number> = {
      password: configs.password,
      model,
      prompt: content,
    };
    if (model === 'Midjourney') {
      params = {
        ...params,
        serverId: configs.discordServerId,
        channelId: configs.discordChannelId,
        type,
      };
      if (type === 'upscale' || type === 'variation') {
        params = {
          ...params,
          ...extraParams,
        };
      }
    } else if (model === 'Replicate') {
      params = {
        ...params,
        size: configs.imageSize || '256x256',
      };
    } else {
      params = {
        ...params,
        key: configs.openAIApiKey,
        size: configs.imageSize || '256x256',
        n: configs.imagesCount || 1,
      };
    }
    try {
      const timestamp = new Date().toISOString();
      const res = await fetch('/api/images', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          Authorization: model === 'Midjourney' ? configs.discordToken : '',
        },
      });
      const { data = [], msg } = await res.json();

      if (res.status < 400) {
        if (model === 'Midjourney') {
          const times = midjourneyConfigs.timeout / midjourneyConfigs.interval;
          let count = 0;
          let result: MessageItem | undefined;
          while (count < times) {
            try {
              count += 1;
              await new Promise((resp) =>
                setTimeout(resp, midjourneyConfigs.interval)
              );
              const message: MessageItem & { msg?: string } = await (
                await fetch(
                  `/api/images?model=Midjourney&prompt=${content}&serverId=${
                    configs.discordServerId
                  }&channelId=${configs.discordChannelId}&type=${type}&index=${
                    index ?? ''
                  }&timestamp=${timestamp}`,
                  {
                    headers: {
                      Authorization: configs.discordToken,
                    },
                  }
                )
              ).json();
              console.log(count, JSON.stringify(message));
              // msg means error message
              if (message && !message.msg && !isInProgress(message)) {
                result = message;
                break;
              }
            } catch (e) {
              console.log(count, e.message || e.stack || e);
              continue;
            }
          }
          if (result) {
            updateMessages(
              allMessages.concat([
                {
                  role: 'assistant',
                  content: `![](${result.attachments[0].url})`,
                  imageModel: model,
                  midjourneyMessage: {
                    id: result.id,
                    attachments: result.attachments,
                    components: result.components,
                    prompt: content,
                  },
                  createdAt: Date.now(),
                },
              ])
            );
          } else {
            updateMessages(
              allMessages.concat([
                {
                  role: 'assistant',
                  content: 'No result or timeout',
                  imageModel: model,
                  createdAt: Date.now(),
                },
              ])
            );
          }
        } else {
          const searchParams = new URLSearchParams(data?.[0]);
          const expiredAt = searchParams.get('se');
          updateMessages(
            allMessages.concat([
              {
                role: 'assistant',
                content: data.map((url) => `![](${url})`).join('\n'),
                imageModel: model,
                createdAt: Date.now(),
                expiredAt: expiredAt
                  ? new Date(expiredAt).getTime()
                  : undefined,
              },
            ])
          );
        }
      } else {
        updateMessages(
          allMessages.concat([
            {
              role: 'assistant',
              content: `[${res.status}]Error: ${msg || 'Unknown'}`,
              imageModel: model,
              createdAt: Date.now(),
            },
          ])
        );
      }
    } catch (e) {
      updateMessages(
        allMessages.concat([
          {
            role: 'assistant',
            content: `Error: ${e.message || e.stack || e}`,
            imageModel: model,
            createdAt: Date.now(),
          },
        ])
      );
    }
    setLoadingMap((map) => ({
      ...map,
      [current]: false,
    }));
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ContentHeader
        conversation={conversation}
        setActiveSetting={setActiveSetting}
        setShowPrompt={setShowPrompt}
        setText={setText}
      />
      <div className="flex-1 overflow-auto common-scrollbar p-5 pb-0">
        <MessageBox
          streamMessage={streamMessage}
          messages={messages}
          mode={mode}
          loading={loading}
          onOperationClick={(type, customId, messageId, prompt) => {
            const { index } = getHashFromCustomId(type, customId);
            if (typeof index === 'number') {
              sendImageChatMessages(prompt, type, {
                customId,
                index,
                messageId,
              });
            }
          }}
        />
      </div>
      <MessageInput
        text={text}
        setText={setText}
        streamMessage={streamMessage}
        showPrompt={showPrompt && mode !== 'image'}
        setShowPrompt={setShowPrompt}
        onSubmit={async (message: string) => {
          if (mode === 'image') {
            sendImageChatMessages(message);
          } else {
            sendTextChatMessages(message);
          }
        }}
        onCancel={stopGenerate}
        loading={loading}
      />
    </div>
  );
};

export default Content;
