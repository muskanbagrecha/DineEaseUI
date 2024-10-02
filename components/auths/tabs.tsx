import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { LoginTab } from './login';
import { SignupTab } from './signup';

export async function AuthTabs() {
  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold">
          Authentication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login" className="w-full">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="w-full">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <LoginTab />
          <SignupTab />
        </Tabs>
      </CardContent>
    </Card>
  );
}
