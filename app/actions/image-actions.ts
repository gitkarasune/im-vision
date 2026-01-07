"use server";

import { db } from "@/db/drizzle";
import { generatedImage, conversation } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function markImageAsDownloaded(imageId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) return { success: false };

    await db.update(generatedImage)
        .set({ isDownloaded: true })
        .where(eq(generatedImage.id, imageId));

    revalidatePath('/profile');
    return { success: true };
}

export async function getShowcaseImages() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) return [];

    const images = await db.select({
        id: generatedImage.id,
        url: generatedImage.url,
        prompt: generatedImage.prompt,
        createdAt: generatedImage.createdAt,
    })
        .from(generatedImage)
        .innerJoin(
            conversation,
            eq(generatedImage.conversationId, conversation.id)
        )
        .where(
            and(
                eq(conversation.userId, session.user.id),
                eq(generatedImage.isDownloaded, true)
            )
        )
        .orderBy(desc(generatedImage.createdAt));

    return images;
}
