import { FC, useContext } from 'react';
import { Dropdown, MenuProps, Tabs, TabsProps } from 'antd';
import omit from 'lodash.omit';
import GlobalContext from '@contexts/global';
import { getMaxTabIndex } from '@utils';
import { Conversation, ConversationMode } from '@interfaces';
import './index.css';

const ConversationTabs: FC<{
  tabs: TabsProps['items'];
  setConversations: React.Dispatch<
    React.SetStateAction<Record<string, Conversation>>
  >;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}> = ({ tabs, setConversations, currentTab, setCurrentTab }) => {
  const { i18n } = useContext(GlobalContext);

  const onAdd = (mode: ConversationMode = 'text') => {
    const id = getMaxTabIndex(tabs).toString();
    setConversations((items) => ({
      ...items,
      [id]: {
        id,
        title: i18n.status_empty,
        mode,
        messages: [],
        createdAt: Date.now(),
      },
    }));
    setCurrentTab(id);
  };

  const onEdit = (key: string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      setConversations((items) => omit(items, [key]));
      setCurrentTab(tabs.filter((tab) => tab.key !== key)[0].key);
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={() => onAdd()}>{i18n.chat_mode_text}</div>,
    },
    {
      key: '2',
      label: <div onClick={() => onAdd('image')}>{i18n.chat_mode_image}</div>,
    },
  ];

  return (
    <Tabs
      className="mb-0 mt-4"
      type="editable-card"
      onChange={setCurrentTab}
      activeKey={currentTab}
      onEdit={onEdit}
      hideAdd
      tabBarExtraContent={{
        left: (
          <Dropdown
            className="add-chat-icon"
            menu={{ items }}
            trigger={['click']}
            placement="bottomLeft"
            getPopupContainer={(node) => node}
          >
            <i className="ri-chat-new-line cursor-pointer p-2" />
          </Dropdown>
        ),
      }}
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
