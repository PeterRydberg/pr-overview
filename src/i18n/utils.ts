import { translations, type Translations } from "./translations";

export type Locale = keyof typeof translations;
export const locales = Object.keys(translations) as Locale[];
export const DEFAULT_LOCALE = "en";

type DotNotationKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends object
    ? DotNotationKeys<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

type TranslationKey = DotNotationKeys<Translations>;

const getNestedValue = (obj: Record<string, unknown>, key: string): string => {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj) as string;
};

export type TranslationFunction = (key: TranslationKey) => string;

export const getTranslations = (locale?: string): TranslationFunction => {
  const lang = (locale ?? DEFAULT_LOCALE) as Locale;

  return function t(key: TranslationKey): string {
    return (
      getNestedValue(translations[lang] as Record<string, unknown>, key) ??
      getNestedValue(translations.en as Record<string, unknown>, key)
    );
  };
};
