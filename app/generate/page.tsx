'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Task[];
  deliverables: string[];
  qualityAssurance: string[];
  prerequisites: string[];
  completed?: boolean;
}

export default function GeneratePage() {
  const [generatedContent, setGeneratedContent] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
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

      setGeneratedContent(data.result.tasks);
      updateProgress(data.result.tasks);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = (tasks: Task[]) => {
    const totalTasks = countTasks(tasks);
    const completedTasks = countCompletedTasks(tasks);
    setProgress((completedTasks / totalTasks) * 100);
  };

  const countTasks = (tasks: Task[]): number => {
    return tasks.reduce((count, task) => {
      return count + 1 + (task.subtasks ? countTasks(task.subtasks) : 0);
    }, 0);
  };

  const countCompletedTasks = (tasks: Task[]): number => {
    return tasks.reduce((count, task) => {
      const subtaskCount = task.subtasks ? countCompletedTasks(task.subtasks) : 0;
      return count + (task.completed ? 1 : 0) + subtaskCount;
    }, 0);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = toggleTaskCompletionRecursive(generatedContent, taskId);
    setGeneratedContent(updatedTasks);
    updateProgress(updatedTasks);
  };

  const toggleTaskCompletionRecursive = (tasks: Task[], taskId: string): Task[] => {
    return tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      if (task.subtasks) {
        return { ...task, subtasks: toggleTaskCompletionRecursive(task.subtasks, taskId) };
      }
      return task;
    });
  };

  const renderTask = (task: Task) => (
    <AccordionItem value={task.id} key={task.id}>
      <AccordionTrigger>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <span>{task.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <p className="mb-2">{task.description}</p>
        {task.subtasks && task.subtasks.length > 0 && (
          <Accordion type="single" collapsible className="ml-4">
            {task.subtasks.map(renderTask)}
          </Accordion>
        )}
        {task.deliverables && (
          <div className="mt-2">
            <h4 className="font-semibold">Deliverables:</h4>
            <ul className="list-disc list-inside">
              {task.deliverables.map((deliverable, index) => (
                <li key={index}>{deliverable}</li>
              ))}
            </ul>
          </div>
        )}
        {task.qualityAssurance && (
          <div className="mt-2">
            <h4 className="font-semibold">Quality Assurance:</h4>
            <ul className="list-disc list-inside">
              {task.qualityAssurance.map((qa, index) => (
                <li key={index}>{qa}</li>
              ))}
            </ul>
          </div>
        )}
        {task.prerequisites && (
          <div className="mt-2">
            <h4 className="font-semibold">Prerequisites:</h4>
            <ul className="list-disc list-inside">
              {task.prerequisites.map((prereq, index) => (
                <li key={index}>{prereq}</li>
              ))}
            </ul>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );

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
          <h1 className="text-2xl font-bold mb-4">{prompt}</h1>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Project Progress</h2>
            <Progress value={progress} className="w-full" />
          </div>
          <Accordion type="single" collapsible className="w-full">
            {generatedContent.map(renderTask)}
          </Accordion>
          <Button onClick={() => router.push('/')} className="mt-4 bg-[#06AF8F] hover:bg-[#058c72] text-white">
            Back to Home
          </Button>
        </>
      )}
    </div>
  );
}