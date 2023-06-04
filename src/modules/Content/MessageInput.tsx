import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Input } from 'antd';
import GlobalContext from '@contexts/global';
import PromptSelect from '@components/PromptSelect';

const MessageInput: FC<{
  text: string;
  setText: (text: string) => void;
  streamMessage: string;
  showPrompt: boolean;
  setShowPrompt: (showPrompt: boolean) => void;
  onSubmit: (message: string) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}> = ({
  text,
  setText,
  streamMessage,
  showPrompt,
  setShowPrompt,
  onSubmit,
  onCancel,
  loading,
}) => {
  const { i18n, currentId } = useContext(GlobalContext);
  const [promptKeyword, setPromptKeyword] = useState('');
  const [isInputComposition, setIsInputComposition] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div className="flex items-start p-5 pt-5">
      <PromptSelect
        keyword={promptKeyword}
        showPrompt={showPrompt}
        onSelect={onPromptSelect}
      >
        <div className="flex-1 border border-[#dfdfdf] rounded-lg relative">
          <Input.TextArea
            ref={ref}
            placeholder={
              isExpanded
                ? i18n.chat_expanded_placeholder
                : i18n.chat_placeholder
            }
            value={text}
            disabled={loading}
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
              if (isInputComposition) {
                return;
              }
              if (isExpanded && !e.shiftKey) {
                return;
              }
              if (!isExpanded && e.shiftKey) {
                return;
              }
              e.preventDefault();
              handleSubmit();
            }}
            size="large"
            autoSize={isExpanded ? null : { minRows: 1, maxRows: 5 }}
            rows={isExpanded ? 10 : null}
            style={{ resize: 'none' }}
          />
          <i
            className={`absolute right-0 translate-x-[-50%] top-0 translate-y-[-0%] z-50 cursor-pointer text-gradient text-[24px] ml-[0.5rem] ${
              isExpanded ? 'ri-fullscreen-exit-fill' : 'ri-fullscreen-fill'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          {streamMessage && loading ? (
            <Button
              className="absolute left-1/2 translate-x-[-50%] top-1/2  translate-y-[-50%] z-50"
              size="small"
              type="dashed"
              onClick={onCancel}
            >
              {i18n.action_stop}
            </Button>
          ) : null}
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
