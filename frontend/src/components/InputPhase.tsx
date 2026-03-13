import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, TerminalSquare, AlertCircle, Archive } from 'lucide-react';

export default function InputPhase({ onSubmit, onShowHistory }: { onSubmit: (idea: string) => void; onShowHistory: () => void }) {
    const [idea, setIdea] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim()) {
            onSubmit(idea);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-blue)] opacity-5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-violet)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-3xl w-full z-10"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[var(--border-light)] bg-[rgba(255,255,255,0.03)] text-[var(--accent-blue)] text-sm mb-6">
                        <Sparkles size={16} />
                        <span>Agentic Validation Engine</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        Stop building in the <span className="neon-text-violet">Dark</span>.
                    </h1>
                    <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                        Subject your startup idea to a brutal gauntlet of AI agents simulating market reality, hostile environments, and cynical investors before you write a single line of code.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <div className="glass-panel p-2 flex items-center shadow-2xl transition-all border-[var(--border-light)] focus-within:border-[var(--border-focus)]">
                        <div className="pl-4 pr-2 text-[var(--text-muted)]">
                            <TerminalSquare size={24} />
                        </div>
                        <input
                            type="text"
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="I want to build an AI-powered ESP32 device that monitors..."
                            className="flex-1 bg-transparent border-none outline-none text-lg text-white p-3 placeholder-[var(--text-muted)]"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!idea.trim()}
                            className="bg-[var(--text-main)] text-[var(--bg-dark)] hover:bg-[var(--accent-blue)] disabled:opacity-50 disabled:hover:bg-[var(--text-main)] px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors ml-2"
                        >
                            <span>Initialize</span>
                            <Play size={18} />
                        </button>
                    </div>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-8 flex items-center justify-between"
                >
                    <div className="flex items-center space-x-2 text-sm text-[var(--text-muted)]">
                        <AlertCircle size={16} />
                        <span>Press Enter to begin the Vision Alignment phase.</span>
                    </div>
                    <button
                        onClick={onShowHistory}
                        className="flex items-center space-x-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-violet)] transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-[var(--border-light)]"
                    >
                        <Archive size={16} />
                        <span>View History</span>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
