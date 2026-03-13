import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, ChevronRight, Archive, CheckCircle, XCircle, RefreshCw, Sparkles } from 'lucide-react';

interface Session {
    id: number;
    thread_id: string;
    raw_input: string;
    status: string;
    decision: string | null;
    node_count: number;
    created_at: string;
    updated_at: string;
}

export default function History({ onLoadSession, onBack }: {
    onLoadSession: (threadId: string, state: any, nodeHistory: string[]) => void;
    onBack: () => void;
}) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/sessions');
            const data = await res.json();
            setSessions(data);
        } catch (e) {
            console.error('Failed to fetch sessions:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadSession = async (threadId: string) => {
        try {
            const res = await fetch(`http://localhost:8000/api/sessions/${threadId}`);
            const data = await res.json();
            if (data.state) {
                onLoadSession(data.thread_id, data.state, data.node_history);
            }
        } catch (e) {
            console.error('Failed to load session:', e);
        }
    };

    const deleteSession = async (e: React.MouseEvent, sessionId: number) => {
        e.stopPropagation();
        setDeleting(sessionId);
        try {
            await fetch(`http://localhost:8000/api/sessions/${sessionId}`, { method: 'DELETE' });
            setSessions(prev => prev.filter(s => s.id !== sessionId));
        } catch (e) {
            console.error('Failed to delete session:', e);
        } finally {
            setDeleting(null);
        }
    };

    const getStatusConfig = (status: string, decision: string | null) => {
        if (status === 'completed') {
            if (decision?.toLowerCase().includes('go') && !decision?.toLowerCase().includes('no')) {
                return { icon: <CheckCircle size={16} />, label: 'GO', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
            } else if (decision?.toLowerCase().includes('no')) {
                return { icon: <XCircle size={16} />, label: 'NO-GO', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' };
            } else if (decision?.toLowerCase().includes('pivot')) {
                return { icon: <RefreshCw size={16} />, label: 'PIVOT', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' };
            }
            return { icon: <CheckCircle size={16} />, label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
        }
        if (status === 'failed') {
            return { icon: <XCircle size={16} />, label: 'Failed', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' };
        }
        return { icon: <RefreshCw size={16} />, label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' };
    };

    const formatDate = (isoString: string) => {
        const d = new Date(isoString + 'Z');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start pt-12 p-6 relative overflow-y-auto">
            {/* Background glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-violet)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full z-10"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-[rgba(138,43,226,0.1)] rounded-xl text-[var(--accent-violet)] border border-[rgba(138,43,226,0.2)]">
                            <Archive size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Idea History</h2>
                            <p className="text-[var(--text-muted)] text-sm">
                                {sessions.length} validation{sessions.length !== 1 ? 's' : ''} saved
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-xl border border-[var(--border-light)] text-[var(--text-muted)] hover:text-white hover:border-[var(--accent-blue)] transition-all text-sm"
                    >
                        ← New Idea
                    </button>
                </div>

                {/* Session List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="text-[var(--accent-blue)] animate-pulse">Loading history...</div>
                    </div>
                ) : sessions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 glass-panel p-12"
                    >
                        <Sparkles size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-40" />
                        <p className="text-[var(--text-muted)] text-lg">No ideas validated yet.</p>
                        <p className="text-[var(--text-muted)] text-sm mt-2 opacity-60">Your validation history will appear here.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {sessions.map((session, i) => {
                                const statusConfig = getStatusConfig(session.status, session.decision);
                                return (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => loadSession(session.thread_id)}
                                        className="glass-panel p-5 cursor-pointer hover:border-[var(--accent-blue)] transition-all group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                {/* Idea text */}
                                                <p className="text-white font-medium text-base truncate pr-4 group-hover:text-[var(--accent-blue)] transition-colors">
                                                    {session.raw_input}
                                                </p>

                                                {/* Meta row */}
                                                <div className="flex items-center space-x-4 mt-2.5">
                                                    {/* Status badge */}
                                                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bg} border ${statusConfig.border}`}>
                                                        {statusConfig.icon}
                                                        <span>{statusConfig.label}</span>
                                                    </span>

                                                    {/* Node count */}
                                                    <span className="text-xs text-[var(--text-muted)]">
                                                        {session.node_count} agent{session.node_count !== 1 ? 's' : ''} ran
                                                    </span>

                                                    {/* Date */}
                                                    <span className="text-xs text-[var(--text-muted)] flex items-center space-x-1">
                                                        <Clock size={12} />
                                                        <span>{formatDate(session.created_at)}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center space-x-2 ml-4">
                                                <button
                                                    onClick={(e) => deleteSession(e, session.id)}
                                                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                                                    title="Delete session"
                                                >
                                                    {deleting === session.id ? (
                                                        <RefreshCw size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                                <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent-blue)] transition-colors" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
