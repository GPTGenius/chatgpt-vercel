import { FC, useContext, useState } from 'react';
import { Input } from 'antd';
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
      <Input.TextArea
        placeholder={i18n.chat_placeholder}
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onPressEnter={(e) => {
          if (!e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        size="large"
        autoSize={{ minRows: 1, maxRows: 5 }}
        allowClear
      />
      <i
        className={`${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } text-gradient text-[24px] ml-[0.5rem] ri-send-plane-fill`}
        onClick={() => handleSubmit()}
      />
    </div>
  );
};

export default MessageInput;
