import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'tracker_session';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 Tage in Millisekunden

export async function verifyPin(pin: string): Promise<boolean> {
  const trackerPin = process.env.TRACKER_PIN;

  if (!trackerPin) {
    console.error('TRACKER_PIN environment variable not set');
    return false;
  }

  return pin === trackerPin;
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isSessionValid(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session !== undefined;
}
