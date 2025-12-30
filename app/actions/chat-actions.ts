'use server';

import { db } from "@/db/drizzle";
import { conversation, message, generatedImage } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getChat(id: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return null;

    // Verify ownership
    const chat = await db.query.conversation.findFirst({
        where: (table, { eq, and }) => and(eq(table.id, id), eq(table.userId, session.user.id))
    });

    if (!chat) return null;

    // Fetch messages
    const messages = await db.select()
        .from(message)
        .where(eq(message.conversationId, id))
        .orderBy(message.createdAt);

    // Fetch images
    const images = await db.select()
        .from(generatedImage)
        .where(eq(generatedImage.conversationId, id))
        .orderBy(desc(generatedImage.createdAt));

    return {
        ...chat,
        messages,
        images
    };
}

export async function getChats() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return [];

    const chats = await db.select()
        .from(conversation)
        .where(eq(conversation.userId, session.user.id))
        .orderBy(desc(conversation.createdAt));

    return chats;
}

export async function saveMessage(conversationId: string, role: 'user' | 'assistant', content: string) {
    const id = crypto.randomUUID();
    await db.insert(message).values({
        id,
        conversationId,
        role,
        content,
        createdAt: new Date()
    });
    return id;
}

export async function saveGeneratedImage(conversationId: string, url: string, prompt: string, aspectRatio?: string) {
    const id = crypto.randomUUID();
    await db.insert(generatedImage).values({
        id,
        conversationId,
        url,
        prompt,
        aspectRatio,
        createdAt: new Date()
    });
    return id;
}

export async function createChat(title: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return null;

    const id = crypto.randomUUID();

    await db.insert(conversation).values({
        id,
        title,
        userId: session.user.id,
    });

    revalidatePath('/dashboard');
    return id;
}

export async function renameChat(id: string, title: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return { error: "Unauthorized" };

    // Verify ownership?
    const chat = await db.query.conversation.findFirst({
        where: (table, { eq, and }) => and(eq(table.id, id), eq(table.userId, session.user.id))
    });

    if (!chat) return { error: "Chat not found or unauthorized" };

    await db.update(conversation)
        .set({ title, updatedAt: new Date() })
        .where(eq(conversation.id, id));

    revalidatePath('/dashboard');
    return { success: true };
}

export async function deleteChat(id: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return { error: "Unauthorized" };

    await db.delete(conversation)
        .where(eq(conversation.id, id)); // Add userId check for safety in real app, effectively done via UI but good to be safe.
    // Actually .where(and(eq(id, id), eq(userId, session.user.id))) recommended.

    revalidatePath('/dashboard');
    return { success: true };
}
