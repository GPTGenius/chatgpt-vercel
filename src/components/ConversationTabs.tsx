import { FC, useContext } from 'react';
import { Tabs, TabsProps } from 'antd';
import omit from 'lodash.omit';
import GlobalContext from '@contexts/global';
import { getMaxTabIndex } from '@utils';
import { Conversation } from '@interfaces';

const ConversationTabs: FC<{
  tabs: TabsProps['items'];
  setConversations: React.Dispatch<
    React.SetStateAction<Record<string, Conversation>>
  >;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}> = ({ tabs, setConversations, currentTab, setCurrentTab }) => {
  const { i18n } = useContext(GlobalContext);

  const onEdit = (key: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      const id = getMaxTabIndex(tabs).toString();
      setConversations((items) => ({
        ...items,
        [id]: {
          id,
          title: i18n.status_empty,
          messages: [],
          createdAt: Date.now(),
        },
      }));
      setCurrentTab(id);
    } else if (action === 'remove') {
      setConversations((items) => omit(items, [key]));
      setCurrentTab(tabs.filter((tab) => tab.key !== key)[0].key);
    }
  };

  return (
    <Tabs
      className="mb-0"
      type="editable-card"
      onChange={setCurrentTab}
      activeKey={currentTab}
      onEdit={onEdit}
      items={
        tabs.length === 1
          ? [
              {
                ...tabs[0],
                closable: false,
              },
            ]
          : tabs
      }
    />
  );
};

export default ConversationTabs;
