import { header as headerEN } from "./en/header";
import { login as loginEN } from "./en/login";
import { header as headerNO } from "./no/header";
import { login as loginNO } from "./no/login";

export type Translations = typeof translations.en;
export const translations = {
  en: {
    header: headerEN,
    login: loginEN,
  },
  no: {
    header: headerNO,
    login: loginNO,
  },
} as const;
