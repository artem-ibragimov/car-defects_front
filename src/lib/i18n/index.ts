import flatten from 'flat';
import * as en from './en.json';
import * as ru from './ru.json';

export const DICTIONARIES = {
	en: flatten<ILocale, ILocale>(en),
	ru: flatten<ILocale, ILocale>(ru)
};

export const ARTICLES = Object.keys(en.text.article);
export const AVAILABLE_LOCALES = Object.keys(DICTIONARIES);

type ILocale = Record<string, object>;
