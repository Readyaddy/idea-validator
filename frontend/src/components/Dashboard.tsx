import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, LayoutDashboard, Target, Users, AlertOctagon, CheckCircle,
    Play, Compass, Lightbulb, Search, TrendingUp, Skull, ListChecks,
    DollarSign, UserCircle, Landmark, Rocket, ShieldAlert, Swords, Shield,
    FileText, Gavel, Star, AlertTriangle, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DashboardProps {
    state: any;
    nodeHistory: string[];
    isExecuting: boolean;
    onShowHistory?: () => void;
    onNewIdea?: () => void;
}

// ─── Agent Config ──────────────────────────────────────────────────────────────

const AGENT_CONFIG: Record<string, { label: string; role: string; icon: React.ReactNode; color: string; phase: number }> = {
    vision_aligner:       { label: 'Vision Aligner',       role: 'Startup Advisor',          icon: <Compass size={18} />,      color: 'var(--agent-vision)',     phase: 1 },
    idea_expander:        { label: 'Idea Expander',        role: 'Product Strategist',       icon: <Lightbulb size={18} />,    color: 'var(--agent-expander)',   phase: 1 },
    data_gatherer:        { label: 'Data Gatherer',        role: 'Competitive Intel Analyst', icon: <Search size={18} />,       color: 'var(--agent-data)',       phase: 2 },
    market_analyst:       { label: 'Market Analyst',       role: 'Gartner-style Researcher', icon: <TrendingUp size={18} />,   color: 'var(--agent-market)',     phase: 2 },
    historian_researcher: { label: 'Historian Researcher', role: 'Post-Mortem Analyst',      icon: <Skull size={18} />,        color: 'var(--agent-historian)',  phase: 2 },
    the_scoper:           { label: 'The Scoper',           role: 'Ruthless PM',              icon: <ListChecks size={18} />,   color: 'var(--agent-scoper)',     phase: 2 },
    cfo_calculator:       { label: 'CFO Calculator',       role: 'Startup CFO',              icon: <DollarSign size={18} />,   color: 'var(--agent-cfo)',        phase: 2 },
    target_user:          { label: 'Target User',          role: 'UX Researcher (as User)',   icon: <UserCircle size={18} />,   color: 'var(--agent-user)',       phase: 3 },
    seed_investor:        { label: 'Seed Investor',        role: 'VC Partner',               icon: <Landmark size={18} />,     color: 'var(--agent-investor)',   phase: 3 },
    growth_strategist:    { label: 'Growth Strategist',    role: 'Growth Hacker',            icon: <Rocket size={18} />,       color: 'var(--agent-growth)',     phase: 3 },
    compliance_officer:   { label: 'Compliance Officer',   role: 'Regulatory Counsel',       icon: <ShieldAlert size={18} />,  color: 'var(--agent-compliance)', phase: 3 },
    devils_advocate:      { label: "Devil's Advocate",     role: 'Red-Team Analyst',         icon: <Swords size={18} />,       color: 'var(--agent-devil)',      phase: 4 },
    validator_optimist:   { label: 'Validator Optimist',   role: 'Battle-Tested CTO',        icon: <Shield size={18} />,       color: 'var(--agent-validator)',  phase: 4 },
    the_refiner:          { label: 'The Refiner',          role: 'Technical Writer',         icon: <FileText size={18} />,     color: 'var(--agent-refiner)',    phase: 5 },
    the_judge:            { label: 'The Judge',            role: 'Chief Decision Officer',   icon: <Gavel size={18} />,        color: 'var(--agent-judge)',      phase: 5 },
};

const PHASE_LABELS: Record<number, { title: string; description: string }> = {
    1: { title: 'Inception & Alignment', description: 'Clarify the vision and define the core concept' },
    2: { title: 'Data & Market Engine', description: 'Research competition, market, history, scope, and unit economics' },
    3: { title: 'Stakeholder Reality Check', description: 'Simulate users, investors, growth leads, and regulators' },
    4: { title: 'The Crucible (MAD Loop)', description: 'Adversarial stress-testing: attack, defend, evolve — 3 rounds' },
    5: { title: 'Synthesis & Verdict', description: 'Refine the PRD and deliver the final GO / NO-GO / PIVOT decision' },
};

