'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const router = useRouter();
  // Placeholder for user data. In a real app, you'd fetch this from your backend or state management system.
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    // Add more user properties as needed
  };

  const handleLogout = () => {
    // Implement logout logic here
    // For example: clear local storage, reset state, etc.
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Welcome, {user.name}</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            {/* Add more user details here */}
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {/* Add recent activity or projects here */}
            <p>No recent activity</p>
          </div>
          
          <Button className="bg-[#06AF8F] hover:bg-[#058c72] text-white">
            Start New Project
          </Button>
        </div>
      </main>
    </div>
  );
}