/// <reference path="../.astro/types.d.ts" />

type AccessToken = {
  accessToken: string;
  accessTokenExpiresAt: Date | undefined;
  scopes: string[];
  idToken: string | undefined;
};

declare namespace App {
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
    accessToken: AccessToken | null;
  }
}
