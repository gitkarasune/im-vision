'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { PromptInput, type PromptSettings } from './prompt-input';
import { cn } from '@/lib/utils';
import { Copy, Edit2, Check, ArrowDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useRef, useState } from 'react';
import { formatMessageDate } from '@/lib/date-utils';
import { toast } from 'sonner';
import { RotatingPrompts } from './rotating-prompts';
import { AnimatePresence, motion } from 'framer-motion';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    image?: string;
    timestamp: Date;
}

interface ChatInterfaceProps {
    messages: ChatMessage[];
    onGenerate: (prompt: string, settings: PromptSettings) => void;
    isLoading: boolean;
}

export function ChatInterface({ messages, onGenerate, isLoading }: ChatInterfaceProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [inputPrompt, setInputPrompt] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (bottomRef.current) {
            scrollToBottom();
        }
    }, [messages, isLoading]);

    // Handle scroll button visibility
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Prompt copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleEdit = (text: string) => {
        setInputPrompt(text);
        toast.info("Prompt loaded into input");
    };

    const handleShare = async (text: string) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Img Nano Prompt',
                    text: text,
                });
            } catch (err) {
                // Ignore abort errors
            }
        } else {
            handleCopy(text, 'share');
            toast.success("Link copied (Share not supported)");
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black relative overflow-hidden">
            <ScrollArea
                className="flex-1 px-4 md:px-6 min-h-0"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                <div className="flex flex-col gap-6 py-6 max-w-3xl mx-auto min-h-[calc(100vh-200px)]">
                    {/* Welcome Message if empty */}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-muted-foreground my-auto">
                            <h3 className="text-xl font-semibold text-foreground mb-7">What would you like to create?</h3>

                            {/* Rotating Prompts */}
                            <RotatingPrompts onSelect={setInputPrompt} isLoading={isLoading} />
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex flex-col w-full group relative mb-2",
                                msg.role === 'user' ? "items-end" : "items-start"
                            )}
                        >
                            {/* Metadata & Actions - Positioned slightly outside/above or integrated cleanly */}
                            {/* User wanted "remove this from the bottom... choose how chatGPT places their own" */}

                            <div className={cn(
                                "flex max-w-[85%] md:max-w-[75%] relative group/bubble",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}>
                                {/* Action Buttons (Hover only) */}
                                {msg.role === 'user' && (
                                    <div className="absolute top-0 right-full mr-2 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-start pt-1">
                                        <div className="flex gap-1 bg-white dark:bg-black backdrop-blur rounded-none p-1 border shadow-sm">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none" onClick={() => handleEdit(msg.content)}>
                                                            <Edit2 className="w-3 h-3" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className='rounded-none'>Edit</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none" onClick={() => handleCopy(msg.content, msg.id)}>
                                                            {copiedId === msg.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className='rounded-none'>Copy</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div className={cn(
                                    "relative px-4 py-3 text-sm shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-black dark:bg-white text-white dark:text-black rounded-none" // style sharp corner
                                        : "text-foreground rounded-none"
                                )}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                    {/* Timestamp inside bubble, slightly discreet */}
                                    <div className={cn(
                                        "text-[10px] mt-1 flex justify-end opacity-70 select-none",
                                        msg.role === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                                    )}>
                                        {formatMessageDate(new Date(msg.timestamp))}
                                    </div>
                                </div>
                            </div>

                            {/* Timestamp outside bubble? WhatsApp puts it inside. ChatGPT puts it nowhere until clicked/hovered usually? */}
                            {/* User: "just remove this from the bottom, it annoyes me" referring to the metadata row. */}
                            {/* I'll keep it very minimal or hidden. Maybe verify plan again? "Reposition... cleaner". */}
                        </div>
                    ))}

                    {/* Pending Indicator */}
                    {isLoading && (
                        <div className="flex w-full justify-start animate-in fade-in duration-300">
                            <div className="bg-white dark:bg-black text-black dark:text-white rounded-none size=12 shadow-none">
                                <Loader2 className="w-4 h-4 animate-spin" />

                                {/* <div className="w-3 h-3 absolute rounded-full border-2 border-primary border-t-blue-700 animate-spin" /> */}
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} className="h-1 w-full" />
                </div>
            </ScrollArea>

            {/* Scroll to bottom button */}
            <AnimatePresence>
                {showScrollButton && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={scrollToBottom}
                        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-background/80 backdrop-blur shadow-md border rounded-full p-2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                        <ArrowDown className="w-4 h-4" />
                    </motion.button>
                )}
            </AnimatePresence>

            <div className="p-4 md:p-6 bg-white dark:bg-black border-t z-10">
                <div className="max-w-3xl mx-auto">
                    <PromptInput
                        onGenerate={onGenerate}
                        isLoading={isLoading}
                        value={inputPrompt}
                        onValueChange={setInputPrompt}
                    />
                </div>
            </div>
        </div>
    );
}
