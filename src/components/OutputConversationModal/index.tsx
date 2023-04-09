import { FC, useContext, useMemo } from 'react';
import { Button, Modal, ModalProps, Space } from 'antd';
import GlobalContext from '@contexts/global';
import { Conversation } from '@interfaces';
import { copyToClipboard, downloadAs } from '@utils';

interface IProps extends ModalProps {
  conversation: Conversation;
}
const OutputConversationModal: FC<IProps> = ({
  conversation,
  ...restProps
}) => {
  const { i18n, isMobile } = useContext(GlobalContext);
  const markdown = useMemo(() => {
    const title = `# ${conversation.title}\n\n`;
    const content = conversation.messages
      .map((message) => `## ${message.role}:\n${message.content}\n`)
      .join('\n');
    return title + content;
  }, [conversation]);

  return (
    <Modal
      title={i18n.action_output}
      footer={null}
      width={isMobile ? '90vw' : '50vw'}
      bodyStyle={{
        maxHeight: isMobile ? '90vh' : '50vh',
      }}
      {...restProps}
    >
      <pre className="text-[12px] p-[8px] rounded-md bg-[#282c34] text-[#f0f6fc] break-words overflow-auto">
        {markdown}
      </pre>
      <div className="mt-[12px] flex items-center flex-row-reverse">
        <Space>
          <Button
            icon={<i className="ri-file-copy-line" />}
            onClick={() => copyToClipboard(markdown)}
          >
            {i18n.action_copy}
          </Button>
          <Button
            icon={<i className="ri-file-download-line" />}
            onClick={() => downloadAs(markdown, `${conversation.title}.md`)}
          >
            {i18n.action_download}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default OutputConversationModal;
