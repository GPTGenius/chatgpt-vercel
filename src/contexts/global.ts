import { createContext } from 'react';
import { I18n } from '@utils/i18n';
import type { Lang } from '@interfaces';

const GlobalContext = createContext<{
  i18n: Partial<I18n>;
  lang: Lang;
  isMobile: boolean;
}>({
  i18n: {},
  lang: 'en',
  isMobile: false,
});
export default GlobalContext;
