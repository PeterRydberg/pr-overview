// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import { DEFAULT_LOCALE, locales } from "./src/i18n/utils";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: locales,
    routing: "manual",
  },

  env: {
    schema: {
      APP_NAME: envField.string({ context: "client", access: "public" }),

      BETTER_AUTH_URL: envField.string({ context: "server", access: "public" }),
      BETTER_AUTH_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),

      GITHUB_CLIENT_ID: envField.string({
        context: "server",
        access: "public",
      }),
      GITHUB_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
