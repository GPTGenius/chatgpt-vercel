import { FC, useContext, useEffect, useState } from 'react';
import MessageBox from '@components/MessageBox';
import { Message, ReactSetState } from '@interfaces';
import GlobalContext from '@contexts/global';
import { hasMathJax, initMathJax, renderMaxJax } from '@utils/markdown';
import { hasMath } from '@utils';
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
        messages: msgs,
        ...(msgs.length > 0
          ? {
              title: msgs[0].content,
            }
          : {}),
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
        const { msg } = await res.json();
        updateMessages(
          allMessages.concat([
            {
              role: 'assistant',
              content: `[${res.status}]Error: ${
                msg || res.statusText || 'Unknown'
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

  const sendImageChatMessages = async (content: string) => {
    const current = currentId;
    const allMessages: Message[] = messages.concat([
      {
        role: 'user',
        content,
        createdAt: Date.now(),
      },
    ]);
    updateMessages(allMessages);
    setText('');
    setLoadingMap((map) => ({
      ...map,
      [current]: true,
    }));
    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        body: JSON.stringify({
          key: configs.openAIApiKey,
          prompt: content,
          size: configs.imageSize || '256x256',
          n: configs.imagesCount || 1,
        }),
      });
      const { data = [], msg } = await res.json();

      if (res.status < 400) {
        const params = new URLSearchParams(data?.[0]);
        const expiredAt = params.get('se');
        updateMessages(
          allMessages.concat([
            {
              role: 'assistant',
              content: data.map((url) => `![](${url})`).join('\n'),
              createdAt: Date.now(),
              expiredAt: new Date(expiredAt).getTime(),
            },
          ])
        );
      } else {
        updateMessages(
          allMessages.concat([
            {
              role: 'assistant',
              content: `[${res.status}]Error: ${msg || 'Unknown'}`,
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
