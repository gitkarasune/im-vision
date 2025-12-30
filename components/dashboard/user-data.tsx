"use client"

import { LogOut, Monitor, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client"
import { useTheme } from "next-themes";
import { updateTheme, getTheme } from "@/app/actions/user-actions";
import { useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface UserNavProps {
    chatPosition: 'left' | 'right';
    setChatPosition: (position: 'left' | 'right') => void;
}

export function UserNav({ chatPosition, setChatPosition }: UserNavProps) {
    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession()

    // Sync theme from server on mount
    useEffect(() => {
        const syncTheme = async () => {
            const savedTheme = await getTheme();
            if (savedTheme && savedTheme !== 'system' && savedTheme !== theme) {
                setTheme(savedTheme);
            }
        };
        syncTheme();
    }, []);

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme);
        await updateTheme(newTheme);
    };

    const getInitials = (name: string | null | undefined): string => {
        if (!name || typeof name !== 'string') return 'U';
        const trimmedName = name.trim();
        if (!trimmedName) return 'U';
        const names = trimmedName.split(' ');
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    if (isPending) {
        return (
            <Button variant="ghost" size="icon" className="rounded-none transition-colors border-none animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-none" />
            </Button>
        )
    }

    if (!session || error) {
        return (
            <Button variant="outline" size="sm" className="rounded-none" onClick={() => window.location.href = '/login'}>
                Login
            </Button>
        )
    }

    const { user } = session

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer " asChild>
                <Button variant="ghost" size="icon" className="rounded-none transition-colors border-none">
                    <Avatar className="h-8 w-8 rounded-none border-none">
                        <AvatarImage src={user.image || undefined} alt={user.name || "User"} className="object-cover" />
                        <AvatarFallback className="font-bold text-blue-600 rounded-none">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-62 rounded-none shadow-none bg-white dark:bg-black text-black dark:text-white mt-3" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-4">
                    <p className="text-sm font-medium leading-none">{user.name || 'No name provided'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center justify-between">
                        <span>Documentation</span>
                        <FaExternalLinkAlt className=" h-4 w-4" />
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <div className="p-2 space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground block mb-2">Preferences</span>

                    <div className="flex items-center justify-between">
                        <span className="text-sm">Theme</span>
                        <div className="flex items-center bg-white dark:bg-black rounded-md border p-0.5">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-6 w-6 rounded-sm shadow-sm", theme === 'system' ? "bg-muted" : "")}
                                onClick={() => handleThemeChange('system')}
                            >
                                <Monitor className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-6 w-6 rounded-sm shadow-sm", theme === 'light' ? "bg-muted" : "")}
                                onClick={() => handleThemeChange('light')}
                            >
                                <Sun className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-6 w-6 rounded-sm shadow-sm", theme === 'dark' ? "bg-muted" : "")}
                                onClick={() => handleThemeChange('dark')}
                            >
                                <Moon className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm">Chat Position</span>
                        <div className="flex items-center bg-white dark:bg-black rounded-md border p-0.5">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-6 text-[10px] px-2 rounded-sm transition-all", chatPosition === 'left' ? "bg-white dark:bg-black text-foreground" : "text-muted-foreground")}
                                onClick={() => setChatPosition('left')}
                            >
                                Left
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-6 text-[10px] px-2 rounded-sm transition-all", chatPosition === 'right' ? "bg-white dark:bg-black text-foreground" : "text-muted-foreground")}
                                onClick={() => setChatPosition('right')}
                            >
                                Right
                            </Button>
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
