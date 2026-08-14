'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
    HiOutlineDocumentText,
    HiOutlineBuildingOffice2,
    HiOutlineClock, 
    HiOutlineChevronDown,
    HiOutlineChevronUp,
    HiOutlineBeaker,
    HiOutlineMapPin,
    HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2';
import Link from 'next/link';

// Modular Components
import StageBadge from '@/components/applications/StageBadge';
import ScoreBar from '@/components/applications/ScoreBar';

// shadcn/ui
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const STAGE_LABELS = {
    applied: 'Application Received',
    shortlisted: 'Shortlisted by AI',
    coding_pending: 'Coding Test Pending',
    coding_passed: 'Coding Test Passed',
    ai_interview_pending: 'AI Interview Pending',
    ai_interview_passed: 'AI Interview Passed',
    real_interview_scheduled: 'Interview Scheduled',
    offered: 'Offer Extended',
    hired: 'Hired! 🎉',
    rejected: 'Not Selected',
};

function ScoreBreakdown({ stageResults }) {
    const sr = stageResults?.shortlist;
    if (!sr) return null;
    return (
        <div className="mt-4 p-4 rounded-2xl bg-card border-emerald-500/10 space-y-3">
            <p className="text-xs font-bold opacity-50">AI Match Breakdown</p>
            <ScoreBar label="Skills" value={sr.skills_score ?? 0} color="bg-emerald-500" />
            <ScoreBar label="Work Experience" value={sr.workexp_score ?? 0} color="bg-blue-500" />
            <ScoreBar label="Projects" value={sr.projects_score ?? 0} color="bg-purple-500" />
            <ScoreBar label="Summary" value={sr.summary_score ?? 0} color="bg-orange-400" />
        </div>
    );
}

