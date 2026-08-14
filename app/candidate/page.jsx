'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@/utils/api';
import { motion } from 'motion/react';
import {
  HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineStar, HiOutlineCheckCircle,
  HiOutlineClock, HiOutlineChevronRight, HiOutlineDocumentDuplicate, HiOutlineChartBar,
  HiOutlineVideoCamera, HiOutlineAcademicCap, HiOutlineExclamationTriangle,
  HiOutlineArrowRight, HiOutlineMagnifyingGlass, HiOutlinePlus,
  HiOutlineChatBubbleLeftEllipsis, HiOutlineCodeBracket, HiOutlineMap, HiOutlineFire,
  HiOutlineShieldCheck, HiOutlinePaperAirplane, HiOutlineFlag,
} from 'react-icons/hi2';
import Link from 'next/link';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

const ICON_MAP = {
  HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineStar,
  HiOutlineBriefcase, HiOutlineVideoCamera, HiOutlineAcademicCap, HiOutlineClock,
};
const STAGE_ICONS = [
  HiOutlineBriefcase, HiOutlineShieldCheck, HiOutlineCodeBracket,
  HiOutlineChatBubbleLeftEllipsis, HiOutlineVideoCamera, HiOutlinePaperAirplane,
];
const ACTIVITY_ICONS = {
  success: HiOutlineCheckCircle, offer: HiOutlinePaperAirplane,
  interview: HiOutlineVideoCamera, ai: HiOutlineChatBubbleLeftEllipsis,
  assessment: HiOutlineAcademicCap, rejection: HiOutlineExclamationTriangle,
  pending: HiOutlineClock, application: HiOutlineDocumentText,
};

/* ── Stat Card ── */
function StatCard({ stat, index }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-purple-500/10 text-purple-400',
  };
  const Icon = ICON_MAP[stat.icon] || HiOutlineDocumentText;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="min-w-0 h-full">
      <Card className="h-full rounded-2xl border-border relative overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/20 transition-all">
        <CardContent className="p-5 sm:p-6">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${colors[stat.color]} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <HiOutlineChevronRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-emerald-500/50 transition-all shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 truncate">{stat.value}</div>
          <div className="text-[11px] sm:text-xs lg:text-sm text-muted-foreground font-bold uppercase tracking-widest truncate">{stat.label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Stage Badge ── */
function StageBadge({ stage }) {
  const styles = {
    Applied: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Shortlisted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Coding Pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Coding Passed': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Ai Interview Pending': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'Ai Interview Passed': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'Real Interview Scheduled': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    Offered: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Hired: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };
  return (
    <Badge variant="outline" className={`text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider border shrink-0 max-w-[110px] sm:max-w-[160px] truncate ${styles[stage] || 'bg-secondary text-muted-foreground border-border'}`}>
      {stage}
    </Badge>
  );
}

/* ── Journey Bar ── */
function JourneyBar({ label, value, max, index }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const colors = [
    'from-blue-500 to-blue-400', 'from-emerald-500 to-emerald-400',
    'from-amber-500 to-amber-400', 'from-violet-500 to-violet-400',
    'from-cyan-500 to-cyan-400', 'from-purple-500 to-purple-400',
  ];
  const Icon = STAGE_ICONS[index] || HiOutlineFlag;
  const iconColors = ['text-blue-500', 'text-emerald-500', 'text-amber-500', 'text-violet-500', 'text-cyan-500', 'text-purple-400'];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.06 }}
      className="flex items-center gap-2 group cursor-pointer hover:bg-secondary/20 p-1.5 rounded-lg transition-colors">
      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 ${iconColors[index]}`}>
        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5 gap-2">
          <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground truncate">{label}</span>
          <span className="text-[10px] sm:text-xs font-bold shrink-0">{value}</span>
        </div>
        <div className="h-1 sm:h-1.5 bg-secondary/40 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${colors[index]}`} />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Activity Item ── */
