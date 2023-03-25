import zhLang from 'lang/zh.json';
import enLang from 'lang/en.json';

export const getI18n = (lang) => (lang === 'zh' ? zhLang : enLang);

export type I18n = ReturnType<typeof getI18n>;
