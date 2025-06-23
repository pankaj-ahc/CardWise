'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-primary p-4 text-primary-foreground">
            <CreditCard className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">
            Welcome to CardWise
          </h1>
          <p className="text-center text-muted-foreground">
            Your personal assistant for managing credit card bills and maximizing rewards.
            <br />
            Log in to take control of your finances.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
           <Button asChild size="lg" className="w-full">
            <Link href="/dashboard">
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.5 69.5c-24.3-23.6-57.6-38.4-93.4-38.4-69.1 0-125.5 56.4-125.5 125.5s56.4 125.5 125.5 125.5c80.8 0 110.3-62.5 113.5-92.4H248v-83.8h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
              Login with Google
            </Link>
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
