'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn, useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      signOut();
    }
  }, [isLoaded, signOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      console.log('Clerk is not loaded yet');
      return;
    }

    try {
      console.log('Attempting to sign in with:', email);
      const result = await signIn.create({
        identifier: email,
        password,
      });

      console.log('Sign in result:', JSON.stringify(result, null, 2));

      if (result.status === 'complete') {
        console.log('Sign in successful, setting active session');
        await setActive({ session: result.createdSessionId });
        console.log('Redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('Unexpected result status:', result.status);
        setErrorMessage(`Sign in not completed. Status: ${result.status}`);
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map(err => `${err.message || 'Unknown error'} (${err.code || 'No code'})`).join(', ');
        setErrorMessage(errorMessages);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred during sign in.');
      }
      console.log('Full error object:', JSON.stringify(error, null, 2));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setErrorMessage('');

    try {
      if (resetStep === 0) {
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: resetEmail,
        });
        setResetStep(1);
        setSuccessMessage('Verification code sent to your email.');
      } else if (resetStep === 1) {
        const result = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: resetCode,
          password: newPassword,
        });
        if (result.status === 'complete') {
          setSuccessMessage('Password reset successfully. You can now log in with your new password.');
          setIsResetting(false);
          setResetStep(0);
          setResetEmail('');
          setResetCode('');
          setNewPassword('');
        }
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      setErrorMessage(error.message || 'An error occurred during password reset.');
    }
  };

  const startPasswordReset = () => {
    setIsResetting(true);
    setResetStep(0);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const backToLogin = () => {
    setIsResetting(false);
    setResetStep(0);
    setErrorMessage('');
    setSuccessMessage('');
    setResetEmail('');
    setResetCode('');
    setNewPassword('');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isResetting ? 'Reset Your Password' : 'Sign in to your account'}
          </h2>
        </div>
        {!isResetting ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </Button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            {resetStep === 0 ? (
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="reset-email"
                  name="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="reset-code" className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <Input
                    id="reset-code"
                    name="reset-code"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-500 text-sm mt-2">{successMessage}</div>
            )}

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {resetStep === 0 ? 'Send Reset Code' : 'Reset Password'}
              </Button>
            </div>
          </form>
        )}
        <div className="text-center space-y-2">
          {!isResetting && (
            <button
              onClick={startPasswordReset}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </button>
          )}
          {isResetting && (
            <button
              onClick={backToLogin}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </button>
          )}
          <div>
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}