import { header as headerEN } from "./en/header";
import { login as loginEN } from "./en/login";
import { pullRequestList as pullRequestListEN } from "./en/pullRequestList";
import { header as headerNO } from "./no/header";
import { login as loginNO } from "./no/login";
import { pullRequestList as pullRequestListNO } from "./no/pullRequestList";

export type Translations = typeof translations.en;
export const translations = {
  en: {
    header: headerEN,
    login: loginEN,
    pullRequestList: pullRequestListEN,
  },
  no: {
    header: headerNO,
    login: loginNO,
    pullRequestList: pullRequestListNO,
  },
} as const;
