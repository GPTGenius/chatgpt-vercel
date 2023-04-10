import { FC, useContext, useState } from 'react';
import { Conversation, ReactSetState } from '@interfaces';
import ConfigIcon from '@components/ConfigIcon';
import GlobalContext from '@contexts/global';
import { Tooltip } from 'antd';
import OutputConversationModal from '@components/OutputConversationModal';

interface ContentHeaderProps {
  conversation: Conversation;
  setActiveSetting: ReactSetState<boolean>;
  setShowPrompt: ReactSetState<boolean>;
  setText: ReactSetState<string>;
}

const ContentHeader: FC<ContentHeaderProps> = ({
  conversation,
  setActiveSetting,
  setShowPrompt,
  setText,
}) => {
  const { i18n, isMobile, setCurrentId } = useContext(GlobalContext);

  // output conversation modal
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`w-full h-[60px] flex items-center justify-between ${
        isMobile ? '' : 'pl-5'
      } pr-5 border-b border-b-[#edeeee] overflow-hidden`}
    >
      <div className="flex items-center flex-1 overflow-hidden">
        {isMobile ? (
          <i
            className="ri-arrow-left-line p-3 ml-2 cursor-pointer"
            onClick={() => setCurrentId('')}
          />
        ) : null}
        <div className="text-[#232629] flex-1 truncate mr-2">
          {conversation.title}
        </div>
      </div>
      <div>
        <Tooltip title={i18n.action_output}>
          <ConfigIcon
            name="ri-chat-download-line mr-2"
            onClick={() => {
              setVisible(true);
            }}
          />
        </Tooltip>
        <Tooltip title={i18n.action_prompt}>
          <ConfigIcon
            name="ri-user-add-line mr-2"
            onClick={() => {
              setText('/');
              setShowPrompt(true);
            }}
          />
        </Tooltip>
        <ConfigIcon
          name="ri-settings-3-line"
          onClick={() => setActiveSetting((active) => !active)}
        />
      </div>
      <OutputConversationModal
        conversation={conversation}
        open={visible}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
};
export default ContentHeader;
