import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import GlobalContext from '@contexts/global';
import {
  defaultConversation,
  defaultGloablConfig,
  globalConfigLocalKey,
  localConversationKey,
} from '@configs';
import type { Conversation, GlobalConfig, Lang } from '@interfaces';
import { getI18n } from '@utils/i18n';
import { debounce } from 'lodash-es';
import { registerMediumZoom, isMatchMobile, setClassByLayout } from '@utils';
import { ConfigProvider } from 'antd';
import { writeHistory } from '@utils/history';
import Sidebar from './Sidebar';
import Content from './Content';
import Empty from './Empty';
import Configuration from './Configuration';

const styles = getComputedStyle(document.documentElement);

const Main: FC<{ lang: Lang; inVercel: boolean }> = ({ lang, inVercel }) => {
  // gloabl configs
  const [configs, setConfigs] = useState<Partial<GlobalConfig>>({});

  const i18n = getI18n(configs.lang ?? lang ?? 'en');

  // chat informations
  const [currentId, setCurrentId] = useState<string>(defaultConversation.id);
  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >({
    [defaultConversation.id]: defaultConversation,
  });

  const [activeSetting, setActiveSetting] = useState(false);

  // media query
  const [isMobile, setIsMobile] = useState(isMatchMobile());

  // mobile history ref
  const historyRef = useRef({
    activeSetting,
    isMobile,
    currentId,
  });

  const list = Object.values(conversations).map((conversation) => ({
    key: conversation.id,
    mode: conversation.mode,
    title: conversation.title,
    message: conversation.messages.slice(-1)?.[0]?.content ?? '',
    time:
      conversation.messages.slice(-1)?.[0]?.createdAt ??
      conversation.updatedAt ??
      conversation.createdAt,
  }));

  // debounce resize
  const handleDebounceResize = debounce(() => {
    setIsMobile(isMatchMobile());
  }, 300);

  useLayoutEffect(() => {
    window.addEventListener('resize', handleDebounceResize);
  }, []);

  useEffect(() => {
    registerMediumZoom(isMobile);
  }, [currentId, conversations, isMobile]);

  const setConversationsFromLocal = useCallback(() => {
    try {
      const localConversation = localStorage.getItem(localConversationKey);
      if (localConversation) {
        const conversation: Record<string, Conversation> =
          JSON.parse(localConversation);
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
          if (isMobile) {
            setCurrentId('');
          } else {
            setCurrentId(
              Object.keys(conversation)?.sort((a, b) =>
                (conversation?.[b]?.updatedAt ?? conversation?.[b]?.createdAt) >
                (conversation?.[a]?.updatedAt ?? conversation?.[a]?.createdAt)
                  ? 1
                  : -1
              )?.[0] ?? defaultConversation.id
            );
          }
        }
      }
    } catch (e) {
      //
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
        const localConfigs: GlobalConfig = JSON.parse(localConfigsStr);
        setConfigs((currentConfigs) => ({
          ...defaultConfigs,
          ...currentConfigs,
          ...localConfigs,
        }));
        if (localConfigs.save) {
          setConversationsFromLocal();
        }
        if (localConfigs.layout) {
          setClassByLayout(localConfigs.layout);
        }
      } catch (e) {
        setConfigs(defaultConfigs);
      }
    } else {
      setConfigs(defaultConfigs);
      if (defaultConfigs.save) {
        setConversationsFromLocal();
      }
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

  useEffect(() => {
    historyRef.current = {
      currentId,
      activeSetting,
      isMobile,
    };
  }, [currentId, activeSetting, isMobile]);

  useEffect(() => {
    if (isMobile && currentId) {
      writeHistory();
    }
  }, [isMobile, currentId]);

  // handle mobile go back
  useEffect(() => {
    const handleHistoryBack = () => {
      if (historyRef.current.isMobile) {
        if (historyRef.current.currentId) {
          if (historyRef.current.activeSetting) {
            setActiveSetting(false);
          } else {
            setCurrentId(undefined);
          }
        } else {
          window.history.go(-1);
        }
      }
    };

    window.addEventListener('popstate', handleHistoryBack);
    return () => {
      window.removeEventListener('popstate', handleHistoryBack);
    };
  }, []);

  const getSidebar = () => <Sidebar data={list} />;

  const getContent = () => <Content setActiveSetting={setActiveSetting} />;

  const getEmpty = () => <Empty />;

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
        inVercel,
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: styles.getPropertyValue('--theme-antd'),
          },
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
              <div
                className={`${activeSetting ? 'w-1/4' : 'w-1/3'} max-w-[400px]`}
              >
                {getSidebar()}
              </div>
              <div
                className={`${activeSetting ? 'w-3/4' : 'w-2/3'} flex flex-1`}
              >
                <div
                  className={`h-full ${
                    activeSetting ? 'w-2/3' : 'w-full'
                  }  flex-1`}
                >
                  {currentId ? getContent() : getEmpty()}
                </div>
                {activeSetting ? (
                  <div className="w-1/3 max-w-[400px]">{getConfigration()}</div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </ConfigProvider>
    </GlobalContext.Provider>
  );
};

export default Main;
