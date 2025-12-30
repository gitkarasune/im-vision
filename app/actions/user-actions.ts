'use server';

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateTheme(theme: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return { error: "Unauthorized" };

    if (!['light', 'dark', 'system'].includes(theme)) {
        return { error: "Invalid theme" };
    }

    await db.update(user)
        .set({ theme })
        .where(eq(user.id, session.user.id));

    // We don't necessarily need to revalidate path unless the theme is injected via server component
    // But usually theme is client-side, but we want to sync it.
    return { success: true };
}

export async function getTheme() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return "system";

    const userData = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
        columns: {
            theme: true
        }
    });

    return userData?.theme || "system";
}
