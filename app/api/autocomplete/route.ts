import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt || prompt.length < 5) {
            return NextResponse.json({ suggestion: '' });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            // Fail silently or return empty to avoid breaking UI
            return NextResponse.json({ suggestion: '' });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://img-nano.vercel.app',
                'X-Title': 'Img Nano Autocomplete',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-flash-latest',
                messages: [
                    {
                        role: 'system',
                        content: "You are an image prompt completion engine. You will receive an incomplete image prompt. You must complete it with 3-6 relevant, descriptive words. Do not repeat the input. Do not explain. Return ONLY the completion text. If the prompt is already very long or complete, return nothing."
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 15,
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ suggestion: '' });
        }

        const result = await response.json();
        let suggestion = '';

        if (result.choices && result.choices.length > 0) {
            suggestion = result.choices[0].message.content.trim();
            // Ensure we don't repeat logic or add weird prefixes
            if (suggestion.toLowerCase().startsWith(prompt.toLowerCase())) {
                suggestion = suggestion.slice(prompt.length).trim();
            }
        }

        return NextResponse.json({ suggestion });

    } catch (error) {
        console.error('Autocomplete error:', error);
        return NextResponse.json({ suggestion: '' });
    }
}
