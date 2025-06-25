'use client';

import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Logo } from '@/components/ui/logo';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  if (loading || user) {
    return null; // The AuthProvider will handle redirects
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Logo className="w-64 h-auto" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline pt-4 text-center">
            Welcome
          </h1>
          <p className="text-center text-muted-foreground">
            Your personal assistant for managing credit card bills and maximizing rewards.
            <br />
            Log in to take control of your finances.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
           <Button onClick={handleGoogleLogin} size="lg" className="w-full">
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.5 69.5c-24.3-23.6-57.6-38.4-93.4-38.4-69.1 0-125.5 56.4-125.5 125.5s56.4 125.5 125.5 125.5c80.8 0 110.3-62.5 113.5-92.4H248v-83.8h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
              Login with Google
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
