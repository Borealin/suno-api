import { Cookie } from 'tough-cookie';
import { getCookie, setCookie } from './cookies.js';
import { Session, getSession, setSession } from './session.js';
import { Token, getToken, setToken } from './token.js';
import { writeFile, readFile } from 'fs/promises';

type Credential = {
  cookie: string | null;
  session: Session | null;
  token: Token | null;
};

const COOKIE_PATH = 'credential.json';

export const saveCredential = async (): Promise<void> => {
  try {
    const [cookie, session, token] = await Promise.all([
      getCookie(),
      getSession(),
      getToken(),
    ]);
    const credential = {
      cookie: cookie.toString(),
      session,
      token,
    };
    await writeFile(COOKIE_PATH, JSON.stringify(credential), 'utf-8');
  } catch (error) {
    console.error('Error saving cookies:', error);
  }
};

export const loadCredential = async (): Promise<void> => {
  try {
    const credential = JSON.parse(
      await readFile(COOKIE_PATH, 'utf-8'),
    ) as Credential;
    const cookie = Cookie.parse(credential.cookie);
    await setCookie(cookie);
    await setSession(credential.session);
    await setToken(credential.token);
  } catch (error) {
    console.error('Error loading cookies:', error);
  }
};

export const sunoHeaders = async (): Promise<Record<string, string> | null> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Token not found');
    }
    return {
      Authorization: `Bearer ${token.value}`,
    };
  } catch (error) {
    console.error('Error getting headers:', error);
    return null;
  }
};
