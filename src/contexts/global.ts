import { createContext } from 'react';
import { I18n } from '@utils/i18n';
import type { GlobalConfig } from '@interfaces';

const GlobalContext = createContext<{
  i18n: Partial<I18n>;
  configs: Partial<GlobalConfig>;
  isMobile: boolean;
}>({
  i18n: {},
  configs: {},
  isMobile: false,
});
export default GlobalContext;
