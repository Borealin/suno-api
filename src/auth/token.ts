import { getClerkTokenPath, ClerkToken } from './net.js';
import { fetchCookie } from './cookies.js';
import { getSession } from './session.js';

export type Token = {
  value: string;
  expires: number; // only valid for 1 minute
};
const TIMEOUT = 60000;
const REFRESH_INTERVAL = TIMEOUT - 10000;
let token: Token | null = null;
let taskId: NodeJS.Timeout | null = null;

const fetchToken = async (): Promise<Token | null> => {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error('Session not found');
    }
    const response = await fetchCookie(getClerkTokenPath(session.id), {
      method: 'POST',
    });
    const data = (await response.json()) as ClerkToken;
    if (!data) {
      throw new Error('Invalid response');
    }
    token = {
      value: data.jwt,
      expires: Date.now() + TIMEOUT,
    };
    return token;
  } catch (error) {
    console.error('Error updating token:', error);
    return null;
  }
};
const refreshToken = async (): Promise<Token | null> => {
  if (taskId) {
    clearTimeout(taskId);
  }
  const token = await fetchToken();
  taskId = setTimeout(() => {
    refreshToken();
  }, REFRESH_INTERVAL);
  return token;
};
export const getToken = async (): Promise<Token | null> => {
  if (token && token.expires > Date.now()) {
    return token;
  }
  return await refreshToken();
};

export const setToken = async (newToken: Token | null): Promise<void> => {
  if (newToken && newToken.expires > Date.now()) {
    token = newToken;
    return;
  }
  getToken();
};
