'use server';

import { cookies } from 'next/headers';

export async function getSession(key: string): Promise<string | null> {
  const session = cookies().get(key)?.value || null;
  return session;
}

export async function addCookie(
  key: string,
  value: string,
  options: {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): Promise<void> {
  try {
    cookies().set({
      name: key,
      value,
      httpOnly: true,
      ...options,
    });
  } catch (error) {
    console.error('Failed to set cookie', error);
  }
}

export async function removeCookie(key: string): Promise<void> {
  try {
    cookies().set(key, '', {
      httpOnly: true,
      expires: new Date(0),
    });
  } catch (error) {
    console.error('Failed to remove cookie', error);
  }
}