const ALL_NODE_IDS = [
    'vision_aligner', 'idea_expander', 'data_gatherer', 'market_analyst',
    'historian_researcher', 'the_scoper', 'cfo_calculator', 'target_user',
    'seed_investor', 'growth_strategist', 'compliance_officer',
    'devils_advocate', 'validator_optimist', 'the_refiner', 'the_judge'
];

// ─── Shared Components ─────────────────────────────────────────────────────────

function AgentHeader({ agentId }: { agentId: string }) {
    const config = AGENT_CONFIG[agentId];
    if (!config) return null;

    return (
        <div className="agent-header">
            <div
                className="agent-avatar"
                style={{ background: `${config.color}18`, color: config.color, border: `1px solid ${config.color}30` }}
            >
                {config.icon}
            </div>
            <div>
                <div className="agent-name" style={{ color: config.color }}>{config.label}</div>
                <div className="agent-role">{config.role}</div>
            </div>
        </div>
    );
}

function SectionCard({ agentId, children, className = '' }: { agentId: string; children: React.ReactNode; className?: string }) {
    const config = AGENT_CONFIG[agentId];
    const accentColor = config?.color || 'var(--accent-violet)';

    return (
        <div
            className={`section-card p-6 ${className}`}
            style={{ '--card-accent': accentColor } as React.CSSProperties}
        >
            {agentId && <AgentHeader agentId={agentId} />}
            {children}
        </div>
    );
}

function ExpandableMarkdown({ content, summary, maxHeight = 280 }: { content: string; summary?: string; maxHeight?: number }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = content.length > 800;

    return (
        <div className="relative space-y-4">
            {summary && (
                <div className="px-4 py-3 rounded-lg text-sm leading-relaxed"
                     style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: 'var(--accent-blue)' }}>
                        <Zap size={10} fill="currentColor" /> Executive Summary
                    </div>
                    {summary}
                </div>
            )}
            <div
                className="prose-custom overflow-hidden transition-all duration-300"
                style={{ maxHeight: expanded || !isLong ? 'none' : `${maxHeight}px` }}
            >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
            {isLong && !expanded && <div className="expandable-gradient" />}
            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{ color: 'var(--accent-blue)' }}
                >
                    {expanded ? <><ChevronUp size={14} /> Show full report</> : <><ChevronDown size={14} /> Read full report</>}
                </button>
            )}
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="py-8 space-y-3">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-5/6" />
            <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>{label}</p>
        </div>
    );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────

