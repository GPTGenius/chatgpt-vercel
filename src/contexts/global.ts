import { createContext } from 'react';
import { I18n } from '@utils/i18n';
import type { Conversation, GlobalConfig, ReactSetState } from '@interfaces';
import { noop } from 'lodash-es';

const GlobalContext = createContext<{
  i18n: Partial<I18n>;
  configs: Partial<GlobalConfig>;
  isMobile: boolean;
  currentId: string;
  setCurrentId: ReactSetState<string>;
  conversations: Record<string, Conversation>;
  setConversations: ReactSetState<Record<string, Conversation>>;
  inVercel: boolean;
}>({
  i18n: {},
  configs: {},
  isMobile: false,
  currentId: '1',
  setCurrentId: noop,
  conversations: {},
  setConversations: noop,
  inVercel: false,
});
export default GlobalContext;
