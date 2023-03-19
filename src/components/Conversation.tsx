import { FC, useState } from 'react';
import { GlobalConfig, Message } from '@interfaces';
import MessageBox from './MessageBox';
import MessageInput from './MessageInput';
import GlobalConfigs from './GlobalConfigs';
import ClearMessages from './ClearMessages';

const Conversation: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<GlobalConfig>({
    openAIApiKey: '',
    model: '',
  });

  const sendChatMessages = async (content: string) => {
    const input: Message[] = messages.concat([
      {
        role: 'user',
        content,
      },
    ]);
    setMessages(input);
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
      const replay = data.choices[0].message;
      setMessages(input.concat(replay));
    } catch {
      setMessages(input.concat([{ role: 'assistant', content: 'Error' }]));
    }
    setLoading(false);
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <div className="title">
          <span className="text-gradient">ChatGPT</span>
        </div>
        <GlobalConfigs configs={configs} setConfigs={setConfigs} />
      </header>
      <MessageBox messages={messages} />
      {messages.length === 0 ? (
        <div className="text-gray-400 mb-[20px]">
          Chat with us now, powered by OpenAI and Vercel
        </div>
      ) : null}
      {loading && (
        <div className="loading text-center text-gray-400">Thinking...</div>
      )}
      <footer>
        <MessageInput onSubmit={sendChatMessages} loading={loading} />
        <ClearMessages onClear={() => setMessages([])} />
      </footer>
    </div>
  );
};

export default Conversation;
