import * as de from './de.json';
import * as en from './en.json';
import * as ru from './ru.json';
import * as es from './es.json';

// export const DICTIONARIES = { en };
export const DICTIONARIES = { en, de, es, ru };

export const ARTICLES = Object.keys(en.text.article);
export const AVAILABLE_LOCALES = Object.keys(DICTIONARIES);
