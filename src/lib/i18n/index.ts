import flatten from 'flat';
import * as de from './de.json';
import * as en from './en.json';
import * as ru from './ru.json';
import * as es from './es.json';
// import * as fr from './fr.json';
// import * as jp from './jp.json';
// import * as pt from './pt.json';
// import * as zh from './zh.json';

// export const DICTIONARIES = { en };
export const DICTIONARIES = { en, de, es, ru };

export const ARTICLES = Object.keys(en.text.article);
export const AVAILABLE_LOCALES = Object.keys(DICTIONARIES);

type ILocale = Record<string, object>;
