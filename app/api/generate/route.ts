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

    const fullPrompt = `Can you give me all the requirements to create ${prompt}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: fullPrompt }],
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    return NextResponse.json({ result: generatedContent });
  } catch (error) {
    console.error('API error:', error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({ error: 'OpenAI API error', details: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: 'Failed to generate content', details: error.message }, { status: 500 });
  }
}