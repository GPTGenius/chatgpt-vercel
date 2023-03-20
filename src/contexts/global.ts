import { I18n } from '@utils';
import { createContext } from 'react';

const GlobalContext = createContext<{ i18n: Partial<I18n> }>({
  i18n: {},
});
export default GlobalContext;
