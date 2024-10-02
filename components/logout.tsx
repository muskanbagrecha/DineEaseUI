'use client';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { removeCookie } from '@/actions/cookies';
import { useRouter } from 'next/navigation';

interface LogoutProps {
  redirectUrl?: string;
}
export function Logout(props: LogoutProps) {
  const router = useRouter();
  const { redirectUrl } = props;
  const { user, loading, recheckSession } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Link href="/auth">Login</Link>;
  const handleLogout = async () => {
    try {
      await removeCookie('token');
      await recheckSession();
      router.push(`/${redirectUrl || ''}`);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out">
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to log in again to
            access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
