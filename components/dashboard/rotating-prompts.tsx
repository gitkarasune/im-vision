'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import promptsData from './load-prompt.json';

interface RotatingPromptsProps {
    onSelect: (prompt: string) => void;
    isLoading?: boolean;
}

export function RotatingPrompts({ onSelect, isLoading }: RotatingPromptsProps) {
    const [activePrompts, setActivePrompts] = useState<string[]>([]);
    const [promptIndex, setPromptIndex] = useState(0);

    // Initialize prompts
    useEffect(() => {
        // Random start to keep it fresh
        const startIdx = Math.floor(Math.random() * (promptsData.length - 3));
        setActivePrompts(promptsData.slice(startIdx, startIdx + 3));
        setPromptIndex(startIdx + 3);
    }, []);

    // Rotate prompts logic
    useEffect(() => {
        const interval = setInterval(() => {
            let currentIdx = promptIndex;

            const updatePrompt = (btnIndex: number) => {
                const nextPrompt = promptsData[currentIdx % promptsData.length];
                currentIdx++;

                setActivePrompts(prev => {
                    const newPrompts = [...prev];
                    newPrompts[btnIndex] = nextPrompt;
                    return newPrompts;
                });

                if (btnIndex === 2) {
                    setPromptIndex(currentIdx);
                }
            };

            updatePrompt(0);

            setTimeout(() => {
                updatePrompt(1);
            }, 1000);

            setTimeout(() => {
                updatePrompt(2);
            }, 2000);

        }, 10000);

        return () => clearInterval(interval);
    }, [promptIndex]);

    return (
        <div className='flex flex-wrap justify-center gap-3 mb-4 w-full max-w-2xl'>
            <AnimatePresence mode='popLayout'>
                {activePrompts.map((prompt, i) => (
                    <motion.div
                        key={`${prompt}-${i}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            opacity: { duration: 0.2 }
                        }}
                        layout
                    >
                        {/* ALso add the functionality that when i click any of the buttons, automatically make the curosr or the form active as when i click on an input form */}
                        <Button
                            variant={"outline"}
                            className='rounded-full p-5 cursor-pointer h-auto py-2 disabled:cursor-not-allowed disabled:opacity-50'
                            onClick={() => onSelect(prompt)}
                            disabled={isLoading}
                        >
                            {prompt}
                        </Button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
