import flatten from 'flat';
import * as de from './de.json';
import * as en from './en.json';
import * as ru from './ru.json';
import * as es from './es.json';
// import * as fr from './fr.json';
// import * as jp from './jp.json';
// import * as pt from './pt.json';
// import * as zh from './zh.json';

export const DICTIONARIES = { en, de, es, ru };
// 	en: flatten<ILocale, ILocale>(en),
// 	de: flatten<ILocale, ILocale>(de),
// 	es: flatten<ILocale, ILocale>(es),
// 	// fr: flatten<ILocale, ILocale>(fr),
// 	// jp: flatten<ILocale, ILocale>(jp),
// 	// pt: flatten<ILocale, ILocale>(pt),
// 	ru: flatten<ILocale, ILocale>(ru)
// 	// zh: flatten<ILocale, ILocale>(zh)
// };

export const ARTICLES = Object.keys(en.text.article);
export const AVAILABLE_LOCALES = Object.keys(DICTIONARIES);

type ILocale = Record<string, object>;
