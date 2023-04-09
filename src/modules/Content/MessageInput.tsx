import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Input } from 'antd';
import GlobalContext from '@contexts/global';
import PromptSelect from '@components/PromptSelect';

const MessageInput: FC<{
  text: string;
  setText: (text: string) => void;
  currentId: string; // current conversation id
  showPrompt: boolean;
  setShowPrompt: (showPrompt: boolean) => void;
  onSubmit: (message: string) => Promise<void>;
  loading: boolean;
}> = ({
  text,
  setText,
  currentId,
  showPrompt,
  setShowPrompt,
  onSubmit,
  loading,
}) => {
  const { i18n } = useContext(GlobalContext);
  const [promptKeyword, setPromptKeyword] = useState('');
  const [isInputComposition, setIsInputComposition] = useState(false);

  // textarea ref
  const ref = useRef(null);

  const disabled = text.trim() === '' || loading;

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(text);
  };

  const onPromptSelect = useCallback(
    (prompt) => {
      setShowPrompt(false);
      setTimeout(() => {
        setText(prompt);
        ref.current.focus();
      }, 400);
    },
    [setShowPrompt, setText]
  );

  useEffect(() => {
    if (showPrompt) {
      ref.current.focus();
    }
  }, [showPrompt]);

  useEffect(() => {
    // auto focus when change conversation
    ref.current.focus();
  }, [currentId]);

  return (
    <div className="flex items-center p-5 pt-0">
      <PromptSelect
        keyword={promptKeyword}
        showPrompt={showPrompt}
        onSelect={onPromptSelect}
      >
        <div className="flex-1 border border-[#dfdfdf] rounded-lg relative">
          <Input.TextArea
            ref={ref}
            placeholder={i18n.chat_placeholder}
            value={text}
            autoFocus
            bordered={false}
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
            onCompositionStart={() => setIsInputComposition(true)}
            onCompositionEnd={() => setIsInputComposition(false)}
            onPressEnter={(e) => {
              if (!e.shiftKey && !isInputComposition) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            size="large"
            autoSize={{ minRows: 1, maxRows: 5 }}
            allowClear
          />
        </div>
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
