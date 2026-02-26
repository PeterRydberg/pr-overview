const PUBLIC_PATHS = ["/login"];
const PUBLIC_PREFIXES = ["/_astro", "/api/auth"];

export const isPublicPath = (requestPath: string) =>
  PUBLIC_PATHS.includes(requestPath) ||
  PUBLIC_PREFIXES.some((p) => requestPath.startsWith(p)) ||
  requestPath === "/favicon.ico" ||
  requestPath === "/robots.txt";