export default function Dashboard({ state, nodeHistory, isExecuting, onShowHistory, onNewIdea }: DashboardProps) {
    const [activeTab, setActiveTab] = useState('execution');

    const tabs = [
        { id: 'execution',    label: 'Execution',    icon: <Activity size={17} /> },
        { id: 'overview',     label: 'Overview',     icon: <LayoutDashboard size={17} /> },
        { id: 'market',       label: 'Market',       icon: <Target size={17} /> },
        { id: 'stakeholders', label: 'Stakeholders', icon: <Users size={17} /> },
        { id: 'madloop',      label: 'MAD Loop',     icon: <AlertOctagon size={17} /> },
        { id: 'verdict',      label: 'Verdict',      icon: <CheckCircle size={17} /> },
    ];

    const completedCount = nodeHistory.filter(n => ALL_NODE_IDS.includes(n)).length;
    const totalNodes = 17; // 15 base + up to 2 extra MAD loop iterations
    const progress = Math.min((completedCount / totalNodes) * 100, 100);

    return (
        <div className="w-full h-screen flex text-white overflow-hidden" style={{ background: 'var(--bg-dark)' }}>
            {/* ── Sidebar ────────────────────────────────── */}
            <div className="w-[270px] flex flex-col p-5 z-10 shrink-0 border-r" style={{ background: 'var(--bg-panel-solid)', borderColor: 'var(--border-subtle)' }}>
                {/* Logo */}
                <div className="mb-8">
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))' }}>
                            <Zap size={16} color="black" strokeWidth={2.5} />
                        </div>
                        <h1 className="font-bold text-lg tracking-tight">Idea Validator</h1>
                    </div>
                </div>

                {/* Idea preview */}
                <div className="mb-6 p-3 rounded-lg text-xs leading-relaxed" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <span className="italic line-clamp-3">"{state.raw_input || 'Initializing...'}"</span>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Progress</span>
                        <span className="text-[11px] font-mono font-medium" style={{ color: 'var(--accent-blue)' }}>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg transition-all text-sm"
                            style={{
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--text-main)' : 'var(--text-muted)',
                                fontWeight: activeTab === tab.id ? 600 : 400,
                            }}
                        >
                            <span style={{ color: activeTab === tab.id ? 'var(--accent-blue)' : 'inherit' }}>{tab.icon}</span>
                            <span>{tab.label}</span>
                            {tab.id === 'execution' && isExecuting && (
                                <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-violet)' }} />
                            )}
                        </button>
                    ))}

                    <div className="pt-6 pb-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider px-3.5 mb-2" style={{ color: 'var(--text-muted)' }}>
                            Actions
                        </div>
                        {onShowHistory && (
                            <button
                                onClick={onShowHistory}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.1 rounded-lg transition-all text-sm mb-1"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <span style={{ color: 'var(--text-muted)' }}><LayoutDashboard size={17} /></span>
                                <span>View History</span>
                            </button>
                        )}
                        {onNewIdea && (
                            <button
                                onClick={onNewIdea}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.1 rounded-lg transition-all text-sm"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <span style={{ color: 'var(--text-muted)' }}><Lightbulb size={17} /></span>
                                <span>New Idea</span>
                            </button>
                        )}
                    </div>
                </nav>

                {/* Status footer */}
                <div className="mt-auto pt-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <span>Status</span>
                        {isExecuting ? (
                            <span className="flex items-center gap-1" style={{ color: 'var(--accent-violet)' }}>
                                <Play size={10} className="animate-pulse" /> Running
                            </span>
                        ) : (
                            <span className="flex items-center gap-1" style={{ color: 'var(--accent-emerald)' }}>
                                <CheckCircle size={10} /> Complete
                            </span>
                        )}
                    </div>
                    <div className="mt-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        Agents completed: <span className="font-mono font-medium text-white">{completedCount}</span>
                    </div>
                </div>
            </div>

            {/* ── Main Content ───────────────────────────── */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: 'var(--accent-violet)', opacity: 0.02, filter: 'blur(150px)' }} />

                <div className="flex-1 overflow-y-auto p-8 z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'execution' && <ExecutionTab nodeHistory={nodeHistory} isExecuting={isExecuting} />}
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

// ─── Tab: Execution Engine ──────────────────────────────────────────────────────

