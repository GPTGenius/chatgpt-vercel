import { FC, useState } from 'react';

const MessageInput: FC<{
  onSubmit: (message: string) => Promise<void>;
  loading: boolean;
}> = ({ onSubmit, loading }) => {
  const [input, setInput] = useState('');
  const disabled = input.trim() === '' || loading;

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(input);
    setInput('');
  };

  return (
    <div className="flex">
      <input
        placeholder="Start a conversation"
        className="shadow-inner flex-1 border-none rounded-md text-[#273346] bg-[#f8f8fa] p-[12px]"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <button
        disabled={disabled}
        className="disabled:cursor-not-allowed disabled:bg-[#50a5f0] shadow-sm text-white bg-[#0086ff] ml-[0.5rem] p-[12px] px-[20px] border-none rounded-md"
        onClick={() => handleSubmit()}
      >
        <i className="ri-send-plane-fill"></i>
      </button>
    </div>
  );
};

export default MessageInput;
