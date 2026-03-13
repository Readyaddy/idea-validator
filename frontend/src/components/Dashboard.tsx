import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Activity, Target, Users, AlertOctagon, CheckCircle, Code2, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Dashboard({ state, nodeHistory, isExecuting }: { state: any, nodeHistory: string[], isExecuting: boolean }) {
    const [activeTab, setActiveTab] = useState('execution');

    const tabs = [
        { id: 'execution', label: 'Execution Engine', icon: <Activity size={18} /> },
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
        { id: 'market', label: 'Market Reality', icon: <Target size={18} /> },
        { id: 'stakeholders', label: 'Stakeholders', icon: <Users size={18} /> },
        { id: 'madloop', label: 'The MAD Loop', icon: <AlertOctagon size={18} /> },
        { id: 'verdict', label: 'Final Verdict', icon: <CheckCircle size={18} /> },
    ];

    return (
        <div className="w-full h-screen flex text-white overflow-hidden bg-[var(--bg-dark)]">
            {/* Sidebar */}
            <div className="w-72 bg-[var(--bg-panel-solid)] border-r border-[var(--border-light)] flex flex-col p-6 z-10 shrink-0 shadow-2xl">
                <div className="mb-10">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-tr from-[var(--accent-blue)] to-[var(--accent-violet)] flex items-center justify-center shadow-[0_0_15px_rgba(140,82,255,0.4)]">
                            <Code2 size={18} color="black" />
                        </div>
                        <h1 className="font-bold text-xl tracking-tight">Idea Validator</h1>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-4 line-clamp-3 italic bg-[rgba(0,0,0,0.3)] p-3 rounded-lg border border-[var(--border-light)]">
                        &quot;{state.raw_input || "Initializing..."}&quot;
                    </p>
                </div>

                <nav className="flex-1 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-[rgba(255,255,255,0.08)] text-white shadow-inner border border-[rgba(255,255,255,0.05)]'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
                                }`}
                        >
                            <div className={`${activeTab === tab.id ? 'text-[var(--accent-blue)]' : ''}`}>
                                {tab.icon}
                            </div>
                            <span className="font-medium text-sm">{tab.label}</span>
                            {tab.id === 'execution' && isExecuting && (
                                <div className="ml-auto w-2 h-2 rounded-full bg-[var(--accent-violet)] animate-ping" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto border-t border-[var(--border-light)] pt-6">
                    <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
                        <span>Status</span>
                        {isExecuting ? (
                            <span className="text-[var(--accent-violet)] flex items-center"><Play size={12} className="mr-1 animate-pulse" /> Executing...</span>
                        ) : (
                            <span className="text-emerald-400 flex items-center"><CheckCircle size={12} className="mr-1" /> Completed</span>
                        )}
                    </div>
                    <div className="mt-3 text-xs text-[var(--text-muted)]">
                        Nodes Processed: <span className="text-white font-mono">{nodeHistory.length}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[var(--bg-dark)] to-[#0c0c10]">
                {/* Glow effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-violet)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[var(--accent-blue)] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

                <div className="flex-1 overflow-y-auto p-10 z-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'execution' && <ExecutionTab nodeHistory={nodeHistory} isExecuting={isExecuting} state={state} />}
                            {activeTab === 'overview' && <OverviewTab state={state} />}
                            {activeTab === 'market' && <MarketTab state={state} />}
                            {activeTab === 'stakeholders' && <StakeholdersTab state={state} />}
                            {activeTab === 'madloop' && <MADLoopTab state={state} />}
                            {activeTab === 'verdict' && <VerdictTab state={state} isExecuting={isExecuting} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Child components for Tabs
function ExecutionTab({ nodeHistory, isExecuting, state }: any) {
    const allNodes = [
        { id: 'vision_aligner', label: 'Vision Aligner Phase 1' },
        { id: 'idea_expander', label: 'Idea Expander' },
        { id: 'data_gatherer', label: 'Data Gatherer' },
        { id: 'market_analyst', label: 'Market Analyst' },
        { id: 'historian_researcher', label: 'Historian Researcher' },
        { id: 'the_scoper', label: 'The Scoper' },
        { id: 'cfo_calculator', label: 'CFO Calculator' },
        { id: 'target_user', label: 'Target User' },
        { id: 'seed_investor', label: 'Seed Investor' },
        { id: 'growth_strategist', label: 'Growth Strategist' },
        { id: 'compliance_officer', label: 'Compliance Officer' },
        { id: 'devils_advocate', label: 'Devils Advocate' },
        { id: 'validator_optimist', label: 'Validator Optimist' },
        { id: 'the_refiner', label: 'The Refiner' },
        { id: 'the_judge', label: 'The Judge' }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2 tracking-tight">Execution Engine</h2>
                <p className="text-[var(--text-muted)]">Live LangGraph node execution flow.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 shadow-xl relative min-h-[500px]">
                    <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-6">Execution Graph</h3>

                    <div className="space-y-3 relative z-10">
                        {allNodes.map((n, index) => {
                            const count = nodeHistory.filter((i: string) => i === n.id).length;
                            const isDone = count > 0;
                            const isCurrent = nodeHistory[nodeHistory.length - 1] === n.id && isExecuting;

                            if (!isDone && !isCurrent && index > nodeHistory.length + 2) return null; // reveal slowly

                            return (
                                <motion.div
                                    key={index}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: isDone || isCurrent ? 1 : 0.3, x: 0 }}
                                    className={`p-4 rounded-xl border transition-all ${isCurrent ? 'bg-[rgba(0,210,255,0.1)] border-[var(--accent-blue)] shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                                            : isDone ? 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]'
                                                : 'bg-transparent border-dashed border-[rgba(255,255,255,0.05)]'
                                        } flex items-center justify-between`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-[var(--accent-blue)] animate-ping' : isDone ? 'bg-emerald-400' : 'bg-[var(--text-muted)] opacity-30'}`} />
                                        <span className={`font-mono text-sm ${isCurrent ? 'text-[var(--accent-blue)] font-bold' : isDone ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                                            {n.label} {count > 1 ? `(x${count})` : ''}
                                        </span>
                                    </div>
                                    {isDone && !isCurrent && <CheckCircle size={16} className="text-emerald-400" />}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <div className="glass-panel p-6 shadow-xl flex flex-col h-[500px]">
                    <h3 className="text-sm font-semibold text-[var(--accent-violet)] uppercase tracking-wider mb-4 flex items-center">
                        <TerminalSquare size={16} className="mr-2" /> Live State Stream
                    </h3>
                    <div className="flex-1 bg-[rgba(0,0,0,0.5)] rounded-lg p-4 font-mono text-xs overflow-y-auto text-emerald-400 border border-[rgba(255,255,255,0.05)]">
                        {nodeHistory.map((n: string, i: number) => (
                            <div key={i} className="mb-2 opacity-80">
                                <span className="text-[var(--text-muted)]">[{new Date().toLocaleTimeString()}]</span> <span className="text-purple-400">Node executed:</span> {n}
                            </div>
                        ))}
                        {isExecuting && (
                            <div className="animate-pulse flex items-center mt-2">
                                <span className="mr-2">Awaiting next chunk</span> <span className="tracking-widest">...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewTab({ state }: any) {
    return (
        <div className="space-y-6 max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">V1 Concept Document</h2>
            {state.v1_concept ? (
                <div className="glass-panel p-8 prose prose-invert max-w-none prose-a:text-[var(--accent-blue)]">
                    <ReactMarkdown>{state.v1_concept}</ReactMarkdown>
                </div>
            ) : (
                <p className="text-[var(--text-muted)] italic text-sm">V1 Concept is currently being generated...</p>
            )}
        </div>
    )
}

function MarketTab({ state }: any) {
    return (
        <div className="space-y-6 max-w-5xl">
            <h2 className="text-3xl font-bold mb-6">Market Reality</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard title="Competitor Matrix" content={state.competitor_matrix} />
                <GlassCard title="Market Trend Report" content={state.market_trend_report} />
                <GlassCard title="The Graveyard (Past Failures)" content={state.graveyard_lessons} className="md:col-span-2 border-red-900/30 shadow-[0_0_30px_rgba(255,0,0,0.05)]" />
            </div>
        </div>
    )
}

function StakeholdersTab({ state }: any) {
    return (
        <div className="space-y-6 max-w-5xl">
            <h2 className="text-3xl font-bold mb-6">Stakeholder Perspectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard title="Target User UX Friction" content={state.ux_friction_report} className="border-[rgba(0,210,255,0.2)]" />
                <GlassCard title="Seed Investor Report" content={state.investment_report} className="border-[rgba(140,82,255,0.2)]" />
                <GlassCard title="Growth Strategy" content={state.distribution_plan} className="border-emerald-500/20" />
            </div>
            <div className="mt-6">
                <GlassCard title="Unit Economics & Burn Rate" content={state.unit_economics} />
            </div>
        </div>
    )
}

function MADLoopTab({ state }: any) {
    return (
        <div className="space-y-6 max-w-4xl">
            <h2 className="text-3xl font-bold mb-2">The MAD Loop</h2>
            <p className="text-[var(--text-muted)] mb-6">Mutually Assured Destruction: Adversarial stress testing.</p>

            <div className="glass-panel p-8 relative overflow-hidden border-orange-500/20 shadow-[0_0_40px_rgba(255,165,0,0.05)]">
                <div className="absolute top-0 right-0 p-4 font-mono text-orange-400 text-sm font-bold opacity-30">DEVILS_ADVOCATE</div>
                <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center"><AlertOctagon className="mr-2" /> The Brutal Attack Vector</h3>
                {state.attack_vector ? (
                    <div className="prose prose-invert max-w-none text-orange-100/80 text-sm">
                        <ReactMarkdown>{state.attack_vector}</ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-[var(--text-muted)] italic text-sm">Awaiting phase 4 logic synthesis...</p>
                )}
            </div>

            <div className="text-center text-[var(--text-muted)] py-4 text-xs font-mono opacity-50">
                ↓ PIVOT & ADAPT ↓
            </div>

            <div className="glass-panel p-8 relative overflow-hidden border-[var(--accent-blue)] shadow-[0_0_40px_rgba(0,210,255,0.05)]">
                <div className="absolute top-0 right-0 p-4 font-mono text-[var(--accent-blue)] text-sm font-bold opacity-30">VALIDATOR_OPTIMIST</div>
                <h3 className="text-xl font-bold text-[var(--accent-blue)] mb-4 flex items-center"><CheckCircle className="mr-2" /> The Pivot</h3>
                {state.attack_vector ? (
                    <p className="text-sm text-blue-100/80">Check the 'Overview' tab! The optimist has updated the Concept Document to survive this attack.</p>
                ) : (
                    <p className="text-[var(--text-muted)] italic text-sm">Awaiting phase 4 response...</p>
                )}
            </div>
        </div>
    )
}

function VerdictTab({ state, isExecuting }: any) {
    if (isExecuting || !state.prd) {
        return (
            <div className="w-full h-[500px] flex flex-col items-center justify-center text-[var(--text-muted)]">
                <Target size={48} className="mb-4 opacity-20" />
                <p>The Judge is deliberating. Awaiting final PRD and verdict...</p>
            </div>
        )
    }

    const isGo = state.decision && state.decision.toLowerCase().includes('go') && !state.decision.toLowerCase().includes('no');
    const decisionColor = isGo ? 'text-emerald-400' : state.decision?.toLowerCase().includes('pivot') ? 'text-orange-400' : 'text-red-400';

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between glass-panel p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div>
                    <h2 className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-1">Final Decision</h2>
                    <h1 className={`text-6xl font-black ${decisionColor} drop-shadow-lg`}>{state.decision || "UNKNOWN"}</h1>
                </div>
                <div className="text-right max-w-md">
                    <h3 className="text-lg font-bold text-white mb-2">Golden Features</h3>
                    <ul className="text-sm text-emerald-300 space-y-1 list-disc list-inside">
                        {state.golden_features?.map((f: string, i: number) => <li key={i}>{f}</li>)}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-8">
                    <h3 className="text-xl font-bold mb-6 text-white border-b border-[var(--border-light)] pb-4">Professional PRD</h3>
                    <div className="prose prose-invert max-w-none text-sm prose-h3:text-[var(--accent-blue)]">
                        <ReactMarkdown>{state.prd}</ReactMarkdown>
                    </div>
                </div>

                <div className="glass-panel p-8 border-red-500/20 bg-red-900/10">
                    <h3 className="text-xl font-bold mb-6 text-red-400 flex items-center"><AlertOctagon className="mr-2" /> Unmitigated Risks</h3>
                    <ul className="space-y-4">
                        {state.unmitigated_risks?.map((r: string, i: number) => (
                            <li key={i} className="text-sm text-red-200/80 bg-red-950/40 p-3 rounded border border-red-900/50 leading-relaxed">
                                {r}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

function GlassCard({ title, content, className = '' }: { title: string, content: string, className?: string }) {
    return (
        <div className={`glass-panel p-6 flex flex-col items-start ${className}`}>
            <h3 className="text-lg font-bold text-white mb-4 w-full border-b border-[var(--border-light)] pb-3">{title}</h3>
            <div className="flex-1 w-full prose prose-invert prose-sm max-w-none">
                {content ? (
                    <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                    <div className="h-20 flex items-center justify-center italic text-[var(--text-muted)] text-xs">
                        Awaiting processing...
                    </div>
                )}
            </div>
        </div>
    );
}

// Temporary prop components
function TerminalSquare(props: any) { return <Code2 {...props} /> }
