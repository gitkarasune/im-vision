"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Monitor, Sun, Moon, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { updatePreferences } from "@/app/actions/user-actions";
import { useRouter } from "next/navigation";

interface UserPreferences {
    suggestions: boolean;
    soundNotifications: boolean;
    chatPosition: string;
    instructions: string;
}

export function PreferencesForm() {
    const { setTheme, theme } = useTheme();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    // Default values
    const [suggestions, setSuggestions] = React.useState(true);
    const [soundNotifications, setSoundNotifications] = React.useState(true);
    const [chatPosition, setChatPosition] = React.useState("left");
    const [instructions, setInstructions] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);

    // Initial load from session
    React.useEffect(() => {
        if (session?.user && (session.user as any).preferences) {
            const prefs = (session.user as any).preferences as UserPreferences;
            if (prefs) {
                setSuggestions(prefs.suggestions ?? true);
                setSoundNotifications(prefs.soundNotifications ?? true);
                setChatPosition(prefs.chatPosition ?? "left");
                setInstructions(prefs.instructions ?? "");
            }
        }
    }, [session]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const prefs = {
                suggestions,
                soundNotifications,
                chatPosition,
                instructions
            };
            await updatePreferences(prefs);
            toast.success("Preferences saved successfully");
            router.refresh(); // Refresh to apply changes if any (like chat position)
        } catch (error) {
            toast.error("Failed to save preferences");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="py-2">
                <h1 className="text-lg font-semibold tracking-tight">Preferences</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage your interface and interaction settings.
                </p>
            </div>

            <div className="space-y-6">
                {/* General Section */}
                <div className="space-y-4">
                    <h3 className="text-sm text-muted-foreground">General</h3>

                    <div className="flex items-center justify-between p-4 border rounded-none transition-colors">
                        <div className="space-y-0.5">
                            <Label className="">Suggestions</Label>
                            <p className="text-sm text-muted-foreground">
                                Get relevant in-chat suggestions to refine your project.
                            </p>
                        </div>
                        <Switch
                            checked={suggestions}
                            onCheckedChange={setSuggestions}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-none transition-colors">
                        <div className="space-y-0.5">
                            <Label className="">Sound Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Play a sound when generation is finished and window is not focused.
                            </p>
                        </div>
                        <Switch
                            checked={soundNotifications}
                            onCheckedChange={setSoundNotifications}
                        />
                    </div>

                    <div className="space-y-3 p-3 border rounded-none transition-colors">
                        <div className="flex items-center justify-between">
                            <Label className="">Chat Position</Label>
                            <Select value={chatPosition} onValueChange={setChatPosition}>
                                <SelectTrigger className="w-[180px] rounded-none">
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none bg-white dark:bg-black">
                                    <SelectItem className="rounded-none" value="left">Left</SelectItem>
                                    <SelectItem className="rounded-none" value="right">Right</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Choose which side of the screen the chat interface appears on.
                        </p>
                    </div>

                    <div className="space-y-3 p-3 border rounded-none transition-colors">
                        <Label className="">Custom Instructions</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Manage your custom user rules or preferences for the AI.
                        </p>
                        <Textarea
                            placeholder="e.g., Always generate images with a 16:9 aspect ratio unless specified..."
                            className="min-h-[120px] resize-none rounded-none"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                        <div className="flex justify-end rounded-none pt-2">
                            <Button
                                className="rounded-none bg-white dark:bg-black text-black dark:text-white border"
                                onClick={handleSave}
                                size="sm"
                                disabled={isSaving}
                            >
                                {isSaving && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Interface Section */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-sm text-muted-foreground">Interface and Theme</h3>

                    <div className="space-y-3 p-3 border rounded-none transition-colors">
                        <div className="flex items-center justify-between">
                            <Label className="">Theme</Label>
                            <div className="flex items-center gap-2 border rounded-none p-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-7 w-7 rounded-none", theme === 'light' && "bg-background shadow-sm")}
                                    onClick={() => setTheme("light")}
                                >
                                    <Sun className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-7 w-7 rounded-none", theme === 'system' && "bg-background shadow-sm")}
                                    onClick={() => setTheme("system")}
                                >
                                    <Monitor className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-7 w-7 rounded-none", theme === 'dark' && "bg-background shadow-sm")}
                                    onClick={() => setTheme("dark")}
                                >
                                    <Moon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Choose your preferred color scheme.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