function ExecutionTab({ nodeHistory, isExecuting }: { nodeHistory: string[]; isExecuting: boolean }) {
    const phases = [1, 2, 3, 4, 5];

    return (
        <div className="max-w-5xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Execution Engine</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Live agent pipeline — each node runs sequentially through 5 phases.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Execution graph */}
                <div className="xl:col-span-2 section-card p-6" style={{ '--card-accent': 'var(--accent-blue)' } as React.CSSProperties}>
                    <div className="space-y-6">
                        {phases.map(phase => {
                            const phaseInfo = PHASE_LABELS[phase];
                            const phaseNodes = ALL_NODE_IDS.filter(id => AGENT_CONFIG[id]?.phase === phase);

                            return (
                                <div key={phase}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono"
                                            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                                            PHASE {phase}
                                        </span>
                                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{phaseInfo.title}</span>
                                    </div>

                                    <div className="space-y-1.5 ml-1">
                                        {phaseNodes.map(nodeId => {
                                            const config = AGENT_CONFIG[nodeId];
                                            const count = nodeHistory.filter(n => n === nodeId).length;
                                            const isDone = count > 0;
                                            const lastNode = nodeHistory[nodeHistory.length - 1];
                                            const isCurrent = lastNode === nodeId && isExecuting;

                                            return (
                                                <motion.div
                                                    key={nodeId}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all"
                                                    style={{
                                                        background: isCurrent ? `${config.color}10` : isDone ? 'rgba(255,255,255,0.02)' : 'transparent',
                                                        border: isCurrent ? `1px solid ${config.color}30` : '1px solid transparent',
                                                    }}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'animate-pulse' : ''}`}
                                                        style={{
                                                            background: isCurrent ? config.color : isDone ? 'var(--accent-emerald)' : 'var(--text-muted)',
                                                            opacity: isDone || isCurrent ? 1 : 0.25,
                                                            boxShadow: isCurrent ? `0 0 8px ${config.color}60` : 'none',
                                                        }}
                                                    />
                                                    <span className="text-xs font-medium" style={{
                                                        color: isCurrent ? config.color : isDone ? 'var(--text-main)' : 'var(--text-muted)',
                                                        opacity: isDone || isCurrent ? 1 : 0.5,
                                                    }}>
                                                        {config.label} {count > 1 ? `(×${count})` : ''}
                                                    </span>
                                                    {isDone && !isCurrent && <CheckCircle size={13} className="ml-auto" style={{ color: 'var(--accent-emerald)' }} />}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Live stream */}
                <div className="section-card p-5 flex flex-col" style={{ '--card-accent': 'var(--accent-violet)', maxHeight: '600px' } as React.CSSProperties}>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5"
                        style={{ color: 'var(--accent-violet)' }}>
                        <Activity size={13} /> Event Stream
                    </h3>
                    <div className="flex-1 rounded-lg p-3 font-mono text-[11px] overflow-y-auto leading-relaxed"
                        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)' }}>
                        {nodeHistory.map((n, i) => {
                            const config = AGENT_CONFIG[n];
                            return (
                                <div key={i} className="mb-1.5 flex gap-2">
                                    <span style={{ color: 'var(--text-muted)' }}>{String(i + 1).padStart(2, '0')}</span>
                                    <span style={{ color: config?.color || 'var(--accent-emerald)' }}>●</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{config?.label || n}</span>
                                </div>
                            );
                        })}
                        {isExecuting && (
                            <div className="mt-2 animate-pulse flex items-center gap-2" style={{ color: 'var(--accent-blue)' }}>
                                <span>▍</span> <span>awaiting next agent...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Tab: Overview ──────────────────────────────────────────────────────────────

function OverviewTab({ state }: { state: any }) {
    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">V1 Concept Document</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    The Idea Expander synthesized your answers into a structured concept document.
                </p>
            </div>

            {state.v1_concept ? (
                <SectionCard agentId="idea_expander" className="max-w-none">
                    <ExpandableMarkdown content={state.v1_concept} summary={state.summaries?.idea_expander} maxHeight={500} />
                </SectionCard>
            ) : (
                <SectionCard agentId="idea_expander">
                    <EmptyState label="Concept document is being generated..." />
                </SectionCard>
            )}

            {state.mvp_scope && (
                <SectionCard agentId="the_scoper">
                    <ExpandableMarkdown content={state.mvp_scope} summary={state.summaries?.the_scoper} maxHeight={350} />
                </SectionCard>
            )}
        </div>
    );
}

// ─── Tab: Market Reality ────────────────────────────────────────────────────────

function MarketTab({ state }: { state: any }) {
    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Market Reality</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Deep market intelligence from 4 specialized research agents.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard agentId="data_gatherer">
                    {state.competitor_matrix
                        ? <ExpandableMarkdown content={state.competitor_matrix} summary={state.summaries?.data_gatherer} />
                        : <EmptyState label="Competitor intelligence in progress..." />}
                </SectionCard>

                <SectionCard agentId="market_analyst">
                    {state.market_trend_report
                        ? <ExpandableMarkdown content={state.market_trend_report} summary={state.summaries?.market_analyst} />
                        : <EmptyState label="Market analysis in progress..." />}
                </SectionCard>

                <SectionCard agentId="historian_researcher">
                    {state.graveyard_lessons
                        ? <ExpandableMarkdown content={state.graveyard_lessons} summary={state.summaries?.historian_researcher} />
                        : <EmptyState label="Historical analysis in progress..." />}
                </SectionCard>

                <SectionCard agentId="cfo_calculator">
                    {state.unit_economics
                        ? <ExpandableMarkdown content={state.unit_economics} summary={state.summaries?.cfo_calculator} />
                        : <EmptyState label="Financial modeling in progress..." />}
                </SectionCard>
            </div>
        </div>
    );
}

// ─── Tab: Stakeholders ──────────────────────────────────────────────────────────

function StakeholdersTab({ state }: { state: any }) {
    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Stakeholder Perspectives</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Simulated feedback from key stakeholders who would evaluate your product.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard agentId="target_user">
                    {state.ux_friction_report
                        ? <ExpandableMarkdown content={state.ux_friction_report} summary={state.summaries?.target_user} />
                        : <EmptyState label="User simulation in progress..." />}
                </SectionCard>

                <SectionCard agentId="seed_investor">
                    {state.investment_report
                        ? <ExpandableMarkdown content={state.investment_report} summary={state.summaries?.seed_investor} />
                        : <EmptyState label="Investment analysis in progress..." />}
                </SectionCard>

                <SectionCard agentId="growth_strategist">
                    {state.distribution_plan
                        ? <ExpandableMarkdown content={state.distribution_plan} summary={state.summaries?.growth_strategist} />
                        : <EmptyState label="Growth strategy in progress..." />}
                </SectionCard>

                <SectionCard agentId="compliance_officer">
                    {state.compliance_report
                        ? <ExpandableMarkdown content={state.compliance_report} summary={state.summaries?.compliance_officer} />
                        : <EmptyState label="Compliance check in progress..." />}
                </SectionCard>
            </div>
        </div>
    );
}

// ─── Tab: MAD Loop ──────────────────────────────────────────────────────────────

function MADLoopTab({ state }: { state: any }) {
    const loopCount = state.loop_count || 0;

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">The MAD Loop</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Mutually Assured Destruction — adversarial stress-testing in {loopCount || 3} rounds.
                </p>
            </div>

            {/* Round indicator */}
            <div className="flex items-center gap-3">
                {[1, 2, 3].map(round => (
                    <div
                        key={round}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-mono"
                        style={{
                            background: round <= loopCount ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255,255,255,0.03)',
                            border: round <= loopCount ? '1px solid rgba(249, 115, 22, 0.25)' : '1px solid var(--border-subtle)',
                            color: round <= loopCount ? 'var(--accent-orange)' : 'var(--text-muted)',
                        }}
                    >
                        Round {round} {round <= loopCount ? '✓' : ''}
                    </div>
                ))}
            </div>

            {/* Attack */}
            <SectionCard agentId="devils_advocate">
                {state.attack_vector ? (
                    <ExpandableMarkdown content={state.attack_vector} summary={state.summaries?.devils_advocate} maxHeight={350} />
                ) : (
                    <EmptyState label="Awaiting adversarial analysis..." />
                )}
            </SectionCard>

            {/* VS Divider */}
            <div className="flex items-center gap-4 py-1">
                <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold font-mono"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <Swords size={13} style={{ color: 'var(--agent-devil)' }} />
                    VS
                    <Shield size={13} style={{ color: 'var(--agent-validator)' }} />
                </div>
                <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            </div>

            {/* Defense */}
            <SectionCard agentId="validator_optimist">
                {state.v1_concept && state.attack_vector ? (
                    <div>
                        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-xs font-mono"
                            style={{ background: 'rgba(0, 210, 255, 0.05)', border: '1px solid rgba(0, 210, 255, 0.15)', color: 'var(--accent-blue)' }}>
                            <Shield size={13} />
                            Evolved concept after {loopCount} round{loopCount !== 1 ? 's' : ''} of adversarial stress-testing
                        </div>
                        <ExpandableMarkdown content={state.v1_concept} summary={state.summaries?.validator_optimist} maxHeight={350} />
                    </div>
                ) : (
                    <EmptyState label="Awaiting defense response..." />
                )}
            </SectionCard>
        </div>
    );
}

// ─── Tab: Final Verdict ─────────────────────────────────────────────────────────

function VerdictTab({ state, isExecuting }: { state: any; isExecuting: boolean }) {
    if (isExecuting || !state.prd) {
        return (
            <div className="max-w-4xl">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-1">Final Verdict</h2>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        The Judge is deliberating. Awaiting final PRD and verdict...
                    </p>
                </div>
                <div className="mt-8 flex flex-col items-center justify-center py-20" style={{ color: 'var(--text-muted)' }}>
                    <Gavel size={48} className="mb-4 opacity-20 animate-pulse" />
                    <p className="text-sm">All agents must complete before the verdict is rendered.</p>
                </div>
            </div>
        );
    }

    const decision = state.decision || 'UNKNOWN';
    const isGo = decision.toLowerCase().includes('go') && !decision.toLowerCase().includes('no');
    const isPivot = decision.toLowerCase().includes('pivot');
    const verdictClass = isGo ? 'verdict-go' : isPivot ? 'verdict-pivot' : 'verdict-nogo';

    return (
        <div className="max-w-5xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Final Verdict</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    The Judge's board-level decision after full pipeline analysis.
                </p>
            </div>

            {/* Hero verdict */}
            <div className="section-card p-8" style={{
                '--card-accent': isGo ? 'var(--accent-emerald)' : isPivot ? 'var(--accent-amber)' : 'var(--accent-rose)',
                background: isGo ? 'rgba(52,211,153,0.03)' : isPivot ? 'rgba(251,191,36,0.03)' : 'rgba(251,113,133,0.03)',
            } as React.CSSProperties}>
                <div className="flex items-start justify-between gap-8 flex-wrap">
                    <div>
                        <div className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                            Board Decision
                        </div>
                        <div className={`verdict-badge text-5xl md:text-6xl ${verdictClass}`}>
                            {decision}
                        </div>
                    </div>

                    {/* Golden features */}
                    {state.golden_features && state.golden_features.length > 0 && (
                        <div className="flex-1 min-w-[280px]">
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--accent-amber)' }}>
                                <Star size={14} /> Golden Features
                            </h3>
                            <div className="space-y-2">
                                {state.golden_features.map((f: string, i: number) => (
                                    <div key={i} className="flex items-start gap-2.5 text-sm px-3 py-2 rounded-lg"
                                        style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.12)' }}>
                                        <Star size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-amber)' }} />
                                        <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PRD + Risks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* PRD */}
                <div className="lg:col-span-2">
                    <SectionCard agentId="the_refiner">
                        <ExpandableMarkdown content={state.prd} summary={state.summaries?.the_refiner} maxHeight={400} />
                    </SectionCard>
                </div>

                {/* Unmitigated risks */}
                <div className="section-card p-0 overflow-hidden" style={{
                    '--card-accent': '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    boxShadow: '0 0 25px rgba(239, 68, 68, 0.08), inset 0 0 60px rgba(239, 68, 68, 0.03)',
                } as React.CSSProperties}>
                    {/* Danger header */}
                    <div className="px-6 py-4 flex items-center gap-3" style={{
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(185,28,28,0.1) 100%)',
                        borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                    }}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}>
                            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
                        </div>
                        <div>
                            <div className="font-bold text-sm" style={{ color: '#ef4444' }}>⚠ UNMITIGATED RISKS</div>
                            <div className="text-[11px]" style={{ color: 'rgba(239,68,68,0.6)' }}>Active threats — not resolved</div>
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        {state.unmitigated_risks?.map((r: string, i: number) => (
                            <div key={i} className="text-sm p-4 rounded-lg leading-relaxed relative"
                                style={{
                                    background: 'rgba(239,68,68,0.06)',
                                    border: '1px solid rgba(239,68,68,0.15)',
                                    borderLeft: '3px solid #ef4444',
                                    color: 'var(--text-secondary)',
                                }}>
                                <div className="flex items-start gap-3">
                                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0"
                                        style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                                        RISK {i + 1}
                                    </span>
                                    <span>{r}</span>
                                </div>
                            </div>
                        ))}
                        {(!state.unmitigated_risks || state.unmitigated_risks.length === 0) && (
                            <EmptyState label="Risk analysis pending..." />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
