'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const isPasswordValid = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
  console.log('Password validation:', { 
    minLength: password.length >= minLength, 
    hasUpperCase, 
    hasLowerCase, 
    hasNumbers, 
    hasNonalphas, 
    isValid 
  });
  return isValid;
};

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  useEffect(() => {
    console.log('SignupPage component mounted');
    console.log('Clerk isLoaded:', isLoaded);
  }, [isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      console.log('Clerk is not loaded yet');
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      setErrorMessage('All fields are required');
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorMessage('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.');
      return;
    }

    console.log('Signup data:', { firstName, lastName, email, password: '(hidden)' });

    try {
      console.log('Attempting to create user with:', { firstName, lastName, email });
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      console.log('Signup result:', JSON.stringify(result, null, 2));

      if (result.status === 'complete') {
        console.log('Signup successful, updating user metadata');
        await result.createdUser.update({
          firstName,
          lastName,
        });
        console.log('User metadata updated');
        console.log('Setting active session');
        await setActive({ session: result.createdSessionId });
        console.log('Redirecting to dashboard');
        router.push('/dashboard');
      } else if (result.status === 'missing_requirements') {
        console.log('Missing requirements:', result.missingFields);
        if (result.missingFields.length > 0) {
          setErrorMessage(`Please complete the following fields: ${result.missingFields.join(', ')}`);
        } else if (result.unverifiedFields && result.unverifiedFields.length > 0) {
          setErrorMessage(`Please verify the following: ${result.unverifiedFields.join(', ')}`);
          // Here you might want to trigger the verification process
          // For example, for email verification:
          if (result.unverifiedFields.includes('email_address')) {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            // Redirect to the verification page
            router.push('/verify-email');
          }
        } else {
          setErrorMessage('Unable to complete signup. Please try again.');
        }
      } else {
        console.log('Unexpected result status:', result.status);
        setErrorMessage(`Signup not completed. Status: ${result.status}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map(err => `${err.longMessage || err.message || 'Unknown error'} (${err.code || 'No code'})`).join(', ');
        setErrorMessage(errorMessages);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred during signup.');
      }
      // Log the entire error object
      console.log('Full error object:', JSON.stringify(error, null, 2));
    }
  };

  console.log('Rendering SignupPage, errorMessage:', errorMessage);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
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
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              Sign up
            </Button>
          </div>
        </form>
        <div className="text-center">
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}