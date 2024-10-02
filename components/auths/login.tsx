'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

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
import { useAuth } from '@/context/authContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export function LoginTab() {
  const router = useRouter();
  const { recheckSession } = useAuth();
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
    triggerToast('Login in Progress', 'default');
    const res = await loginFormHandler(values);
    console.log(res);
    if (res.success) {
      triggerToast('Login Successful', 'success');
      router.push('/');
      await recheckSession();
    } else {
      triggerToast(res.error, 'error');
      form.setError('root', {
        type: 'manual',
        message: res.error,
      });
    }
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
                    onChange={(e) => {
                      field.onChange(e);
                      form.clearErrors('root');
                    }}
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
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors('root');
                      }}
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
          {form.formState.errors.root && (
            <div className="text-red-500 mb-4">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Login'}
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}
