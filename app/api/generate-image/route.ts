import { NextResponse } from 'next/server';
import { saveMessage, saveGeneratedImage } from '@/app/actions/chat-actions';
import { db } from '@/db/drizzle';
import { user } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { prompt, conversationId, packshotMode, realisticShadows, aspectRatio } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Auth check to attribute stats
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (session?.user) {
      // Increment prompts count immediately
      // We catch potential errors here so we don't block generation if DB metric update fails
      try {
        await db.update(user)
          .set({ promptsCount: sql`${user.promptsCount} + 1` })
          .where(eq(user.id, session.user.id));
      } catch (e) {
        console.error("Failed to update prompts count", e);
      }
    }

    // Check if conversation ID provided. If not, client should have created one. or we create here?
    // Client ensures conversationId via createChat for new chats. But here, let's assume client passes it.
    // If client is just "prompting" without chat ID (logic we updated in dashboard), dashboard creates chat first.
    // So conversationId is expected.

    if (!conversationId) {
      // Fallback or error? Let's just create one if missing or error.
      // Actually, let's require it for persistence.
      if (process.env.NODE_ENV === 'development') console.warn("No conversationId provided to generate-image");
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured' },
        { status: 500 }
      );
    }

    // Save User Message
    if (conversationId) {
      await saveMessage(conversationId, 'user', prompt);
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://img-nano.vercel.app', // Optional: for OpenRouter rankings
        'X-Title': 'Img Nano', // Optional: for OpenRouter rankings
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate image', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Extract image URL from the response
    // Based on the user provided example:
    // result.choices[0].message.images[0].image_url.url

    let imageUrl = null;
    if (result.choices && result.choices.length > 0) {
      const message = result.choices[0].message;
      if (message.images && message.images.length > 0) {
        imageUrl = message.images[0].image_url.url;
      }
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image generated in response' },
        { status: 500 }
      );
    }

    // Only increment image count on success
    if (session?.user) {
      try {
        await db.update(user)
          .set({ imagesCount: sql`${user.imagesCount} + 1` })
          .where(eq(user.id, session.user.id));
      } catch (e) {
        console.error("Failed to update images count", e);
      }
    }

    // Save Assistant Message and Image
    if (conversationId) {
      // Save text message part? Usually image generators just return image.
      // We'll save a message saying "Here is your image..."
      await saveMessage(conversationId, 'assistant', `Here is your image for: "${prompt}"`);
      await saveGeneratedImage(conversationId, imageUrl, prompt, aspectRatio);
    }

    return NextResponse.json({ imageUrl, conversationId });

  } catch (error) {
    console.error('Error in generate-image route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