function ActivityItem({ a, i }) {
  const Icon = ACTIVITY_ICONS[a.type] || HiOutlineClock;
  const iconColors = {
    success: 'bg-emerald-500/10 text-emerald-500', offer: 'bg-purple-500/10 text-purple-400',
    interview: 'bg-cyan-500/10 text-cyan-500', ai: 'bg-violet-500/10 text-violet-500',
    assessment: 'bg-emerald-500/10 text-emerald-500', rejection: 'bg-rose-500/10 text-rose-500',
    pending: 'bg-amber-500/10 text-amber-500', application: 'bg-blue-500/10 text-blue-500',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
      className="flex items-start gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-secondary/20 transition-colors group cursor-pointer">
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${iconColors[a.type] || 'bg-secondary text-muted-foreground'} group-hover:scale-110 transition-transform`}>
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm leading-relaxed text-foreground/80 break-words">{a.text}</p>
        <span className="text-[10px] sm:text-[11px] text-muted-foreground/50 flex items-center gap-1 mt-0.5">
          <HiOutlineClock className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> {a.time}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Profile Donut ── */
function ProfileDonut({ value = 0 }) {
  const pieData = useMemo(() => [
    { label: 'filled', value: Math.max(0, Math.min(100, value)) },
    { label: 'empty', value: Math.max(0, 100 - Math.max(0, Math.min(100, value))) },
  ], [value]);
  return (
    <svg width={100} height={100} className="shrink-0 sm:w-[120px] sm:h-[120px]">
      <Group top={50} left={50}>
        <Pie data={pieData} pieValue={(d) => d.value} outerRadius={48} innerRadius={38} cornerRadius={4} padAngle={0.02}>
          {(pie) => pie.arcs.map((arc, i) => (
            <path key={i} d={pie.path(arc) || ''} fill={arc.data.label === 'filled' ? '#10b981' : 'rgba(128,128,128,0.15)'} />
          ))}
        </Pie>
        <text textAnchor="middle" dominantBaseline="central" fill="#10b981" fontSize={18} fontWeight={600} style={{ fontFamily: 'inherit' }}>
          {value}%
        </text>
      </Group>
    </svg>
  );
}

/* ── Skeleton ── */
function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-6 sm:h-8 w-full max-w-xs rounded-lg" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </div>
      <div className="flex gap-2 overflow-hidden">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-lg shrink-0" />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="rounded-2xl border-border min-w-0">
            <CardContent className="p-5 flex items-center gap-4">
              <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-5 w-12 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="lg:col-span-3 rounded-2xl border-border min-w-0">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-5 w-28 rounded" />
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-full rounded" />)}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 rounded-2xl border-border min-w-0">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-5 w-20 rounded" />
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-11 w-full rounded-lg" />)}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="rounded-2xl border-border min-w-0">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-36 rounded" />
              {[...Array(3)].map((_, j) => <Skeleton key={j} className="h-14 w-full rounded-xl" />)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══ Main ═══ */
export default function CandidateDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/accounts/candidate/dashboard/');
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground px-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center">
          <HiOutlineExclamationTriangle className="w-7 h-7 text-rose-500" />
        </div>
        <p className="text-sm font-medium text-center">Failed to load dashboard.</p>
        <Button onClick={() => window.location.reload()} variant="outline"
          className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-600 rounded-xl">
          Try Again
        </Button>
      </div>
    );
  }

  const { user, stats, stageBreakdown, recentApplications, upcomingInterviews, assessments, aiInterviews, activity, summary } = data;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const maxStage = Math.max(...(stageBreakdown || []).map((s) => s.value), 1);

  const quickActions = [
    { label: 'Browse Jobs', icon: HiOutlineMagnifyingGlass, href: '/jobs', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' },
    { label: 'Upload Resume', icon: HiOutlinePlus, href: '/candidate/resumes', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20' },
    { label: 'Applications', icon: HiOutlineDocumentText, href: '/candidate/applications', color: 'bg-violet-500/10 text-violet-500 border-violet-500/20 hover:bg-violet-500/20' },
  ];

  return (
    /* overflow-x-clip = final guard: kills any horizontal scroll on this page */
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0 overflow-x-clip">

      {/* ═══ Header ══ */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <HiOutlineFire className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight truncate">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm lg:text-lg flex items-center gap-1.5 sm:gap-2 min-w-0">
            <HiOutlineClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{today}</span>
          </p>
        </div>
      </div>

      {/* ═══ Quick Actions — plain scroll row, no ScrollArea ═══ */}
      <div className="hidden lg:flex items-center gap-2">
        {quickActions.map((a) => (
          <Button key={a.label} variant="outline" size="sm" as-child='true' className={`rounded-xl border text-xs font-semibold ${a.color}`}>
            <Link href={a.href} className="flex items-center gap-1.5">
              <a.icon className="w-3.5 h-3.5" /> {a.label}
            </Link>
          </Button>
        ))}
      </div>
      <div className="lg:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 w-max pb-1">
          {quickActions.map((a) => (
            <Button key={a.label} variant="outline" size="sm" as-child='true' className={`rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 ${a.color}`}>
              <Link href={a.href} className="flex items-center gap-1.5">
                <a.icon className="w-3.5 h-3.5" /> {a.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* ═══ Stats ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {(stats || []).map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ═══ Journey + Overview ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="lg:col-span-3 rounded-2xl border-border min-w-0">
          <CardHeader className="pb-2 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                <HiOutlineMap className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg font-bold truncate">Your Journey</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs truncate">Progress across stages</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5 sm:space-y-2 p-4 sm:p-6 pt-0">
            {(stageBreakdown || []).map((s, i) => (
              <JourneyBar key={s.label} label={s.label} value={s.value} max={maxStage} index={i} />
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-2xl border-border min-w-0">
          <CardHeader className="pb-2 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <HiOutlineChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg font-bold truncate">Overview</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs truncate">At a glance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
            {[
              { label: 'Applications', value: (stats || []).find((s) => s.label === 'Applications')?.value || 0 },
              { label: 'Interviews', value: (upcomingInterviews || []).length },
              { label: 'Assessments', value: assessments?.completed || 0 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-2 p-3 sm:p-4 bg-secondary/20 rounded-xl">
                <span className="text-xs sm:text-sm font-bold text-muted-foreground truncate">{row.label}</span>
                <span className="text-base sm:text-lg font-bold shrink-0">{row.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ═══ Applications + Interviews ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Applications */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <HiOutlineBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold truncate">Recent Applications</h2>
            </div>
            <Button variant="ghost" size="sm" as-child='true' className="text-emerald-500 hover:bg-emerald-500/10 font-bold shrink-0">
              <Link href="/candidate/applications" className="flex items-center gap-1">
                <span className="hidden sm:inline">View All</span>
                <span className="sm:hidden">All</span>
                <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {(recentApplications || []).slice(0, 4).map((app, i) => {
              const stageKey = (app.stage || '').toLowerCase().replace(/\s+/g, '_');
              const StageIcon = stageKey.includes('shortlist') ? HiOutlineShieldCheck :
                stageKey.includes('coding') ? HiOutlineCodeBracket :
                stageKey.includes('ai') ? HiOutlineChatBubbleLeftEllipsis :
                stageKey.includes('interview') ? HiOutlineVideoCamera :
                stageKey.includes('offer') ? HiOutlinePaperAirplane :
                stageKey.includes('hire') ? HiOutlineCheckCircle :
                stageKey.includes('reject') ? HiOutlineExclamationTriangle :
                HiOutlineBriefcase;
              return (
                <motion.div key={app.application_id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="rounded-xl border-border group hover:border-emerald-500/20 hover:shadow-md transition-all cursor-pointer overflow-hidden min-w-0">
                    <CardContent className="p-3 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-secondary flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shrink-0">
                          <HiOutlineBriefcase className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        {/* block-level truncate = actually works */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-xs sm:text-base truncate min-w-0 flex-1">{app.job_title}</h4>
                            <StageBadge stage={app.stage} />
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">
                            {app.organization} · {new Date(app.applied_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {(!recentApplications || recentApplications.length === 0) && (
              <Card className="rounded-xl border-dashed border-2 border-border">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <HiOutlineDocumentText className="w-7 h-7 text-muted-foreground opacity-30" />
                  </div>
                  <p className="text-muted-foreground font-medium text-sm">No applications yet.</p>
                  <Button variant="outline" size="sm" as-child='true' className="mt-3 text-emerald-500 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl">
                    <Link href="/jobs" className="flex items-center gap-1">
                      <HiOutlineMagnifyingGlass className="w-4 h-4" /> Explore Jobs
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <HiOutlineVideoCamera className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold truncate">Upcoming Interviews</h2>
            </div>
            <Badge variant="secondary" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 shrink-0">
              <HiOutlineVideoCamera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {(upcomingInterviews || []).length}
              <span className="hidden sm:inline">scheduled</span>
            </Badge>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {(upcomingInterviews || []).slice(0, 4).map((iv, i) => (
              <motion.div key={iv.room_id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="rounded-xl border-border group hover:border-emerald-500/20 hover:shadow-md transition-all overflow-hidden min-w-0">
                  <CardContent className="p-3 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform shrink-0">
                        <HiOutlineVideoCamera className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-base truncate">{iv.title}</h4>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">{iv.job}</p>
                        <p className="text-[10px] sm:text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                          <HiOutlineClock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> {iv.time}
                        </p>
                      </div>
                      <Button size="sm" as-child='true' className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-3 shrink-0">
                        <Link href={`/candidate/interview/${iv.room_id}`} className="flex items-center gap-1.5">
                          <HiOutlineVideoCamera className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Join</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {(!upcomingInterviews || upcomingInterviews.length === 0) && (
              <Card className="rounded-xl border-dashed border-2 border-border">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <HiOutlineVideoCamera className="w-7 h-7 text-muted-foreground opacity-30" />
                  </div>
                  <p className="text-muted-foreground font-medium text-sm">No upcoming interviews.</p>
                  <Button variant="outline" size="sm" as-child='true' className="mt-3 text-emerald-500 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl">
                    <Link href="/jobs" className="flex items-center gap-1">
                      <HiOutlineBriefcase className="w-4 h-4" /> Browse Jobs
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Assessments + Activity ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="rounded-2xl border-border min-w-0">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <HiOutlineAcademicCap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-lg sm:text-2xl font-bold truncate">Assessments</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs truncate">Coding &amp; AI interview results</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-emerald-500/5 rounded-2xl p-3 sm:p-5 text-center border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors cursor-pointer min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <HiOutlineCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold">{assessments?.completed || 0}</div>
                <div className="text-[9px] sm:text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest mt-1">Completed</div>
              </div>
              <div className="bg-amber-500/5 rounded-2xl p-3 sm:p-5 text-center border border-amber-500/10 hover:bg-amber-500/10 transition-colors cursor-pointer min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <HiOutlineClock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold">{assessments?.pending || 0}</div>
                <div className="text-[9px] sm:text-[10px] text-amber-500/70 font-bold uppercase tracking-widest mt-1">Pending</div>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {assessments?.avgScore > 0 && (
                <div className="flex items-center gap-2 text-xs sm:text-sm bg-secondary/30 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                  <HiOutlineStar className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-muted-foreground truncate">Average score</span>
                  <span className="text-emerald-500 font-bold ml-auto shrink-0">{assessments.avgScore}%</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm bg-secondary/30 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <HiOutlineChatBubbleLeftEllipsis className="w-4 h-4 text-violet-500 shrink-0" />
                  <span className="text-muted-foreground truncate">AI Interviews</span>
                </div>
                <span className="font-bold shrink-0">{aiInterviews?.completed || 0} / {aiInterviews?.total || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border min-w-0">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <HiOutlineFire className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-lg sm:text-2xl font-bold truncate">Recent Activity</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs truncate">Everything happening with your apps</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5 sm:space-y-1 p-4 sm:p-6 pt-0">
            {(activity || []).slice(0, 6).map((a, i) => <ActivityItem key={i} a={a} i={i} />)}
            {(!activity || activity.length === 0) && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <HiOutlineClock className="w-6 h-6 text-muted-foreground opacity-30" />
                </div>
                <p className="text-sm text-muted-foreground/50">No activity yet. Start by applying to jobs!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ═══ Profile Strength + Next Steps ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="rounded-2xl border-border min-w-0">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <HiOutlineChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-lg sm:text-2xl font-bold truncate">Profile Strength</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs truncate">How complete your profile is</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <ProfileDonut value={summary?.profileStrength || 0} />
              <div className="space-y-2 w-full sm:w-auto sm:flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <HiOutlineDocumentDuplicate className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-muted-foreground truncate">{summary?.resumeCount || 0} resume{(summary?.resumeCount || 0) !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <HiOutlineCheckCircle className={`w-4 h-4 shrink-0 ${summary?.hasResume ? 'text-emerald-500' : 'text-muted-foreground/30'}`} />
                  <span className="text-muted-foreground truncate">{summary?.hasResume ? 'Resume uploaded' : 'No resume yet'}</span>
                </div>
                <Progress value={summary?.profileStrength || 0} className="h-2 w-full mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border min-w-0">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <HiOutlineFlag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-lg sm:text-2xl font-bold truncate">Next Steps</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs truncate">Things to take care of</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
            {(summary?.pendingTasks || []).map((t, i) => {
              const taskIcons = {
                'Complete coding assessment': HiOutlineCodeBracket,
                'Complete AI interview': HiOutlineChatBubbleLeftEllipsis,
                'Upload a resume': HiOutlineDocumentDuplicate,
              };
              const TaskIcon = taskIcons[t.task] || HiOutlineExclamationTriangle;
              return (
                <motion.div key={t.task} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-2.5 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-all cursor-pointer group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                    <TaskIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate">{t.task}</p>
                    {t.count > 1 && <p className="text-[9px] sm:text-[10px] text-muted-foreground/60 mt-0.5">{t.count} pending</p>}
                  </div>
                  <Button variant="ghost" size="sm" as-child='true' className="text-emerald-500 hover:bg-emerald-500/10 rounded-lg text-xs font-semibold shrink-0">
                    <Link href={t.task.includes('resume') ? '/candidate/resumes' : '/candidate/applications'} className="flex items-center gap-1">
                      Go <HiOutlineArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
            {(!summary?.pendingTasks || summary.pendingTasks.length === 0) && (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <HiOutlineCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold">All caught up!</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">No pending tasks. Great job!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}