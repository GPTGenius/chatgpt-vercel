import { FC, useContext } from 'react';
import { Conversation, ReactSetState } from '@interfaces';
import ConfigIcon from '@components/ConfigIcon';
import GlobalContext from '@contexts/global';
import { Tooltip } from 'antd';

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
  return (
    <div className="h-[60px] flex items-center justify-between pl-5 pr-5 border-b border-b-[#edeeee]">
      <div className="flex items-center">
        {isMobile ? (
          <i
            className="ri-arrow-left-line p-2 mr-1 pl-0 cursor-pointer"
            onClick={() => setCurrentId('')}
          />
        ) : null}
        <div className="text-[#232629]">{conversation.title}</div>
      </div>
      <div>
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
    </div>
  );
};
export default ContentHeader;
