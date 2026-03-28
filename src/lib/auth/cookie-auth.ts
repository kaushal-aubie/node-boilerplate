import type { Context } from 'hono';
import { getSignedCookie, setSignedCookie } from 'hono/cookie';
import { envVars } from '@/config/env';

const COOKIE_NAME = 'token';

export async function getTokenFromRequest(c: Context): Promise<string | undefined> {
  const auth = c.req.header('Authorization');
  if (auth?.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  const raw = await getSignedCookie(c, envVars.COOKIE_SECRET, COOKIE_NAME);
  if (raw === false || raw === undefined) {
    return undefined;
  }
  const s = String(raw);
  return s.length > 0 ? s : undefined;
}

export async function setAuthCookie(c: Context, token: string): Promise<void> {
  const minutes = Number.parseInt(envVars.COOKIE_EXP, 10) || 15;
  const maxAgeSeconds = minutes * 60;
  await setSignedCookie(c, COOKIE_NAME, token, envVars.COOKIE_SECRET, {
    path: '/',
    httpOnly: true,
    maxAge: maxAgeSeconds,
    sameSite: 'Lax',
  });
  c.header('Authorization', `Bearer ${token}`);
}

export async function clearAuthCookie(c: Context): Promise<void> {
  await setSignedCookie(c, COOKIE_NAME, '', envVars.COOKIE_SECRET, {
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });
  c.header('Authorization', '');
}
