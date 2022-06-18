import flatten from 'flat';
import { en } from './en';

export const dictionaries = {
    en: flatten<ILocale, ILocale>(en),
};


type ILocale = Record<string, Record<string, string | Record<string, string>>>;