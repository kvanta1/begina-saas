import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuth } from '@clerk/nextjs/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const fullPrompt = `
You are a business analyst and project manager tasked with developing a project plan based on the following business idea: "${prompt}"

Please provide the following information in a structured JSON format:

1. Business Requirements and Tasks:
   - Generate a list of main tasks, each with its own subtasks.
   - Each task and subtask should have a unique ID, title, and description.
   - Tasks should be organized in a logical sequence or phases.

2. Expected Deliverables and Quality Assurance:
   - For each main task, provide expected deliverables and quality assurance criteria.

3. Prerequisites and User Inputs:
   - For each main task, list any prerequisites, additional information needed, or required resources.

Please structure the response as follows:

{
  "tasks": [
    {
      "id": "task1",
      "title": "Main Task 1",
      "description": "Description of Main Task 1",
      "subtasks": [
        {
          "id": "task1-1",
          "title": "Subtask 1.1",
          "description": "Description of Subtask 1.1"
        },
        ...
      ],
      "deliverables": ["Deliverable 1", "Deliverable 2", ...],
      "qualityAssurance": ["QA Criteria 1", "QA Criteria 2", ...],
      "prerequisites": ["Prerequisite 1", "Prerequisite 2", ...]
    },
    ...
  ]
}

Ensure that the JSON is valid and can be parsed easily.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: fullPrompt }],
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Parse the JSON response
    const parsedContent = JSON.parse(generatedContent);

    return NextResponse.json({ result: parsedContent });
  } catch (error) {
    console.error('API error:', error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({ error: 'OpenAI API error', details: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: 'Failed to generate content', details: error.message }, { status: 500 });
  }
}