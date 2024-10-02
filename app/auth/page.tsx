import { AuthTabs } from '@/components/auth/tabs';
import { Skeleton } from '@/components/ui/skeleton';

function AuthPage() {
  return (
    <main className="flex items-center justify-center">
      <AuthTabs />
    </main>
  );
}

export default AuthPage;
