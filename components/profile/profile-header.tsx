"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { CalendarDays, Link as LinkIcon, MapPin, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { randomizeLocation } from "@/app/actions/user-actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define a type for the user with the new fields locally since the client type might not interpret valid schema extensions immediately without codegen
interface ExtendedUser {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined;
    promptsCount?: number;
    imagesCount?: number;
    location?: string | null;
}

export function ProfileHeader() {
    const { data: session, refetch } = authClient.useSession();
    const router = useRouter();
    const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

    // Cast user to include our new fields
    const user = session?.user as unknown as ExtendedUser;

    const handleRandomizeLocation = async () => {
        setIsUpdatingLocation(true);
        try {
            await randomizeLocation();
            await refetch(); // Refetch session to get updated location
            toast.success("Location updated!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update location");
        } finally {
            setIsUpdatingLocation(false);
        }
    };

    if (!user) return null;

    return (
        <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between animate-in fade-in duration-500">
            <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background rounded-none">
                    <AvatarImage className="rounded-none object-cover" src={user.image || ""} />
                    <AvatarFallback className="text-2xl md:text-4xl bg-primary/10">
                        {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="space-y-4 pt-2">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{user.name}</h1>
                        <p className="">@{user.name?.toLowerCase().replace(/\s+/g, '')}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
                        </div>
                        <div className="flex items-center gap-1 group cursor-pointer" onClick={handleRandomizeLocation}>
                            <MapPin className="w-3 h-3" />
                            <span>{user.location || "Unknown Location"}</span>
                            <RefreshCw className={`w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUpdatingLocation ? 'animate-spin opacity-100' : ''}`} />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex flex-col p-3 rounded-none border-dashed w-24 border">
                            <span className="text-xs text-muted-foreground">Prompts</span>
                            <span className="text-xl font-bold">{user.promptsCount || 0}</span>
                        </div>
                        <div className="flex flex-col p-3 rounded-none border-dashed w-24 border">
                            <span className="text-xs text-muted-foreground">Images</span>
                            <span className="text-xl font-bold">{user.imagesCount || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

