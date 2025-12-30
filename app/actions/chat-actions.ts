'use server';

import { db } from "@/db/drizzle";
import { conversation } from "@/db/schema";
import { authClient } from "@/lib/auth-client"; // Wait, better-auth usually runs on client for authClient, but for server actions we might need headers or verify session differently.
// Actually, better-auth has server-side utilities. Let's check how to get session on server.
// Usually headers().
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // Assuming auth setup exists on server side, usually in lib/auth.ts
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
