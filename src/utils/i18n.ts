import zhLang from 'lang/zh.json';
import enLang from 'lang/en.json';
import { Lang } from '@interfaces';

export const getI18n = (lang: Lang) => (lang === 'zh' ? zhLang : enLang);

export type I18n = ReturnType<typeof getI18n>;
