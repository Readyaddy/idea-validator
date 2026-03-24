import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, TerminalSquare, AlertCircle, Archive, KeyRound, Info, X, Github } from 'lucide-react';

export default function InputPhase({ onSubmit, onShowHistory }: { onSubmit: (idea: string, apiKey: string) => void; onShowHistory: () => void }) {
    const [idea, setIdea] = useState("");
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [showAbout, setShowAbout] = useState(false);

    const handleApiKeyChange = (value: string) => {
        setApiKey(value);
        localStorage.setItem('gemini_api_key', value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim()) {
            onSubmit(idea, apiKey);
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

                <form onSubmit={handleSubmit} className="relative space-y-3">
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

                    {/* API Key Input */}
                    <div className="glass-panel p-2 flex items-center transition-all border-[var(--border-light)] focus-within:border-[var(--border-focus)]">
                        <div className="pl-3 pr-2 text-[var(--text-muted)]">
                            <KeyRound size={16} />
                        </div>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => handleApiKeyChange(e.target.value)}
                            placeholder="Paste your Gemini API Key here"
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white p-2 placeholder-[var(--text-muted)]"
                        />
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
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowAbout(true)}
                            className="flex items-center space-x-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-[var(--border-light)]"
                        >
                            <Info size={16} />
                            <span>About</span>
                        </button>
                        <button
                            onClick={onShowHistory}
                            className="flex items-center space-x-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-violet)] transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-[var(--border-light)]"
                        >
                            <Archive size={16} />
                            <span>View History</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            {/* About Modal */}
            <AnimatePresence>
                {showAbout && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6"
                        onClick={() => setShowAbout(false)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                            className="glass-panel relative max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors">
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold mb-1">About <span className="neon-text-blue">Idea Validator</span></h2>
                            <p className="text-[var(--text-muted)] text-sm mb-6">An open-source agentic validation engine</p>

                            <div className="space-y-6 text-[var(--text-secondary)] text-sm leading-relaxed">
                                <div>
                                    <h3 className="text-base font-semibold text-[var(--text-main)] mb-2">What is this?</h3>
                                    <p>Idea Validator is a free tool that stress-tests your startup idea before you invest time and money building it. Think of it as a panel of <strong className="text-white">15 expert advisors</strong> — investors, market researchers, growth strategists, devil's advocates — all powered by AI, reviewing your idea from every angle and giving you a final GO, NO-GO, or PIVOT verdict.</p>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-[var(--text-main)] mb-2">Why was this made?</h3>
                                    <p>Most startup ideas fail not because the product was bad, but because nobody validated the idea early enough. Getting honest feedback from real investors, analysts, and users costs time and social capital. This tool gives you that brutal honesty instantly, for free — before you write a single line of code.</p>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-[var(--text-main)] mb-2">How does it work?</h3>
                                    <p className="mb-3">Your idea goes through a <strong className="text-white">5-phase pipeline</strong> powered by 15 specialized AI agents:</p>
                                    <ol className="space-y-2 pl-1">
                                        <li className="flex gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,210,255,0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(0,210,255,0.2)' }}>1</span>
                                            <span><strong className="text-white">Vision Alignment</strong> — The system asks you pointed questions to truly understand your idea before analyzing it.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(140,82,255,0.1)', color: 'var(--accent-violet)', border: '1px solid rgba(140,82,255,0.2)' }}>2</span>
                                            <span><strong className="text-white">Market Research</strong> — Agents research competitors, analyze market size, study failed predecessors, scope out the MVP, and calculate unit economics.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(52,211,153,0.1)', color: 'var(--accent-emerald)', border: '1px solid rgba(52,211,153,0.2)' }}>3</span>
                                            <span><strong className="text-white">Stakeholder Review</strong> — Simulated users, seed investors, growth strategists, and compliance officers weigh in on your idea.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--accent-orange)', border: '1px solid rgba(249,115,22,0.2)' }}>4</span>
                                            <span><strong className="text-white">The MAD Loop</strong> — A Devil's Advocate tears your idea apart while a Defender fights back and evolves it. This repeats 3 rounds until only the strongest version survives.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(251,191,36,0.1)', color: 'var(--accent-amber)', border: '1px solid rgba(251,191,36,0.2)' }}>5</span>
                                            <span><strong className="text-white">Final Verdict</strong> — A Refiner writes a professional PRD, then the Judge delivers the final GO, NO-GO, or PIVOT decision.</span>
                                        </li>
                                    </ol>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-[var(--text-main)] mb-2">What is the MAD Loop?</h3>
                                    <p><strong className="neon-text-violet">Mutually Assured Destruction</strong> — inspired by nuclear deterrence theory. Two AI agents go head-to-head: the Devil's Advocate finds every weakness, flaw, and reason your idea will fail, while the Validator Optimist defends it and evolves the concept to be stronger. After 3 rounds of this battle, your idea is either battle-tested or exposed.</p>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-[var(--text-main)] mb-2">Technology</h3>
                                    <p>Powered by <strong className="text-white">Google Gemini 2.5 Flash</strong> through a LangGraph agentic pipeline. The backend runs on FastAPI with real-time WebSocket streaming. Everything runs locally on your machine — your ideas never leave your computer.</p>
                                </div>

                                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                                    <a
                                        href="https://github.com/Readyaddy/idea-validator"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 text-[var(--accent-blue)] hover:text-white transition-colors"
                                    >
                                        <Github size={16} />
                                        <span>View on GitHub</span>
                                    </a>
                                    <span className="text-xs text-[var(--text-muted)]">Built by Addy</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
