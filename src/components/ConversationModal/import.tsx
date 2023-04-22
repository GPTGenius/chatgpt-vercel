import { FC, useContext, useState } from 'react';
import {
  Button,
  Modal,
  ModalProps,
  Space,
  message as Message,
  Input,
} from 'antd';
import GlobalContext from '@contexts/global';
import { parseConversation } from '@utils';

interface ImportConversationModalProps {
  nextId: string;
  onCancel: () => void;
}

const ImportConversationModal: FC<
  ImportConversationModalProps & Omit<ModalProps, 'onCancel'>
> = ({ nextId, onCancel, ...rest }) => {
  const { i18n, isMobile, setCurrentId, setConversations } =
    useContext(GlobalContext);

  const [text, setText] = useState('');

  const importConversation = () => {
    const conversation = parseConversation(text);
    setConversations((conversations) => ({
      ...conversations,
      [nextId]: {
        id: nextId,
        ...conversation,
      },
    }));
    setCurrentId(nextId);
    Message.success(i18n.success_import);
    setText('');
    onCancel();
  };

  return (
    <Modal
      title={i18n.action_import}
      footer={null}
      width={isMobile ? '90vw' : '50vw'}
      onCancel={onCancel}
      {...rest}
    >
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoSize={{ minRows: 5 }}
      />
      <div className="mt-[12px] flex items-center flex-row-reverse">
        <Space>
          <Button
            className="flex items-center"
            icon={<i className="ri-file-copy-line mr-1" />}
            onClick={importConversation}
            disabled={!text}
          >
            {i18n.action_ok}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ImportConversationModal;
