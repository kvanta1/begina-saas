'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '../ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="w-full bg-white py-4 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/">
            <Image src="/begina-logo.png" alt="Begina Logo" width={100} height={40} />
          </Link>
          <div>
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="mr-2 w-24">Dashboard</Button>
                </Link>
                <SignOutButton>
                  <Button className="w-24">Log out</Button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="mr-2 w-24">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#06AF8F] hover:bg-[#058c72] w-24 text-white">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default MainLayout;