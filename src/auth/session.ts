import { CLERK_CLIENT_PATH } from './net.js';
import { fetchCookie } from './cookies.js';
import { ClerkClient, ClerkRequestResponse } from './net.js';
export type Session = {
  id: string;
  expires: number;
};
let session: Session | null = null;

export const getSession = async (): Promise<Session | null> => {
  if (session && session.expires > Date.now()) {
    return session;
  }
  try {
    const response = await fetchCookie(CLERK_CLIENT_PATH, {
      method: 'GET',
    });
    const data = (await response.json()) as ClerkRequestResponse<ClerkClient>;
    if (!('response' in data) || !data.response) {
      throw new Error('Invalid response');
    }
    const clerkSession = data.response.sessions.find(
      (session) => session.id === data.response.last_active_session_id,
    );
    if (!clerkSession) {
      throw new Error('Session not found');
    }
    session = {
      id: clerkSession.id,
      expires: clerkSession.expire_at,
    };
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const setSession = async (newSession: Session | null): Promise<void> => {
  if (newSession && newSession.expires > Date.now()) {
    session = newSession;
    return;
  }
  getSession();
}
