import { FC, useState, useEffect } from 'react';
import { Message } from '@interfaces';
import MessageBox from './MessageBox';
import MessageInput from './MessageInput';

const Conversation: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const element = document.querySelector('#content');
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  return (
    <div id="content">
      <MessageBox messages={messages} />
      {messages.length === 0 ? (
        <div className="text-gray-400 mb-[20px]">
          Start a conversation via "Send" button
        </div>
      ) : null}
      {loading && (
        <div className="loading text-center text-gray-400">Thinking...</div>
      )}
      <footer>
        <MessageInput onSubmit={sendChatMessages} loading={loading} />
      </footer>
    </div>
  );
};

export default Conversation;
