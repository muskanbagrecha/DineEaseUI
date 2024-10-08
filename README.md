Step 1:
Create a file with the folder parallel to app folder+file
`actions/cookies.tsx`
~paste this code~
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


Lets create a app wide context to get user info in the client component and check if they are authorize or not.
Install a package `jsonwebtoken`

Create a folder+file `context/authContext.tsx`
~paste this code~

'use client';


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import jwt from 'jsonwebtoken';


import { getSession } from '@/actions/cookies';


interface AuthContextType {
  isAuthorized: boolean;
  loading: boolean;
  recheckSession: () => Promise<void>;
  user: { email: string; userID?: string } | null;
}


const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const checkSession = async () => {
    setLoading(true);
    setIsAuthorized(false);
    try {
      const session = await getSession('accessToken');
      setIsAuthorized(!!session);
      if (session) {
        const decodedToken = jwt.decode(session) as jwt.JwtPayload;
        setUser({ email: decodedToken.email, userID: decodedToken.sub });
      }
      if (!session) {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to check session', error);
      setIsAuthorized(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    checkSession();
  }, []);


  return (
    <AuthContext.Provider
      value={{ isAuthorized, loading, recheckSession: checkSession, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



Create a new folder+file parallel to app.
`providers/providers.tsx`
'use client';


import { AuthProvider } from '@/context/authContext';


export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}



Open the `app/layout.tsx`
Replace it with the existing one
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/providers/providers';


const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth flex flex-col min-h-screen`}
        >
          {/* Navigation here */}
          <div className="flex max-w-screen-xl mx-auto [&_main]:flex-grow flex-grow w-full">
            {children}
          </div>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}



Create a folder+file in actions.
`formHandler/login.ts`
'use server';


import jwt from 'jsonwebtoken';
import axios from 'axios';


import { addCookie } from '../cookies';


interface LoginProps {
  email: string;
  password: string;
}


export async function loginFormHandler(prop: LoginProps): Promise<void> {
  const { email, password } = prop;
  //!TODO GET THE TOKEN FROM THE BACKEND and store it in cookies
  const response = await axios.post('', {
    email,
    password,
  });
  if (response.data?.accessToken) {
    const decodedToken = jwt.decode(
      response.data.accessToken
    ) as jwt.JwtPayload;
    const TOKEN = response.data.accessToken;
    const expiryDate = new Date(decodedToken.exp * 1000);
    await addCookie('accessToken', TOKEN, {
      sameSite: 'strict',
      httpOnly: true,
      expires: expiryDate,
    });
  }
}



Create a file inside the `actions/formHandler`

'use server';


import jwt from 'jsonwebtoken';
import axios from 'axios';


import { addCookie } from '../cookies';


interface SignupProps {
  email: string;
  password: string;
}


export async function signupFormHandler(prop: SignupProps): Promise<void> {
  const { email, password } = prop;
  //!TODO: SIGNUP logic with backend
  const response = await axios.post('', {
    email,
    password,
  });
  if (response.data?.accessToken) {
    const decodedToken = jwt.decode(
      response.data.accessToken
    ) as jwt.JwtPayload;
    const TOKEN = response.data.accessToken;
    const expiryDate = new Date(decodedToken.exp * 1000);
    await addCookie('accessToken', TOKEN, {
      sameSite: 'strict',
      httpOnly: true,
      expires: expiryDate,
    });
  }
}



Open `components/auths/login.tsx` replace it witht this
'use client';


import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { TabsContent } from '../ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { loginFormHandler } from '@/actions/formHandler/login';


const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});


export function LoginTab() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });


  function triggerToast(
    message: string,
    variant: 'error' | 'success' | 'default'
  ) {
    let className = '';
    if (variant === 'error') {
      className = 'bg-red-500 text-white';
    } else if (variant === 'success') {
      className = 'bg-green-500 text-white';
    }
    toast({
      variant: 'default',
      duration: 1000,
      title: message,
      className: className,
    });
  }


  async function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    //!TODO WIRE UP THE LOGIN ACTION
    triggerToast('Login in Progress', 'default');
    await loginFormHandler({ ...values });
    triggerToast('Login Successful', 'success');
  }
  const { isSubmitting } = form.formState;
  return (
    <TabsContent value="login" className="px-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    aria-label="Email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Password</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      aria-label="Password"
                      className="flex-[6]"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="link"
                    className="flex-1"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Login'}
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}



Open component/auths/signup.tsx and replace it with this.
'use client';


import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { TabsContent } from '../ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { signupFormHandler } from '@/actions/formHandler/signup';


const signupSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(7, { message: 'Password must be at least 7 characters long' }),
    confirmPassword: z
      .string()
      .min(7, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });


export function SignupTab() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });


  function triggerToast(
    message: string,
    variant: 'error' | 'success' | 'default'
  ) {
    let className = '';
    if (variant === 'error') {
      className = 'bg-red-500 text-white';
    } else if (variant === 'success') {
      className = 'bg-green-500 text-white';
    }
    toast({
      variant: 'default',
      duration: 1000,
      title: message,
      className: className,
    });
  }


  async function onSubmit(values: z.infer<typeof signupSchema>) {
    console.log(values);
    //!TODO WIRE UP THE SIGNUP ACTION
    triggerToast('Signup in Progress', 'default');
    await signupFormHandler({ ...values });
    triggerToast('Signup Successful', 'success');
  }


  const { isSubmitting } = form.formState;
  return (
    <TabsContent value="signup" className="px-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    aria-label="Email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Password</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      aria-label="Password"
                      className="flex-[6]"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="link"
                    className="flex-1"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    aria-label="Confirm Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}




