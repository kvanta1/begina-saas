'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Timeline from '@/components/Timeline';

export default function GeneratePage() {
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login'); // Redirect to login page if not signed in
    } else if (isSignedIn && prompt) {
      generateContent(prompt);
    }
  }, [isLoaded, isSignedIn, prompt, router]);

  const generateContent = async (promptText: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data.result);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent(`Failed to generate content. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to use this feature.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-t-4 border-[#06AF8F] border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Generating content...</p>
        </div>
      ) : (
        <>
          <Timeline generatedContent={generatedContent} title={prompt || ''} />
          <Button onClick={() => router.push('/')} className="mt-4 bg-[#06AF8F] hover:bg-[#058c72] text-white">
            Back to Home
          </Button>
        </>
      )}
    </div>
  );
}