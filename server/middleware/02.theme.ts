import { THEME_COOKIE, isThemeId, resolveTheme } from "../../shared/utils/themes";

declare module "h3" {
  interface H3EventContext {
    theme?: import("../../shared/utils/themes").ThemeId;
  }
}

const ONE_YEAR = 60 * 60 * 24 * 365;

// Decides the theme for this request (spec §5.8.1). A ?tema= choice is
// remembered in a cookie and the address is cleaned with a redirect, so pages
// are always rendered on the server in the right theme.
export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/api/") || event.path.startsWith("/_nuxt/")) return;

  const config = useRuntimeConfig(event);
  const allowQuery = Boolean(config.public.themeSwitch);
  const url = getRequestURL(event);
  const queryTheme = url.searchParams.get("tema");

  if (allowQuery && queryTheme !== null) {
    url.searchParams.delete("tema");
    if (isThemeId(queryTheme)) {
      setCookie(event, THEME_COOKIE, queryTheme, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    }
    return sendRedirect(event, `${url.pathname}${url.search}${url.hash}`, 303);
  }

  let siteDefault: string | undefined = config.defaultTheme;
  try {
    const settings = await getSettings(() => useDb().siteSetting.findMany());
    siteDefault = settings.theme ?? siteDefault;
  } catch {
    // The site still renders in the configured default if the database is down.
  }

  event.context.theme = resolveTheme({
    cookie: getCookie(event, THEME_COOKIE),
    siteDefault,
    allowQuery,
  });
});
