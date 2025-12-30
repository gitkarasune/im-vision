'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Sparkles,
    ArrowUp,
    Settings2,
    Box,
    Moon,
    Ratio,
    Maximize2,
    Minimize2
} from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export interface PromptSettings {
    aspectRatio: string;
    packshotMode: boolean;
    realisticShadows: boolean;
}

interface PromptInputProps {
    onGenerate: (prompt: string, settings: PromptSettings) => void;
    isLoading: boolean;
    className?: string;
    // Controlled props
    value?: string;
    onValueChange?: (value: string) => void;
}

export function PromptInput({ onGenerate, isLoading, className, value, onValueChange }: PromptInputProps) {
    // Internal state for uncontrolled usage fallback
    const [internalPrompt, setInternalPrompt] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showExpandIcon, setShowExpandIcon] = useState(false);

    const isControlled = value !== undefined;
    const prompt = isControlled ? value : internalPrompt;

    const settingsState = useState<PromptSettings>({
        aspectRatio: 'Original',
        packshotMode: false,
        realisticShadows: false
    });
    const [settings, setSettings] = settingsState;

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handlePromptChange = (newValue: string) => {
        if (isControlled && onValueChange) {
            onValueChange(newValue);
        } else {
            setInternalPrompt(newValue);
        }
    };

    // Focus handling when value changes externally (e.g. from Rotating Prompts)
    // We only want to focus if the prompt is not empty and the textarea is not already focused
    useEffect(() => {
        if (prompt && textareaRef.current && document.activeElement !== textareaRef.current) {
            // Only focus if needed, avoiding stealing focus unexpectedly if user is doing something else
            // But for rotating prompts click, we want focus.
            textareaRef.current.focus();
        }
    }, [prompt]);


    // Auto-resize textarea and check for expand icon visibility
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + 'px';

            // Show expand icon if content exceeds ~100px (approx 4-5 lines)
            if (scrollHeight > 100) {
                setShowExpandIcon(true);
            } else {
                setShowExpandIcon(false);
            }
        }
    }, [prompt]);

    const handleEnhancePrompt = () => {
        if (!prompt) return;
        const enhancements = [
            "highly detailed",
            "8k resolution",
            "cinematic lighting",
            "photorealistic",
            "masterpiece"
        ];
        // simple random addition
        const enhanced = `${prompt}, ${enhancements[Math.floor(Math.random() * enhancements.length)]}`;
        handlePromptChange(enhanced);
        toast.success("Prompt enhanced with AI magic!");
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!prompt.trim() || isLoading) return;

        onGenerate(prompt, settings);

        // Clear input
        handlePromptChange('');

        // Return to normal mode
        setIsExpanded(false);

        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Toggle Expanded Mode
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        // When expanding, focus the area again
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 100);
    };


    return (
        <>
            {/* Overlay for Expanded Mode */}
            {isExpanded && (
                <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setIsExpanded(false)} />
            )}

            <div
                className={cn(
                    "relative w-full max-w-3xl mx-auto transition-all duration-300 ease-in-out",
                    className,
                    isExpanded ? "absolute inset-0 z-50 h-full max-w-none bg-white dark:bg-black p-4 sm:p-8 md:p-12 flex flex-col justify-center" : ""
                )}
            >
                <div
                    className={cn(
                        "relative flex flex-col w-full bg-white dark:bg-black text-black dark:text-white border transition-all duration-200 overflow-hidden",
                        isExpanded ? "h-full shadow-2xl rounded-sm border-foreground/10" : "rounded-none shadow-none"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Controls for Expanded Mode */}
                    {isExpanded && (
                        <div className="flex items-center justify-end p-3 border-b">
                            <Button variant="ghost" size="icon" className="rounded-none" onClick={() => setIsExpanded(false)}>
                                <Minimize2 className="h-5 w-5" />
                            </Button>
                        </div>
                    )}

                    <Textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => handlePromptChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        placeholder={isLoading ? "Generating..." : "Describe your image..."}
                        className={cn(
                            "w-full resize-none border-0 bg-transparent py-4 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 rounded-none disabled:cursor-not-allowed disabled:opacity-50",
                            isExpanded ? "flex-1 text-md sm:text-x min-h-[50vh]" : "min-h-[60px] max-h-[200px]"
                        )}
                    />

                    {/* Footer / Toolbar */}
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-black border-t">
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-foreground border rounded-none cursor-pointer">
                                        <Settings2 className="w-4 h-4" />
                                        <span className="text-xs font-medium">Settings</span>
                                        {(settings.packshotMode || settings.realisticShadows) && (
                                            <span className="w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-4 rounded-none bg-white dark:bg-black shadow-none" align="start">
                                    <div className="space-y-4 relative">
                                        <h4 className="font-medium leading-none">Generation Settings</h4>

                                        <Separator className='px-0 -ml-4' />
                                        <Separator className='px-0 max-w-8 absolute top-8 right-0 -mr-4' />

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="aspect" className="text-sm">Aspect Ratio</Label>
                                                <Ratio className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <Select
                                                value={settings.aspectRatio}
                                                onValueChange={(v) => setSettings(s => ({ ...s, aspectRatio: v }))}
                                            >
                                                <SelectTrigger className='rounded-none' id="aspect">
                                                    <SelectValue placeholder="Select ratio" />
                                                </SelectTrigger>
                                                <SelectContent className='rounded-none bg-white dark:bg-black shadow-none'>
                                                    <SelectItem value="Original">Original</SelectItem>
                                                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                                                    <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                                                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                                                    <SelectItem value="4:3">Standard (4:3)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Box className="w-4 h-4 text-muted-foreground" />
                                                <Label htmlFor="packshot" className="text-sm cursor-pointer">Packshot Mode</Label>
                                            </div>
                                            <Switch
                                                id="packshot"
                                                checked={settings.packshotMode}
                                                onCheckedChange={(c) => setSettings(s => ({ ...s, packshotMode: c }))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Moon className="w-4 h-4 text-muted-foreground" />
                                                <Label htmlFor="shadows" className="text-sm cursor-pointer">Realistic Shadows</Label>
                                            </div>
                                            <Switch
                                                id="shadows"
                                                checked={settings.realisticShadows}
                                                onCheckedChange={(c) => setSettings(s => ({ ...s, realisticShadows: c }))}
                                            />
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-purple-500 transition-colors border rounded-none cursor-pointer"
                                onClick={handleEnhancePrompt}
                                title="Enhance Prompt"
                            >
                                <Sparkles className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Expand Icon - Only show if content height > 100px OR if already expanded (to show minimize if we wanted, but we have separate minimize btn in expanded header) */}
                            {/* Actually, prompt says: "if below max-h-100, remove the expand icons as well" */}
                            {!isExpanded && showExpandIcon && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={toggleExpand}
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-none"
                                            >
                                                <Maximize2 className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className='rounded-none'>Expand</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {/* Submit Button */}
                            <Button
                                size="icon"
                                onClick={() => handleSubmit()}
                                disabled={!prompt.trim() || isLoading}
                                className={cn(
                                    "h-8 w-8 transition-all duration-200 rounded-none cursor-pointer relative",
                                    prompt.trim() ? "border-none opacity-100" : "border-none opacity-50 rotate-180 transition-all",
                                    ` ${isLoading && 'border-none opacity-100 transition-all'}`
                                )}
                            >
                                {isLoading
                                    &&
                                    <div className="w-3 h-3 absolute rounded-full border-2 border-primary border-t-blue-700 animate-spin" />
                                }

                                {!isLoading && <ArrowUp className="w-4 h-4" />}

                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
