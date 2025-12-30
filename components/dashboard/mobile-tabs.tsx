'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type TabStatus = 'idle' | 'loading' | 'generating' | 'success' | 'error';

interface MobileTabsProps {
    activeTab: 'chat' | 'preview';
    onTabChange: (tab: 'chat' | 'preview') => void;
    status?: TabStatus; // 'idle' | 'loading' | 'generating' | 'success' | 'error'
    isLoading?: boolean; // Keep for backward compat if needed, but prefer status
}

export function MobileTabs({ activeTab, onTabChange, status = 'idle', isLoading }: MobileTabsProps) {
    const tabs = [
        { id: 'chat', label: 'Chat' },
        { id: 'preview', label: 'Preview' },
    ];

    // Derive effective status if isLoading is used (legacy compat)
    const effectiveStatus = isLoading ? 'loading' : status;

    // Auto-reset success/error status after a delay? 
    // The user said: "put the check good mark as generated and then remove it as well"
    // So we probably want to show it for a bit then go back to idle visually?
    // Or maybe the parent handles the reset? 
    // "Alway listen along" -> Implies immediate reaction.

    // We'll trust the parent to pass the correct status.

    return (
        <div className="flex w-full border-b bg-white dark:bg-black relative">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                // Determine indicator color based on status
                let indicatorColor = "bg-black dark:bg-white";
                if (effectiveStatus === 'error' && isActive) indicatorColor = "bg-red-600";

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as 'chat' | 'preview')}
                        className={cn(
                            "relative flex-1 py-3 text-sm font-medium transition-colors outline-none select-none",
                            isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                            effectiveStatus === 'error' && isActive && "text-red-600"
                        )}
                    >

                        {/* Tab Label */}
                        <div className="relative z-10 flex items-center justify-center gap-2">
                            {tab.label}
                            {/* Status Indicators for Preview Tab */}
                            {tab.id === 'preview' && (
                                <AnimatePresence mode="wait">
                                    {(effectiveStatus === 'loading' || effectiveStatus === 'generating') && (
                                        <motion.div
                                            key="loading"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="relative flex h-3 w-3 items-center justify-center"
                                        >
                                            <div className="w-3 h-3 absolute rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        </motion.div>
                                    )}
                                    {effectiveStatus === 'success' && (
                                        <motion.div
                                            key="success"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="relative flex h-3 w-3 items-center justify-center"
                                        >
                                            <Check className="w-3 h-3 text-green-500" />
                                        </motion.div>
                                    )}
                                    {effectiveStatus === 'error' && (
                                        <motion.div
                                            key="error"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="relative flex h-3 w-3 items-center justify-center"
                                        >
                                            <X className="w-3 h-3 text-red-500" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Animated Underline */}
                        {isActive && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className={cn("absolute bottom-0 left-0 right-0 h-[1px] z-0", indicatorColor)}
                                initial={false}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30
                                }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
