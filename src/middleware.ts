import { defineMiddleware } from "astro:middleware";
import { auth } from "./lib/auth/auth";
import { isPublicPath } from "./lib/auth/paths";

const normalizePath = (pathname: string) => {
  return pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
};

export const onRequest = defineMiddleware(async (context, next) => {
  const requestPath = normalizePath(new URL(context.request.url).pathname);

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

  if (!session && !isPublicPath(requestPath)) {
    return context.redirect("/login");
  }

  return next();
});
