'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function AuthButtons() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return null; // Don't show buttons if user is already signed in
  }

  return (
    <>
      <Button variant="outline" className="mr-2 w-24" onClick={() => window.location.href = '/login'}>
        Log in
      </Button>
      <Button className="bg-[#06AF8F] hover:bg-[#058c72] w-24 text-white" onClick={() => window.location.href = '/signup'}>
        Sign up
      </Button>
    </>
  );
}