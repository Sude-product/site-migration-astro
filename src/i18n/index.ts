import { tr } from './tr';
import { en } from './en';
import { nl } from './nl';
import { it } from './it';
import type { Translations } from './types';

export type { Translations, NavLabels, CtaLabels, HeroLabels } from './types';

const DICTIONARIES = { tr, en, nl, it } as const;

export type Locale = keyof typeof DICTIONARIES;

/** Verilen locale için çeviri sözlüğünü döner; tanınmayan/eksik locale'de tr'ye düşer. */
export function getTranslations(locale: string | undefined): Translations {
  return DICTIONARIES[locale as Locale] ?? DICTIONARIES.tr;
}
