import { FC, useContext, useState } from 'react';
import GlobalContext from '@contexts/global';

const MessageInput: FC<{
  onSubmit: (message: string) => Promise<void>;
  loading: boolean;
}> = ({ onSubmit, loading }) => {
  const { i18n } = useContext(GlobalContext);
  const [input, setInput] = useState('');
  const disabled = input.trim() === '' || loading;

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(input);
    setInput('');
  };

  return (
    <div className="flex items-center">
      <input
        placeholder={i18n.chat_placeholder}
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
      <i
        className={`${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } text-gradient text-[24px] ml-[0.5rem] ri-send-plane-fill`}
        onClick={() => handleSubmit()}
      ></i>
    </div>
  );
};

export default MessageInput;
