'use client';

import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VerifyEmailPage() {
  const [code, setCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== 'complete') {
        console.log(JSON.stringify(completeSignUp, null, 2));
        setVerificationError('Unable to verify email address. Please try again.');
      } else {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error verifying email', err);
      setVerificationError('Error verifying email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <Input
              id="verification-code"
              name="code"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
            />
          </div>

          {verificationError && (
            <div className="text-red-500 text-sm mt-2">{verificationError}</div>
          )}

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify Email
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}