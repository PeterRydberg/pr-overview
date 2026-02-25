// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  env: {
    schema: {
      APP_NAME: envField.string({ context: "client", access: "public" }),

      BETTER_AUTH_URL: envField.string({ context: "server", access: "public" }),
      BETTER_AUTH_SECRET: envField.string({ context: "server", access: "secret" }),

      GITHUB_CLIENT_ID: envField.string({ context: "server", access: "public" }),
      GITHUB_CLIENT_SECRET: envField.string({ context: "server", access: "secret" }),
    },
  },
});
