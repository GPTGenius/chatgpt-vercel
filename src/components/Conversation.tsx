import { FC, useEffect, useState } from 'react';
import GlobalContext from '@contexts/global';
import {
  defaultModel,
  globalConfigLocalKey,
  localConversationKey,
} from '@configs';
import type { GlobalConfig, Lang, Message } from '@interfaces';
import type { I18n } from '@utils';
import { Tooltip } from 'antd';
import MessageBox from './MessageBox';
import MessageInput from './MessageInput';
import GlobalConfigs from './GlobalConfigs';
import ClearMessages from './ClearMessages';

const Conversation: FC<{ i18n: I18n; lang: Lang }> = ({ i18n, lang }) => {
  // input text
  const [text, setText] = useState('');
  // chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  // gloabl configs
  const [configs, setConfigs] = useState<GlobalConfig>({
    openAIApiKey: '',
    model: defaultModel,
    save: false,
  });
  // prompt
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // read from localstorage in the first time
    const localConfigsStr = localStorage.getItem(globalConfigLocalKey);
    if (localConfigsStr) {
      try {
        const localConfigs = JSON.parse(localConfigsStr);
        setConfigs(localConfigs);
        if (localConfigs.save) {
          const localConversation = localStorage.getItem(localConversationKey);
          if (localConversation) {
            setMessages(JSON.parse(localConversation));
          }
        }
      } catch (e) {
        //
      }
    }
  }, []);

  // save current conversation
  useEffect(() => {
    if (configs.save) {
      localStorage.setItem(localConversationKey, JSON.stringify(messages));
    } else {
      localStorage.removeItem(localConversationKey);
    }
  }, [messages, configs.save]);

  const sendChatMessages = async (content: string) => {
    const input: Message[] = messages.concat([
      {
        role: 'user',
        content,
      },
    ]);
    setMessages(input);
    setText('');
    setLoading(true);
    try {
      const res = await fetch('/api/completions', {
        method: 'POST',
        body: JSON.stringify({
          key: configs.openAIApiKey,
          model: configs.model,
          messages: input,
        }),
      });
      const data = await res.json();
      if (res.status < 400) {
        const replay = data.choices[0].message;
        setMessages(input.concat(replay));
      } else {
        setMessages(
          input.concat([
            { role: 'assistant', content: `Error: ${data.msg || 'Unknown'}` },
          ])
        );
      }
    } catch (e) {
      setMessages(input.concat([{ role: 'assistant', content: 'Error' }]));
    }
    setLoading(false);
  };

  return (
    <GlobalContext.Provider value={{ i18n, lang }}>
      <header className="flex items-center justify-between">
        <div className="title">
          <span className="text-gradient">ChatGPT</span>
        </div>
        <GlobalConfigs configs={configs} setConfigs={setConfigs} />
      </header>
      {messages.length === 0 ? (
        <div className="text-gray-400 mb-[20px]">{i18n.default_tips}</div>
      ) : null}
      <MessageBox messages={messages} loading={loading} />
      <footer>
        <MessageInput
          text={text}
          setText={setText}
          showPrompt={showPrompt}
          setShowPrompt={setShowPrompt}
          onSubmit={sendChatMessages}
          loading={loading}
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
              <i className="ri-user-voice-line" />
            </div>
          </Tooltip>
          <ClearMessages onClear={() => setMessages([])} />
        </div>
      </footer>
    </GlobalContext.Provider>
  );
};

export default Conversation;
