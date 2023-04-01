import { createContext } from 'react';
import { I18n } from '@utils/i18n';
import { defaultGloablConfig } from '@configs';
import type { GlobalConfig } from '@interfaces';

const GlobalContext = createContext<{
  i18n: Partial<I18n>;
  configs: GlobalConfig;
  isMobile: boolean;
}>({
  i18n: {},
  configs: defaultGloablConfig,
  isMobile: false,
});
export default GlobalContext;
