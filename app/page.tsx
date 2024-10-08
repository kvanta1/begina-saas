'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AuthButtons } from '@/components/auth/AuthButtons';

const shortcuts = [
  { 
    name: 'Shopify', 
    descriptions: ['Clothing store', 'Supplement store'], 
    icon: '/shopify-icon.png',
    prompt: 'Shopify store'
  },
  { 
    name: 'YouTube', 
    descriptions: ['Faceless channel', 'Thumbnail'], 
    icon: '/youtube-icon.png',
    prompt: 'YouTube channel'
  },
  { 
    name: 'Udemy', 
    descriptions: ['Online course'],
    icon: '/udemy-icon.png',
    prompt: 'Udemy course'
  },
  { 
    name: 'SaaS',
    descriptions: ['Mirco-service SaaS'], 
    icon: '/custom-icon.png',
    prompt: ''
  },
];

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const handleSearch = (prompt: string) => {
    if (prompt.trim()) {
      router.push(`/generate?prompt=${encodeURIComponent(prompt.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Let's us help begin something</h2>
          
          <div className="mb-8">
            <div className="flex">
              <Input 
                placeholder="What do you need help with?" 
                className="flex-grow rounded-r-none text-gray-800 placeholder-gray-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchInput)}
              />
              <Button 
                onClick={() => handleSearch(searchInput)}
                className="rounded-l-none bg-[#06AF8F] hover:bg-[#058c72] text-white"
              >
                Search
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.name}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center cursor-pointer"
                onClick={() => handleSearch(`${shortcut.prompt} ${shortcut.descriptions[0]}`)}
              >
                <img src={shortcut.icon} alt={shortcut.name} className="w-16 h-16 mb-2" />
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{shortcut.name}</h3>
                {shortcut.descriptions.map((desc, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {desc}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Begina - Empowering Aspiring Entrepreneurs</h2>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:mr-6">
                <Image
                  src="/entrepreneur-image.jpg"
                  alt="Entrepreneurs working together"
                  width={500}
                  height={300}
                  className="rounded-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-4">Begina: Your Entrepreneurial Launchpad</h3>
                <p className="text-gray-600">
                  Begina is a comprehensive platform dedicated to educating and supporting
                  aspiring entrepreneurs. We provide the essential resources, guidance, and
                  tools to help individuals overcome common challenges and transform their
                  business dreams into reality. Our mission is to ensure your entrepreneurial
                  journey progresses smoothly, from overcoming procrastination to securing
                  funding and managing competing priorities.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-700">Contact Us</h2>
            <p className="mb-2">Are you ready to get started?</p>
            <p className="text-gray-600 mb-4">
              If you have questions about the opportunities available in our programs, feel free to send us a message. We
              will get back to you as soon as possible.
            </p>
            <p className="font-semibold">Begina</p>
          </div>
        </div>
      </main>
    </div>
  );
}