function ApplicationCard({ app, index }) {
    const [expanded, setExpanded] = useState(false);
    const hasScore = app.shortlist_score != null;
    const router = useRouter();

    const handleStartChat = () => {
        router.push(`/chats/${app.application_id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
        <Card className="glass rounded-2xl bg-card border-emerald-500/10 hover:border-emerald-500/25 transition-all overflow-hidden p-0 gap-0">
            {/* Card Header */}
            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                        <HiOutlineBuildingOffice2 className="w-7 h-7" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold truncate group-hover:text-emerald-500 transition-colors">
                            {app.job_details?.job_title || 'Position'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5" />
                                {app.job_details?.organization_name || 'Organization'}
                            </span>
                            {app.job_details?.location && (
                                <span className="flex items-center gap-1">
                                    <HiOutlineMapPin className="w-3.5 h-3.5" />{app.job_details.location}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <HiOutlineClock className="w-3.5 h-3.5" />
                                Applied {new Date(app.applied_date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 shrink-0">
                    {hasScore && (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xl font-bold text-emerald-500">
                                {(app.shortlist_score * 100).toFixed(0)}%
                            </span>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                                AI Score
                            </Badge>
                        </div>
                    )}

                    {/* Stage badge */}
                    <div className="flex flex-col items-center gap-1">
                        <StageBadge stage={app.current_stage} />
                        <span className="text-[8px] font-bold uppercase opacity-40 tracking-tighter">
                            {STAGE_LABELS[app.current_stage]}
                        </span>
                    </div>

                    {/* Expand toggle */}
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setExpanded(x => !x)}
                        className="rounded-xl"
                    >
                        {expanded ? <HiOutlineChevronUp className="w-4 h-4" /> : <HiOutlineChevronDown className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-emerald-500/5"
                    >
                        <div className="p-6 bg-card space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs font-bold opacity-40">Status</p>
                                    <p className="font-bold mt-0.5 capitalize">{app.status.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold opacity-40">Stage</p>
                                    <p className="font-bold mt-0.5 text-emerald-500">{STAGE_LABELS[app.current_stage]}</p>
                                </div>
                                {app.shortlist_rank && (
                                    <div>
                                        <p className="text-xs font-bold opacity-40">AI Rank</p>
                                        <p className="font-bold mt-0.5">#{app.shortlist_rank}</p>
                                    </div>
                                )}
                            </div>

                            {/* AI Score Breakdown */}
                            {hasScore && <ScoreBreakdown stageResults={app.stage_results} />}

                            {/* CTAs */}
                            {app.current_stage === 'coding_pending' && (
                                <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <HiOutlineBeaker className="w-5 h-5 text-yellow-500" />
                                        <p className="text-sm font-bold text-yellow-500">You have a coding assessment waiting!</p>
                                    </div>
                                    <Button as-child='true' size="sm" className="rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 shrink-0">
                                        <Link href="/candidate/assessments">Take Test →</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Message Recruiter CTA */}
                            {app.status !== 'rejected' && app.current_stage !== 'applied' && (
                                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-4 mt-2">
                                    <div className="flex items-center gap-3">
                                        <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-blue-500" />
                                        <p className="text-sm font-bold text-blue-500">You can message the recruiter.</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={handleStartChat}
                                        className="rounded-xl bg-blue-500 text-white hover:bg-blue-600 shrink-0"
                                    >
                                        Message →
                                    </Button>
                                </div>
                            )}

                            {/* Rejection note */}
                            {app.current_stage === 'rejected' && app.rejection_reason && (
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                    <p className="text-xs font-bold text-red-400 mb-1">Feedback</p>
                                    <p className="text-sm text-muted-foreground">{app.rejection_reason}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
        </motion.div>
    );
}

export default function CandidateApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await api.get('/applications/');
                setApplications(data);
            } catch {
                setError('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const activeCount = applications.filter(a => !['rejected', 'hired'].includes(a.status)).length;
    const pendingTests = applications.filter(a => a.current_stage === 'coding_pending').length;

    const filtered = filter === 'all' ? applications
        : applications.filter(a => a.current_stage === filter || a.status === filter);

    if (loading) return (
        <div className="w-full px-4 md:px-8 space-y-8">
            <div>
                <Skeleton className="h-8 w-48 rounded-lg" />
                <Skeleton className="h-4 w-72 rounded mt-2" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-5 text-center gap-2">
                        <Skeleton className="h-8 w-16 rounded mx-auto" />
                        <Skeleton className="h-3 w-20 rounded mx-auto" />
                    </Card>
                ))}
            </div>
            <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-24 rounded-xl" />
                ))}
            </div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center gap-5">
                            <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-56 rounded" />
                                <Skeleton className="h-4 w-72 rounded" />
                            </div>
                            <Skeleton className="h-10 w-24 rounded-xl" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full px-4 md:px-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">My Applications</h1>
                <p className="text-muted-foreground mt-1">Track your pipeline across all applied positions</p>
            </div>

            {applications.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Applied', value: applications.length, color: 'text-foreground' },
                        { label: 'Active', value: activeCount, color: 'text-blue-400' },
                        { label: 'Tests Pending', value: pendingTests, color: 'text-yellow-500' },
                        { label: 'Shortlisted', value: applications.filter(a => a.current_stage === 'shortlisted').length, color: 'text-emerald-500' },
                    ].map(({ label, value, color }) => (
                        <Card key={label} className="glass p-5 rounded-2xl border-emerald-500/10 text-center gap-1">
                            <div className={`text-3xl font-bold ${color}`}>{value}</div>
                            <div className="text-xs font-semibold opacity-50 mt-1">{label}</div>
                        </Card>
                    ))}
                </div>
            )}

            {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>
            )}

            <div className="flex gap-2 flex-wrap">
                {['all', 'applied', 'shortlisted', 'coding_pending', 'rejected'].map(f => (
                    <Button
                        key={f}
                        size="sm"
                        variant={filter === f ? 'default' : 'secondary'}
                        onClick={() => setFilter(f)}
                        className={`rounded-xl text-xs font-bold capitalize ${filter === f ? 'shadow-lg shadow-emerald-600/20' : ''}`}
                    >
                        {f === 'all' ? `All (${applications.length})` : f.replace(/_/g, ' ')}
                    </Button>
                ))}
            </div>

            <div className="space-y-4">
                {filtered.map((app, i) => <ApplicationCard key={app.application_id} app={app} index={i} />)}
                {filtered.length === 0 && !loading && (
                    <Card className="py-24 text-center glass rounded-3xl border-dashed border-2">
                        <HiOutlineDocumentText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold">No Applications</h3>
                        <p className="text-muted-foreground mt-2 mb-8">
                            {filter === 'all' ? "You haven't applied to any jobs yet." : `No applications in the "${filter}" stage.`}
                        </p>
                        {filter === 'all' && (
                            <Button as-child='true' size="lg" className="rounded-2xl w-fit mx-auto">
                                <Link href="/jobs">Browse Jobs</Link>
                            </Button>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
}