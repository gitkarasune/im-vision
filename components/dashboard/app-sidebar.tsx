'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    History,
    PanelLeftClose,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react"
import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getChats, renameChat, deleteChat } from "@/app/actions/chat-actions";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface AppSidebarProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    onNewChat?: () => void;
    refreshTrigger?: number;
    onSelectChat?: (id: string) => void;
}

export function AppSidebar({ className, isOpen, onClose, onNewChat, refreshTrigger = 0, onSelectChat }: AppSidebarProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const chats = await getChats();
            setHistory(chats || []);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    // Also fetch on mount and when trigger changes
    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);

    const handleRename = (id: string, currentTitle: string) => {
        setEditingId(id);
        setEditValue(currentTitle);
        setActiveMenuId(null);
    };

    const saveRename = async (id: string) => {
        if (!editValue.trim() || editValue === history.find(h => h.id === id)?.title) {
            setEditingId(null);
            return;
        }

        const oldHistory = [...history];
        // Optimistic update
        setHistory(prev => prev.map(item => item.id === id ? { ...item, title: editValue } : item));
        setEditingId(null);

        const result = await renameChat(id, editValue);
        if (result?.error) {
            setHistory(oldHistory);
            toast.error("Failed to rename chat");
        }
    };

    const handleDelete = async (id: string) => {
        const oldHistory = [...history];
        setHistory(prev => prev.filter(item => item.id !== id));
        setActiveMenuId(null);

        const result = await deleteChat(id);
        if (result?.error) {
            setHistory(oldHistory);
            toast.error("Failed to delete chat");
        }
    };

    const handleMouseLeave = () => {
        if (!activeMenuId && !editingId) {
            onClose();
        }
    }

    return (
        <div
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black text-black dark:text-white border-r transform transition-transform duration-300 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full",
                className
            )}
            onMouseLeave={handleMouseLeave}
        >
            <div className="p-4 border-b shadow-none flex items-center justify-between shrink-0">
                <div className="flex items-center">
                    <div className="flex items-center px-2 py-2 rounded-none text-sm font-sans">
                        IMvision
                    </div>
                </div>
                <PanelLeftClose onClick={onClose} className="w-4 h-4 md:hidden cursor-pointer" />
            </div>

            <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
                <div className="p-4 pb-4 border-t absolute bottom-0 w-full z-10 bg-white dark:bg-black">
                    <Button
                        className="w-full justify-center border items-center cursor-pointer rounded-none"
                        onClick={() => {
                            if (onNewChat) onNewChat();
                            onClose();
                        }}
                    >
                        New Chat
                    </Button>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[calc(100vh-140px)]">
                        <h4 className="px-4 pt-6 pb-2 text-xs font-semibold text-muted-foreground tracking-wider">
                            History
                        </h4>
                        <div className="space-y-1 px-2 pb-4">
                            {history.length === 0 && !isLoading && (
                                <p className="text-xs text-muted-foreground px-4">No recent history.</p>
                            )}

                            {history.map((item) => (
                                <div key={item.id} className="group relative flex items-center">
                                    {editingId === item.id ? (
                                        <div className="flex items-center gap-1 w-full px-2 py-1">
                                            <input
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => saveRename(item.id)}
                                                onKeyDown={(e) => e.key === 'Enter' && saveRename(item.id)}
                                                className="flex-1 text-sm px-1 py-0.5 rounded-none border-none focus:ring-1 focus:ring-primary outline-none bg-transparent"
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="w-full justify-start font-normal text-muted-foreground hover:text-foreground pr-8 truncate h-auto py-2 rounded-none"
                                            onClick={() => {
                                                if (onSelectChat) onSelectChat(item.id);
                                                // Optional: Close on mobile?
                                                if (window.innerWidth < 768) onClose();
                                            }}
                                        >
                                            <div className="flex flex-col items-start overflow-hidden w-full">
                                                <span className="truncate w-full text-left text-sm" title={item.title}>
                                                    {item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
                                                </span>
                                                <span className="text-[10px] opacity-50">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                                            </div>
                                        </Button>
                                    )}

                                    {!editingId && (
                                        <div className="absolute right-1 transition-opacity text-black dark:text-white backdrop-blur-sm rounded-none opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                                            <DropdownMenu onOpenChange={(open) => setActiveMenuId(open ? item.id : null)}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-muted">
                                                        <MoreHorizontal className="w-3 h-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="rounded-none" align="start">
                                                    <DropdownMenuItem onClick={() => handleRename(item.id, item.title)}>
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Rename
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
