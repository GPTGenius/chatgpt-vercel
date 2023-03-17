import { FC, useState, useCallback } from 'react';

const MessageInput: FC<{
  onSubmit: (message: string) => Promise<void>;
  loading: boolean;
}> = ({ onSubmit, loading }) => {
  const [input, setInput] = useState('');
  const disabled = input.trim() === '' || loading;

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    onSubmit(input);
    setInput('');
  }, [disabled, input, onSubmit]);

  return (
    <div className="flex mt-[20px]">
      <input
        placeholder="Start conversation"
        className="shadow-inner flex-1 border-none rounded-md text-[#273346] bg-[#f8f8fa] p-[12px]"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      />
      <button
        disabled={disabled}
        className="disabled:cursor-not-allowed disabled:bg-[#50a5f0] shadow-sm text-white bg-[#0086ff] ml-[10px] p-[12px] px-[20px] border-none rounded-md"
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
    </div>
  );
};

export default MessageInput;
