import { createContext } from 'react';
import { I18n } from '@utils';
import type { Lang } from '@interfaces';

const GlobalContext = createContext<{ i18n: Partial<I18n>; lang: Lang }>({
  i18n: {},
  lang: 'en',
});
export default GlobalContext;
