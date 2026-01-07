"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth"; // Assuming this is where auth helper is
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updatePreferences(preferences: any) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    await db.update(user)
        .set({ preferences })
        .where(eq(user.id, session.user.id));

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function randomizeLocation() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const locations = [
        "Earth, 616", "Asgard", "Wakanda", "Cybertron", "Gotham City",
        "Metropolis", "The Shire", "Pandora", "Tatooine", "Coruscant",
        "Winterfell", "Rivendell", "Hogwarts", "Narnia", "Atlantis"
    ];

    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    await db.update(user)
        .set({ location: randomLocation })
        .where(eq(user.id, session.user.id));

    revalidatePath('/profile');
    return randomLocation;
}

export async function getProfileStats() { // Optional if not using session for everything
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return null;
    }

    const userData = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
        columns: {
            promptsCount: true,
            imagesCount: true,
            location: true,
            createdAt: true,
            preferences: true
        }
    });

    return userData;
}
