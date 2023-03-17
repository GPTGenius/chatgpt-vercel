import { FC, useState } from 'react';
import { Message } from '@interfaces';
import MessageBox from './MessageBox';
import MessageInput from './MessageInput';

const Conversation: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendChatMessages = async (content: string) => {
    const input: Message[] = messages.concat([
      {
        role: 'user',
        content,
      },
    ]);
    setMessages(input);
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
  };

  return (
    <>
      <MessageBox messages={messages} />
      {messages.length === 0 ? (
        <div>Start a conversation via "Submit" button</div>
      ) : null}
      <footer>
        <MessageInput onSubmit={sendChatMessages} />
      </footer>
    </>
  );
};

export default Conversation;
