import { AuthTabs } from '@/components/auths/tabs';

async function AuthPage() {
  return (
    <main className="flex items-center justify-center">
      <AuthTabs />
    </main>
  );
}

export default AuthPage;
