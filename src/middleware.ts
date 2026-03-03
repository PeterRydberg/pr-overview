import { getRelativeLocaleUrl } from "astro:i18n";
import { defineMiddleware, sequence } from "astro:middleware";
import { DEFAULT_LOCALE } from "./i18n/utils";
import { auth } from "./lib/auth/auth";
import { isPublicPath, PUBLIC_PREFIXES } from "./lib/auth/paths";
import { getLocaleFromPathname, getPreferredLocale, normalizePath } from "./lib/path/paths";

const localeMiddleware = defineMiddleware((context, next) => {
  const { pathname } = context.url;
  const hasLocale = getLocaleFromPathname(pathname);

  if (PUBLIC_PREFIXES.some((path) => pathname.startsWith(path))) {
    return next();
  }

  if (!hasLocale) {
    const locale = getPreferredLocale(context);
    // Preserve the path, e.g. /login → /en/login
    const target = pathname === "/" ? `/${locale}/` : `/${locale}${pathname}`;
    return context.redirect(target, 302);
  }

  return next();
});

const authMiddleware = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const requestPath = normalizePath(pathname, locale);

  if (isPublicPath(requestPath)) {
    return next();
  }

  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (session) {
    const accessToken = await auth.api.getAccessToken({
      body: { providerId: "github" },
      headers: context.request.headers,
    });
    context.locals.user = session.user;
    context.locals.session = session.session;
    context.locals.accessToken = accessToken;
  } else {
    context.locals.user = null;
    context.locals.session = null;
    context.locals.accessToken = null;
  }

  if (!session) {
    return context.redirect(getRelativeLocaleUrl(locale, "/login"), 302);
  }

  return next();
});

export const onRequest = sequence(localeMiddleware, authMiddleware);
