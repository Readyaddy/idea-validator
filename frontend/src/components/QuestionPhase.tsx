import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target } from 'lucide-react';

export default function QuestionPhase({ state, onSubmit }: { state: any; onSubmit: (answers: string[]) => void }) {
    const questions = state.vision_questions || [];
    const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (answers.every(a => a.trim() !== '')) {
            onSubmit(answers);
        }
    };

    if (!questions.length) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-[var(--accent-blue)] animate-pulse">Initializing Vision Aligner...</div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start pt-12 p-6 relative overflow-y-auto">
            {/* Background glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-blue)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-2xl w-full z-10 glass-panel p-8 mb-12"
            >
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-[rgba(0,210,255,0.1)] rounded-xl text-[var(--accent-blue)] border border-[rgba(0,210,255,0.2)]">
                        <Target size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Vision Alignment</h2>
                        <p className="text-[var(--text-muted)] text-sm">Please answer these piercing questions to eliminate ambiguity before we build.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {questions.map((q: string, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="space-y-3"
                        >
                            <label className="block text-sm font-semibold text-[var(--accent-blue)] leading-relaxed pb-1">
                                <span className="mr-2 px-2 py-0.5 rounded-md bg-[rgba(0,210,255,0.1)] border border-[rgba(0,210,255,0.2)]">
                                    {i + 1}
                                </span>
                                {q.replace(/^\d+[\.\)]\s*/, '')}
                            </label>
                            <textarea
                                value={answers[i] || ''}
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[i] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                className="w-full bg-[rgba(0,0,0,0.4)] border border-[var(--border-light)] rounded-xl p-4 text-white focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] outline-none resize-y min-h-[100px] transition-all placeholder-[var(--text-muted)] placeholder-opacity-50"
                                placeholder="Type your strategic answer here..."
                                required
                            />
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: questions.length * 0.1 + 0.2 }}
                        className="pt-6 border-t border-[var(--border-light)]"
                    >
                        <button
                            type="submit"
                            disabled={answers.some(a => !a || a.trim() === '')}
                            className="w-full bg-[var(--accent-blue)] text-black hover:bg-white disabled:bg-[var(--border-light)] disabled:text-[var(--text-muted)] disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_40px_rgba(0,210,255,0.6)]"
                        >
                            <span>Lock In Answers & Ignite Engine</span>
                            <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
}
