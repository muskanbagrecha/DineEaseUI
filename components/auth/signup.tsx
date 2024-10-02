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

  function onSubmit(values: z.infer<typeof signupSchema>) {
    console.log(values);
    toast({
      variant: 'default',
      duration: 3000,
      title: 'Login in progress......',
      className: 'bg-green-500 text-white',
    });
  }

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

          <Button type="submit" className="w-full ">
            Sign Up
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}
