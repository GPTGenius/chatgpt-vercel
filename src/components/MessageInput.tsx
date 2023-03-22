import { FC, useContext, useState } from 'react';
import { Input } from 'antd';
import GlobalContext from '@contexts/global';
import PromptSelect from './PromptSelect';

const MessageInput: FC<{
  text: string;
  setText: (text: string) => void;
  showPrompt: boolean;
  setShowPrompt: (showPrompt: boolean) => void;
  onSubmit: (message: string) => Promise<void>;
  loading: boolean;
}> = ({ text, setText, showPrompt, setShowPrompt, onSubmit, loading }) => {
  const { i18n } = useContext(GlobalContext);
  const [promptKeyword, setPromptKeyword] = useState('');
  const disabled = text.trim() === '' || loading;

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(text);
  };

  const onPromptSelect = (prompt) => {
    setText(prompt);
    setShowPrompt(false);
  };

  return (
    <div className="flex items-center">
      <PromptSelect
        keyword={promptKeyword}
        showPrompt={showPrompt}
        onSelect={onPromptSelect}
      >
        <Input.TextArea
          placeholder={i18n.chat_placeholder}
          value={text}
          onChange={(event) => {
            const val = event.target.value;
            setText(val);
            if (val.startsWith('/')) {
              setShowPrompt(true);
              setPromptKeyword(val.slice(1));
            } else {
              setShowPrompt(false);
              setPromptKeyword('');
            }
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
      </PromptSelect>

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
