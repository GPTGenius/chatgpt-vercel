import { FC, useContext, useMemo } from 'react';
import { Button, Modal, ModalProps, Space, message as Message } from 'antd';
import GlobalContext from '@contexts/global';
import { Conversation } from '@interfaces';
import { copyToClipboard, downloadAs } from '@utils';

interface IProps extends ModalProps {
  conversation: Conversation;
}
const ExportConversationModal: FC<IProps> = ({
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
      {...restProps}
    >
      <pre
        className={`${
          isMobile ? 'max-h-[60vh]' : 'max-h-[50vh]'
        } text-[12px] p-[8px] rounded-md bg-[#282c34] text-[#f0f6fc] break-all overflow-auto whitespace-pre-wrap common-scrollbar`}
      >
        {markdown}
      </pre>
      <div className="mt-[12px] flex items-center flex-row-reverse">
        <Space>
          <Button
            className="flex items-center"
            icon={<i className="ri-file-copy-line mr-1" />}
            onClick={() => {
              copyToClipboard(markdown);
              Message.success(i18n.success_copy);
            }}
          >
            {i18n.action_copy}
          </Button>
          <Button
            className="flex items-center"
            icon={<i className="ri-file-download-line mr-1" />}
            onClick={() => downloadAs(markdown, `${conversation.title}.md`)}
          >
            {i18n.action_download}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ExportConversationModal;
