'use client';

import { useAuth } from '@/context/authContext';
import Link from 'next/link';

export default function ProfileLayout({
  customer,
  manager,
}: {
  customer: React.ReactNode;
  manager: React.ReactNode;
}) {
  const { user, loading, isAuthorized } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (isAuthorized && user?.roles === 'CUSTOMER') {
    return <>{customer}</>;
  }
  if (isAuthorized && user?.roles === 'RESTAURANT_MANAGER') {
    return <>{manager}</>;
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <h1>You are not authorized to view this page</h1>
      <p>Please log in </p>
      <Link href="/auth" className="text-blue-500">
        Login
      </Link>
    </main>
  );
}
