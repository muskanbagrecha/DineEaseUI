'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logout } from './logout';

export function ProfileButton() {
  const pathname = usePathname();

  if (pathname === '/profile') {
    return <Logout />;
  }
  return <Link href="/profile">Profile</Link>;
}
