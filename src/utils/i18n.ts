import zhLang from 'lang/zh.json';
import enLang from 'lang/en.json';
import { globalConfigLocalKey } from '@configs';

export const initLang = (lang) => {
  try {
    const configs = JSON.parse(localStorage.getItem(globalConfigLocalKey));
    // if no lang configured, update the localStorage
    if (configs?.lang) {
      localStorage.setItem(
        globalConfigLocalKey,
        JSON.stringify({
          ...(configs ?? {}),
          lang,
        })
      );
    }
  } catch (e) {
    //
  }
};

export const getI18n = (lang) => (lang === 'zh' ? zhLang : enLang);

export type I18n = ReturnType<typeof getI18n>;
