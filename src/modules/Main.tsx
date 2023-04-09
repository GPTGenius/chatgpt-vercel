import { FC, useEffect, useState } from 'react';
import GlobalContext from '@contexts/global';
import {
  defaultConversation,
  defaultGloablConfig,
  globalConfigLocalKey,
  localConversationKey,
} from '@configs';
import type { Conversation, GlobalConfig, Lang } from '@interfaces';
import { getI18n } from '@utils/i18n';
import Sidebar from './Sidebar';
import Content from './Content';
import Configuration from './Configuration';

const Main: FC<{ lang: Lang }> = ({ lang }) => {
  // gloabl configs
  const [configs, setConfigs] = useState<Partial<GlobalConfig>>({});

  const i18n = getI18n(configs.lang ?? 'en');

  // chat informations
  const [currentId, setCurrentId] = useState<string>('1');
  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >({
    [defaultConversation.id]: {
      ...defaultConversation,
      title: i18n.status_empty,
    },
  });

  const [activeSetting, setActiveSetting] = useState(false);

  // media query
  const [isMobile, setIsMobile] = useState(false);

  const list = Object.values(conversations)
    .reverse()
    .map((conversation) => ({
      key: conversation.id,
      mode: conversation.mode,
      title: conversation.title,
      message: conversation.messages.slice(-1)?.[0]?.content ?? '',
      time:
        conversation.messages.slice(-1)?.[0]?.createdAt ??
        conversation.createdAt,
    }));

  // media query
  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    if (media.matches) {
      setIsMobile(true);
      setTimeout(() => {
        setCurrentId('');
      }, 0);
    }
  }, []);

  useEffect(() => {
    const defaultConfigs = {
      ...defaultGloablConfig,
      lang,
    };
    // read from localstorage in the first time
    const localConfigsStr = localStorage.getItem(globalConfigLocalKey);
    if (localConfigsStr) {
      try {
        const localConfigs = JSON.parse(localConfigsStr);
        setConfigs((currentConfigs) => ({
          ...defaultConfigs,
          ...currentConfigs,
          ...localConfigs,
        }));
        if (localConfigs.save) {
          const localConversation = localStorage.getItem(localConversationKey);
          if (localConversation) {
            const conversation = JSON.parse(localConversation);
            // historical localstorage
            if (Array.isArray(conversation) && conversation.length > 0) {
              setConversations({
                [defaultConversation.id]: {
                  title: conversation[0].content,
                  messages: conversation,
                  id: defaultConversation.id,
                  createdAt: Date.now(),
                },
              });
            } else {
              setConversations(conversation);
              setCurrentId(
                Object.keys(conversation)?.reverse()?.[0] ??
                  defaultConversation.id
              );
            }
          }
        }
      } catch (e) {
        setConfigs(defaultConfigs);
      }
    } else {
      setConfigs(defaultConfigs);
    }
  }, []);

  // save current conversation
  useEffect(() => {
    if (configs.save) {
      localStorage.setItem(localConversationKey, JSON.stringify(conversations));
    } else {
      localStorage.removeItem(localConversationKey);
    }
  }, [conversations, configs.save]);

  const getSidebar = () => <Sidebar data={list} />;

  const getContent = () => <Content setActiveSetting={setActiveSetting} />;

  const getConfigration = () => (
    <Configuration
      setActiveSetting={setActiveSetting}
      setConfigs={setConfigs}
    />
  );

  return (
    <GlobalContext.Provider
      value={{
        i18n,
        configs,
        isMobile,
        currentId,
        setCurrentId,
        conversations,
        setConversations,
      }}
    >
      <div
        className={`w-[100%] h-[100%] flex overflow-hidden ${
          isMobile ? '' : 'rounded-2xl'
        }`}
        style={{ boxShadow: '0 20px 68px rgba(0, 0, 0, 0.15)' }}
      >
        {isMobile ? (
          <>
            {currentId ? (
              <div className="w-full flex">
                {activeSetting ? (
                  <div className="w-full">{getConfigration()}</div>
                ) : (
                  <div className="h-full w-full">{getContent()}</div>
                )}
              </div>
            ) : (
              <div className="w-full ">{getSidebar()}</div>
            )}
          </>
        ) : (
          <>
            <div className="w-1/3 ">{getSidebar()}</div>
            <div className="w-2/3 flex">
              <div className="h-full flex-1">{getContent()}</div>
              {activeSetting ? (
                <div className="w-2/5">{getConfigration()}</div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </GlobalContext.Provider>
  );
};

export default Main;
