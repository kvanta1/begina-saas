import React, { useState, useEffect } from 'react';

interface TimelineStepProps {
  step: string;
  index: number;
  currentStep: number;
  totalSteps: number;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ step, index, currentStep, totalSteps }) => {
  const status = index === currentStep ? 'in production' : 
                 index < currentStep ? 'completed' : 
                 'pending';

  return (
    <div className="mb-6">
      <div className="border rounded-lg p-4 shadow-sm">
        <p className="text-gray-800">{step}</p>
      </div>
      <div className="mt-2 relative">
        <div className="flex items-center">
          <div className={`h-2 flex-grow ${index <= currentStep ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className={`w-4 h-4 rounded-full ${index <= currentStep ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className={`h-2 flex-grow ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        </div>
        {index === currentStep && (
          <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

interface TimelineProps {
  generatedContent: string;
  title: string;
}

const Timeline: React.FC<TimelineProps> = ({ generatedContent, title }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    // Parse the generatedContent into steps
    const parsedSteps = generatedContent.split('\n').filter(step => step.trim() !== '');
    setSteps(parsedSteps);
  }, [generatedContent]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Generated Content for: {title}</h1>
      {steps.map((step, index) => (
        <TimelineStep 
          key={index}
          step={step}
          index={index}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      ))}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Next Step
        </button>
        <button
          onClick={() => setCurrentStep(0)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timeline;