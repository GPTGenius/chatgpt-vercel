import { FC, useContext, useState } from 'react';
import { Dropdown, Input, MenuProps } from 'antd';
import { omit, sortBy } from 'lodash-es';
import GlobalContext from '@contexts/global';
import { getMaxIndex } from '@utils';
import { ConversationMode, RecordCardItem } from '@interfaces';
import './index.css';
import ImportConversationModal from '@components/ConversationModal/import';
import RecordCard from './RecordCard';

const Sidebar: FC<{
  data: RecordCardItem[];
}> = ({ data }) => {
  const [keyword, setKeyword] = useState('');
  // import modal
  const [visible, setVisible] = useState(false);
  const { i18n, currentId, setCurrentId, conversations, setConversations } =
    useContext(GlobalContext);

  const onAdd = (mode: ConversationMode = 'text') => {
    const id = getMaxIndex(data).toString();
    setConversations((items) => ({
      ...items,
      [id]: {
        id,
        title: '',
        mode,
        messages: [],
        createdAt: Date.now(),
      },
    }));
    setCurrentId(id);
  };

  const onDelete = (key: string) => {
    setConversations((items) => omit(items, [key]));
    // delete other conversation doesnt need to update currentTab
    if (currentId === key) {
      setCurrentId(data.filter((tab) => tab.key !== key)[0]?.key);
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={() => onAdd()}>
          <i className="ri-chat-4-line align-bottom mr-1" />
          {i18n.action_add_text}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() => onAdd('image')}>
          <i className="ri-image-line align-bottom mr-1" />
          {i18n.action_add_image}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={() => setVisible(true)}>
          <i className="ri-chat-upload-line align-bottom mr-1" />
          {i18n.action_import}
        </div>
      ),
    },
  ];

  const filterData = data.filter(
    (item) =>
      item.title.includes(keyword) ||
      conversations[item.key]?.messages?.some((message) =>
        message.content.includes(keyword)
      )
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 mt-2 flex items-baseline justify-between">
        <span className="text-3xl text-gradient font-[800]">ChatGPT</span>
        <a
          href="https://github.com/GPTGenius/chatgpt-vercel"
          target="_blank"
          rel="noreferrer"
        >
          <i className="ml-2 ri-github-fill text-xl" />
        </a>
      </div>
      <div className="p-2 flex items-center justify-between mb-4">
        <div className="rounded-xl h-10 border flex-1">
          <Input
            className="h-[100%]"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            prefix={<i className="ri-search-2-line" />}
            placeholder={i18n.search_placeholder}
            bordered={false}
            allowClear
          />
        </div>
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          placement="bottomRight"
          getPopupContainer={(node) => node}
        >
          <i className="ri-chat-new-line cursor-pointer p-2 ml-1" />
        </Dropdown>
      </div>
      <div className="common-scrollbar flex-1 p-2 pt-0 overflow-auto">
        {sortBy(filterData, ['time'])
          .reverse()
          .map((conversation, index) => (
            <div key={conversation.key}>
              {index !== 0 ? (
                <div className="h-[1px] bg-[#edeeee] ml-2 mr-2" />
              ) : null}
              <RecordCard
                data={conversation}
                selected={conversation.key === currentId}
                onSelect={() => setCurrentId(conversation.key)}
                onDelete={
                  data.length > 1 ? () => onDelete(conversation.key) : null
                }
              />
            </div>
          ))}
      </div>
      <ImportConversationModal
        nextId={getMaxIndex(data).toString()}
        open={visible}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
};

export default Sidebar;
