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

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    toast({
      variant: 'default',
      duration: 3000,
      title: 'Login in progress......',
      className: 'bg-green-500 text-white',
    });
  }

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

          <Button type="submit" className="w-full ">
            Login
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}
