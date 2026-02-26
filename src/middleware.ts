import { defineMiddleware } from "astro:middleware";
import { auth } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  const accessToken = session
    ? await auth.api.getAccessToken({
        body: { providerId: "github" },
        headers: context.request.headers,
      })
    : null;

  if (session) {
    context.locals.user = session.user;
    context.locals.session = session.session;
    context.locals.accessToken = accessToken;
  } else {
    context.locals.user = null;
    context.locals.session = null;
    context.locals.accessToken = null;
  }

  return next();
});
