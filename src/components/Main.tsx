import { FC, useEffect, useState } from 'react';
import GlobalContext from '@contexts/global';
import {
  defaultGloablConfig,
  globalConfigLocalKey,
  localConversationKey,
} from '@configs';
import type { Conversation, GlobalConfig, Lang, Message } from '@interfaces';
import { getI18n } from '@utils/i18n';
import { Tooltip } from 'antd';
import MessageBox from './MessageBox';
import MessageInput from './MessageInput';
import GlobalConfigs from './GlobalConfigs';
import ClearMessages from './ClearMessages';
import ConversationTabs from './ConversationTabs';
import LanguageSwitch from './LanguageSwitch';

const defaultConversation: Omit<Conversation, 'title'> = {
  id: '1',
  messages: [],
  mode: 'text',
  createdAt: Date.now(),
};

const Main: FC<{ lang: Lang }> = ({ lang }) => {
  // input text
  const [text, setText] = useState('');

  // gloabl configs
  const [configs, setConfigs] = useState<Partial<GlobalConfig>>({});

  const i18n = getI18n(configs.lang ?? 'en');

  // chat informations
  const [currentTab, setCurrentTab] = useState<string>('1');
  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >({
    [defaultConversation.id]: {
      ...defaultConversation,
      title: i18n.status_empty,
    },
  });
  const [streamMessage, setStreamMessage] = useState('');

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  // prompt
  const [showPrompt, setShowPrompt] = useState(false);

  // media query
  const [isMobile, setIsMobile] = useState(false);

  const tabs = Object.values(conversations)
    .reverse()
    .map((conversation) => ({
      label: (
        <span>
          {conversation.mode === 'image' ? (
            <i className="ri-image-line align-bottom" />
          ) : (
            <i className="ri-chat-4-line align-bottom" />
          )}
          <span className="ml-1">{conversation.title}</span>
        </span>
      ),
      key: conversation.id,
    }));
  const currentMessages = conversations[currentTab]?.messages ?? [];
  const currentMode = conversations[currentTab]?.mode ?? 'text';

  // media query
  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    if (media.matches) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    const defaultConfigs = {
      ...defaultGloablConfig,
      lang,
    };
    // read from localstorage in the first time
    const localConfigsStr = localStorage.getItem(globalConfigLocalKey);
    if (localConfigsStr) {
      try {
        const localConfigs = JSON.parse(localConfigsStr);
        setConfigs((currentConfigs) => ({
          ...defaultConfigs,
          ...currentConfigs,
          ...localConfigs,
        }));
        if (localConfigs.save) {
          const localConversation = localStorage.getItem(localConversationKey);
          if (localConversation) {
            const conversation = JSON.parse(localConversation);
            // historical localstorage
            if (Array.isArray(conversation) && conversation.length > 0) {
              setConversations({
                [defaultConversation.id]: {
                  title: conversation[0].content,
                  messages: conversation,
                  id: defaultConversation.id,
                  createdAt: Date.now(),
                },
              });
            } else {
              setConversations(conversation);
              setCurrentTab(
                Object.keys(conversation)?.reverse()?.[0] ??
                  defaultConversation.id
              );
            }
          }
        }
      } catch (e) {
        setConfigs(defaultConfigs);
      }
    } else {
      setConfigs(defaultConfigs);
    }
  }, []);

  // save current conversation
  useEffect(() => {
    if (configs.save) {
      localStorage.setItem(localConversationKey, JSON.stringify(conversations));
    } else {
      localStorage.removeItem(localConversationKey);
    }
  }, [conversations, configs.save]);

  const updateMessages = (messages: Message[]) => {
    setConversations((msg) => ({
      ...msg,
      [currentTab]: {
        ...conversations[currentTab],
        messages,
        ...(messages.length > 0
          ? {
              title: messages[0].content,
            }
          : {}),
      },
    }));
  };

  const sendTextChatMessages = async (content: string) => {
    const current = currentTab;
    const input: Message[] = [
      {
        role: 'user',
        content,
        createdAt: Date.now(),
      },
    ];
    const allMessages: Message[] = currentMessages.concat(input);
    updateMessages(allMessages);
    setText('');
    setLoadingMap((map) => ({
      ...map,
      [current]: true,
    }));
    try {
      const res = await fetch('/api/completions', {
        method: 'POST',
        body: JSON.stringify({
          key: configs.openAIApiKey,
          model: configs.model,
          messages: configs.continuous ? allMessages : input,
          temperature: configs.temperature ?? 1,
        }),
      });
      if (res.status < 400 && res.ok) {
        const stream = res.body;
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let tempMessage = '';
        while (true) {
          const { value, done } = await reader.read();
          if (value) {
            const char = decoder.decode(value);
            if (char === '\n' && tempMessage.endsWith('\n')) {
              continue;
            }
            if (char) {
              tempMessage += char;
              setStreamMessage(tempMessage);
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
        setStreamMessage('');
      } else {
        updateMessages(
          allMessages.concat([
            {
              role: 'assistant',
              content: `Error: ${res.statusText || 'Unknown'}`,
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

  const sendImageChatMessages = async (content: string) => {
    const current = currentTab;
    const allMessages: Message[] = currentMessages.concat([
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
              content: `Error: ${msg || 'Unknown'}`,
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
    <GlobalContext.Provider value={{ i18n, configs, isMobile }}>
      <header>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="title text-gradient">ChatGPT</span>
            <a
              href="https://github.com/GPTGenius/chatgpt-vercel"
              target="_blank"
              rel="noreferrer"
            >
              <i className="ml-2 ri-github-fill text-xl" />
            </a>
          </div>
          <div className="flex items-center">
            <LanguageSwitch />
            <GlobalConfigs setConfigs={setConfigs} />
          </div>
        </div>
        <ConversationTabs
          tabs={tabs}
          setConversations={setConversations}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </header>
      <MessageBox
        streamMessage={streamMessage}
        messages={currentMessages}
        loading={loadingMap[currentTab]}
        mode={currentMode}
      />
      <footer>
        <MessageInput
          text={text}
          setText={setText}
          showPrompt={showPrompt && currentMode !== 'image'}
          setShowPrompt={setShowPrompt}
          onSubmit={async (message: string) => {
            if (currentMode === 'image') {
              sendImageChatMessages(message);
            } else {
              sendTextChatMessages(message);
            }
          }}
          loading={loadingMap[currentTab]}
        />
        <div className="flex items-center justify-between pr-8">
          <Tooltip title={i18n.action_prompt}>
            <div
              className="flex items-center cursor-pointer p-1 text-gray-500"
              onClick={() => {
                setText('/');
                setShowPrompt(true);
              }}
            >
              <i className="ri-user-add-line" />
            </div>
          </Tooltip>
          <ClearMessages
            onClear={() =>
              setConversations({
                [defaultConversation.id]: {
                  ...defaultConversation,
                  title: i18n.status_empty,
                },
              })
            }
          />
        </div>
      </footer>
    </GlobalContext.Provider>
  );
};

export default Main;
