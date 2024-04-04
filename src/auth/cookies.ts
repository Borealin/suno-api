import {
  // CookieParam,
  Page,
  launch,
} from 'puppeteer';
import { CookieJar, Cookie } from 'tough-cookie';
import makeFetchCookie from 'fetch-cookie';
import { CLERK_HOST } from './net.js';
import { getEnvironment } from './environment.js';

const jar = new CookieJar();
const KEY_COOKIE_NAME = '__client';

const rawFetchCookie = makeFetchCookie(fetch, jar);
export const fetchCookie = async (
  url: string | URL | Request,
  init?: RequestInit,
): Promise<Response> => {
  await getCookie();
  return rawFetchCookie(url, init);
};

// export const injectCurrentCookieParams = async (page: Page): Promise<void> => {
//   const cookies = (await jar.getCookies(CLERK_HOST)).map(
//     (cookie) =>
//       ({
//         name: cookie.key,
//         value: cookie.value,
//         domain: `.${cookie.domain}`,
//         path: cookie.path,
//         expires: cookie.expires === 'Infinity' ? -1 : cookie.expires.getTime(),
//         httpOnly: cookie.httpOnly,
//         secure: cookie.secure,
//         sourceScheme: 'Secure',
//         priority: 'Medium',
//         sameSite: 'Lax',
//         sameParty: false,
//       }) as CookieParam,
//   );
//   await page.setCookie(...cookies);
// };

// export const fetchCurrentCookieParams = async (page: Page): Promise<void> => {
//   const cookies = await jar.getCookies(CLERK_HOST);
//   const params = await page.cookies(CLERK_HOST);
//   await Promise.all(
//     params.map(async (param) => {
//       const existedCookie = cookies.find((cookie) => {
//         return cookie.key === param.name;
//       });
//       if (existedCookie) {
//         existedCookie.value = param.value;
//         return;
//       }
//       await jar.setCookie(
//         new Cookie({
//           key: param.name,
//           value: param.value,
//           domain: param.domain?.replace(/^\./, ''),
//           path: param.path,
//           expires: param.expires === -1 ? 'Infinity' : new Date(param.expires),
//           httpOnly: param.httpOnly,
//           secure: param.secure,
//         }),
//         CLERK_HOST,
//       );
//     }),
//   );
// };

const waitNavigationUntil = async (
  page: Page,
  match: (url: string) => boolean,
): Promise<void> => {
  let url = page.url();
  while (!match(url)) {
    await page.waitForNavigation({
      timeout: 0,
    });
    url = page.url();
  }
};

const getTargetCookie = (cookies: Cookie[]): Cookie | null => {
  const cookie = cookies.find((cookie) => cookie.key === KEY_COOKIE_NAME);
  return cookie ?? null;
};

export const getCookie = async (): Promise<Cookie | null> => {
  const cookies = await jar.getCookies(CLERK_HOST);
  const cookie = getTargetCookie(cookies);
  if (
    cookie &&
    (cookie.expires === 'Infinity' || cookie.expires.getTime() > Date.now())
  ) {
    return cookie;
  }
  try {
    const environment = await getEnvironment();
    if (!environment) {
      throw new Error('Environment not found');
    }
    const homeUrl = new URL(environment.display_config.home_url);
    const browser = await launch({
      headless: false,
      waitForInitialPage: true,
      timeout: 0,
      defaultViewport: null,
    });
    const page = (await browser.pages())[0] ?? (await browser.newPage());
    await page.goto(environment.display_config.sign_in_url);
    await waitNavigationUntil(
      page,
      (url) => new URL(url).hostname === homeUrl.hostname,
    );
    const params = await page.cookies(CLERK_HOST);
    const cookies = params.map(
      (param) =>
        new Cookie({
          key: param.name,
          value: param.value,
          domain: param.domain?.replace(/^\./, ''),
          path: param.path,
          expires:
            param.expires === -1 ? 'Infinity' : new Date(param.expires * 1000),
          httpOnly: param.httpOnly,
          secure: param.secure,
        }),
    );
    await Promise.all(
      cookies.map(async (cookie) => {
        await jar.setCookie(cookie, CLERK_HOST);
      }),
    );
    await browser.close();
    return getTargetCookie(cookies);
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

export const setCookie = async (newCookie: Cookie | null): Promise<void> => {
  if (
    newCookie &&
    (newCookie.expires === 'Infinity' ||
      newCookie.expires.getTime() > Date.now())
  ) {
    await jar.setCookie(newCookie, CLERK_HOST);
    return;
  }
  getCookie();
};
