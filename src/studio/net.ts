import { sunoHeaders } from '../auth/index.js';
export const STUDIO_HOST = 'https://studio-api.suno.ai';

export const STUDIO_BASE_PATH = `${STUDIO_HOST}/api`;

export const STUDIO_SESSION = `${STUDIO_BASE_PATH}/session`;

export const studioFetch = async (
  url: string | URL | Request,
  init?: RequestInit & {
    auth?: boolean;
  },
): Promise<Response> => {
  return fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      ...(init.auth && (await sunoHeaders())),
    },
  });
};
