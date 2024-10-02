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
import { signupFormHandler } from '@/actions/formHandler/signup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAuth } from '@/context/authContext';

const signupSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(7, { message: 'Password must be at least 7 characters long' }),
    confirmPassword: z
      .string()
      .min(7, { message: 'Please confirm your password' }),
    role: z.enum(['RESTAURANT_MANAGER', 'CUSTOMER'] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function SignupTab() {
  const { recheckSession } = useAuth();
  const router = useRouter();
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
    triggerToast('Signup in Progress', 'default');
    const res = await signupFormHandler(values);
    if (res.success) {
      triggerToast('Signup Successful', 'success');
      recheckSession()
      router.push('/');
      form.reset();
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
                      disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
            name="role"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>User Type</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(e);
                    form.clearErrors('root');
                  }}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="RESTAURANT_MANAGER">
                      Restaurant Manager
                    </SelectItem>
                  </SelectContent>
                </Select>
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
            {isSubmitting ? 'Loading...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}
