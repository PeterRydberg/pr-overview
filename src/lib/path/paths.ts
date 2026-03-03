import type { APIContext } from "astro";
import { type Locale, DEFAULT_LOCALE, locales } from "../../i18n/utils";

export const getLocaleFromPathname = (pathname: string): Locale | undefined => {
  const maybeLocale = pathname.split("/")[1] as Locale;
  return locales.includes(maybeLocale) ? maybeLocale : undefined;
};

export const normalizePath = (pathname: string, locale?: string): string => {
  if (locale) {
    const localePrefix = `/${locale}`;
    if (pathname.startsWith(localePrefix)) {
      pathname = pathname.slice(localePrefix.length) || "/";
    }
  }
  return pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
};

export const getPreferredLocale = (context: APIContext): Locale => {
  return context.preferredLocale && locales.includes(context.preferredLocale as Locale)
    ? (context.preferredLocale as Locale)
    : DEFAULT_LOCALE;
};
