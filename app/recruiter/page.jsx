'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api } from '@/utils/api';
import {
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineCommandLine,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineVideoCamera,
  HiOutlineArrowTrendingUp,
  HiOutlineClock,
  HiOutlineCheckBadge,
  HiOutlineCalendarDays,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineExclamationTriangle,
  HiOutlineArrowRight,
  HiOutlinePlus,
  HiOutlinePaperAirplane,
  HiOutlineChevronRight,
  HiOutlineFire,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import Link from 'next/link';
import BarChart from '@/components/display/BarChart';

// shadcn components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ICON_MAP = {
  HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineUserGroup,
  HiOutlineCommandLine, HiOutlineChatBubbleLeftEllipsis,
  HiOutlineVideoCamera, HiOutlineArrowTrendingUp, HiOutlineClock,
  HiOutlineCheckBadge, HiOutlineCalendarDays, HiOutlineUser,
  HiOutlineAcademicCap, HiOutlineStar,
};

/* Candidate-page icon tile colors (no borders, soft /10 bg) */
const SOFT = {
  emerald: 'bg-emerald-500/10 text-emerald-500',
  blue: 'bg-blue-500/10 text-blue-500',
  cyan: 'bg-cyan-500/10 text-cyan-500',
  violet: 'bg-violet-500/10 text-violet-500',
  rose: 'bg-rose-500/10 text-rose-500',
  purple: 'bg-purple-500/10 text-purple-400',
  amber: 'bg-amber-500/10 text-amber-500',
};

const ACTIVITY_ICONS = {
  assessment: HiOutlineAcademicCap,
  application: HiOutlineDocumentText,
  ai: HiOutlineChatBubbleLeftEllipsis,
  offer: HiOutlinePaperAirplane,
  interview: HiOutlineVideoCamera,
};
const ACTIVITY_COLORS = {
  assessment: 'bg-cyan-500/10 text-cyan-500',
  application: 'bg-blue-500/10 text-blue-500',
  ai: 'bg-violet-500/10 text-violet-500',
  offer: 'bg-emerald-500/10 text-emerald-500',
  interview: 'bg-cyan-500/10 text-cyan-500',
};

/* ── Primary Stat Card (candidate StatCard style) ── */
function StatCard({ stat, index }) {
  const Icon = ICON_MAP[stat.icon] || HiOutlineDocumentText;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="min-w-0 h-full">
      <Card className="glass border-emerald-500/5 relative overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-emerald-500/5 transition-all rounded-2xl h-full">
        <CardContent className="p-5 sm:p-6 lg:p-8">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${SOFT[stat.color]} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 truncate">{(stat.value ?? 0).toLocaleString()}</div>
          <div className="text-[11px] sm:text-sm text-muted-foreground font-bold uppercase tracking-widest truncate mb-3">{stat.label}</div>

        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Status pill (candidate StageBadge style — no border) ── */
function StatusPill({ status }) {
  const styles = {
    Evaluated: 'bg-emerald-500/10 text-emerald-500',
    'AI Round': 'bg-violet-500/10 text-violet-500',
    Technical: 'bg-cyan-500/10 text-cyan-500',
    Screening: 'bg-blue-500/10 text-blue-500',
    Review: 'bg-amber-500/10 text-amber-500',
  };
  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shrink-0 max-w-[110px] sm:max-w-[160px] truncate ${styles[status] || 'bg-secondary text-muted-foreground'}`}>
      {status}
    </span>
  );
}

/* ── Initials tile (candidate icon-tile style) ── */
function InitialsTile({ initials, color = 'bg-emerald-500/10 text-emerald-500' }) {
  return (
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${color} flex items-center justify-center text-sm font-bold shrink-0 group-hover:scale-110 transition-transform`}>
      {initials || '?'}
    </div>
  );
}

/* ── Funnel Bar (candidate JourneyBar style) ── */
function FunnelBar({ label, value, max, color, index }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-2 group cursor-pointer hover:bg-secondary/20 p-1.5 rounded-lg transition-colors"
    >
      <span className="text-[11px] font-bold text-muted-foreground w-20 sm:w-28 truncate shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-secondary/40 rounded-full overflow-hidden min-w-0">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
      <span className="text-xs font-bold ml-2 shrink-0">{value}</span>
    </motion.div>
  );
}

/* ── Activity Item (candidate ActivityItem style) ── */
function ActivityItem({ a, i }) {
  const Icon = ACTIVITY_ICONS[a.type] || HiOutlineClock;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
      className="flex items-start gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-secondary/20 transition-colors group cursor-pointer"
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${ACTIVITY_COLORS[a.type] || 'bg-amber-500/10 text-amber-500'} group-hover:scale-110 transition-transform`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-foreground/80 break-words">{a.text}</p>
        <span className="text-[11px] text-muted-foreground/50 flex items-center gap-1 mt-0.5">
          <HiOutlineClock className="w-3 h-3 shrink-0" /> {a.time}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Loading Skeleton ── */
function DashboardSkeleton() {
  return (
    <div className="space-y-8 sm:space-y-10 p-4 md:px-8 pb-4 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-7 sm:h-8 w-full max-w-xs rounded-lg" />
          <Skeleton className="h-4 sm:h-5 w-48 max-w-full rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="rounded-2xl border-border min-w-0">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl" />
                <Skeleton className="w-5 h-5 rounded" />
              </div>
              <Skeleton className="h-7 w-16 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 rounded-2xl border-border min-w-0">
          <CardContent className="p-5 sm:p-6 space-y-3">
            <Skeleton className="h-5 w-28 rounded" />
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 rounded-2xl border-border min-w-0">
          <CardContent className="p-5 sm:p-6 space-y-4">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="rounded-2xl border-border min-w-0">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <Skeleton className="h-6 w-40 rounded" />
              {[...Array(3)].map((_, j) => <Skeleton key={j} className="h-16 w-full rounded-xl" />)}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="rounded-2xl border-border">
        <CardContent className="p-5 sm:p-6 space-y-3">
          <Skeleton className="h-5 w-36 rounded" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Dashboard
   ═══════════════════════════════════════════════════════════════════ */
export default function RecruiterDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/accounts/recruiter/dashboard/');
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
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center">
          <HiOutlineExclamationTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500" />
        </div>
        <p className="text-sm font-medium text-center">Failed to load dashboard data.</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-600 rounded-xl"
        >
          Retry
        </Button>
      </div>
    );
  }

  const { user, stats, weeklyActivity, funnel, recentApplications, upcomingInterviews, jobPerformance, activityFeed, summary } = data;
  const pipelineStages = data.pipeline || [];
  const maxFunnel = funnel?.max || Math.max(...pipelineStages.map((p) => p.count), 1);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const quickActions = [
    { label: 'Post Job', icon: HiOutlinePlus, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20', href: '/recruiter/jobs/create' },
    { label: 'Review', icon: HiOutlineDocumentText, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20', href: '/recruiter/applications' },
  ];

  const primaryStats = (stats || []).slice(0, 3);
  const secondaryStats = (stats || []).slice(3);

  const viewAllBtn =
    'text-emerald-500 text-xs sm:text-sm font-bold hover:underline flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl hover:bg-emerald-500/20 transition-all shrink-0';

  return (
    <div className="space-y-8 sm:space-y-10 p-4 md:px-8 pb-4 max-w-7xl mx-auto w-full min-w-0 overflow-x-clip">
      {/* ═══ Header (candidate header style) ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <HiOutlineArrowTrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500" />
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

        {/* Desktop quick actions (candidate style) */}
        <div className="lg:flex items-center gap-2 shrink-0">

          {quickActions.map((a) => (
            <Button key={a.label} variant="outline" size="sm" className={`rounded-xl border text-xs font-semibold ${a.color}`}>
              <a href={a.href} className="flex items-center justify-center gap-1.5">
                <a.icon className="w-3.5 h-3.5" />
                {a.label}
              </a>
            </Button>
          ))}
        </div>
      </div>


      {/* ═══ Primary Stats (candidate StatCard style) ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {primaryStats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ═══ Secondary stats + Chart ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Secondary stats */}
        <div className="lg:col-span-2 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <HiOutlineChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold truncate">More metrics</h2>
              <p className="text-xs text-muted-foreground/60">Secondary performance stats</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {secondaryStats.map((stat, i) => {
              const Icon = ICON_MAP[stat.icon] || HiOutlineDocumentText;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (primaryStats.length + i) * 0.04 }}
                  className="min-w-0"
                >
                  <Card className="glass border-emerald-500/5 rounded-2xl overflow-hidden group hover:shadow-lg hover:shadow-emerald-500/5 transition-all h-full">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${SOFT[stat.color]} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                      </div>
                      <div className="text-xl sm:text-2xl font-bold truncate">{(stat.value ?? 0).toLocaleString()}</div>
                      <div className="text-[10px] sm:text-[11px] text-muted-foreground font-bold uppercase tracking-widest truncate">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weekly Activity Chart (glass card) */}
        <Card className="glass border-emerald-500/5 rounded-2xl lg:col-span-3 min-w-0">
          <CardHeader className="pb-3 p-5 sm:p-6 flex flex-row items-start justify-between space-y-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <HiOutlineArrowTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold truncate">Weekly Activity</CardTitle>
                <CardDescription className="text-xs text-muted-foreground/60">Applicants, assessments &amp; interviews</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] font-bold shrink-0 flex-wrap justify-end">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Apps</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-300" /> Assess</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30" /> Intvs</span>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="h-56 w-full">
              <BarChart data={weeklyActivity || []} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ Funnel + Recent Apps ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Conversion Funnel (glass card, journey-bar style) */}
        <Card className="glass border-emerald-500/5 rounded-2xl min-w-0">
          <CardHeader className="pb-3 p-5 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <HiOutlineArrowTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold truncate">Conversion Funnel</CardTitle>
                <CardDescription className="text-xs text-muted-foreground/60">Stage by stage breakdown</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5 sm:space-y-2 p-5 sm:p-6 pt-0">
            <FunnelBar label="Applications" value={funnel?.applications || 0} max={maxFunnel} color="from-emerald-500 to-emerald-400" index={0} />
            <FunnelBar label="Assessments" value={funnel?.assessments || 0} max={maxFunnel} color="from-emerald-400 to-emerald-300" index={1} />
            <FunnelBar label="AI Interviews" value={funnel?.ai_interviews || 0} max={maxFunnel} color="from-teal-400 to-teal-300" index={2} />
            <FunnelBar label="Real Interviews" value={funnel?.real_interviews || 0} max={maxFunnel} color="from-cyan-400 to-cyan-300" index={3} />
            <FunnelBar label="Offers" value={funnel?.offers || 0} max={maxFunnel} color="from-blue-400 to-blue-300" index={4} />
          </CardContent>
        </Card>

        {/* Recent Applications (candidate section style) */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <HiOutlineBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold truncate">Recent Applications</h2>
            </div>
            <Button variant="ghost" size="sm" className={viewAllBtn}>
              View All <HiOutlineChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {(recentApplications || []).slice(0, 4).map((app, i) => (
              <motion.div
                key={app.name + i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="glass border-emerald-500/5 rounded-xl group hover:border-emerald-500/20 hover:shadow-md transition-all cursor-pointer overflow-hidden">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <InitialsTile initials={app.avatar} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm sm:text-base truncate">{app.name}</h4>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{app.role || app.job}</p>
                          </div>
                          <StatusPill status={app.status} />
                        </div>
                      </div>
                      {app.score != null && app.score > 0 && (
                        <div className={`text-sm font-bold shrink-0 ${app.score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {app.score}%
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {(!recentApplications || recentApplications.length === 0) && (
              <Card className="glass rounded-xl border-dashed border-2 border-border">
                <CardContent className="p-8 sm:p-12 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <HiOutlineDocumentText className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground opacity-30" />
                  </div>
                  <p className="text-muted-foreground font-medium text-sm">No applications yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Upcoming Interviews + Job Performance ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Upcoming Interviews */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <HiOutlineVideoCamera className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold truncate">Upcoming Interviews</h2>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider bg-secondary px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0">
              <HiOutlineVideoCamera className="w-3.5 h-3.5" />
              {(upcomingInterviews || []).length} scheduled
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {(upcomingInterviews || []).slice(0, 4).map((iv, i) => (
              <motion.div
                key={iv.name + i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="glass border-emerald-500/5 rounded-xl group hover:border-emerald-500/20 hover:shadow-md transition-all overflow-hidden">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <InitialsTile initials={iv.avatar} color="bg-violet-500/10 text-violet-500" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <h4 className="font-bold text-sm sm:text-base truncate">{iv.name}</h4>
                          <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            {iv.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{iv.role} · {iv.time}</p>
                      </div>
                      <HiOutlineVideoCamera className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/30 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {(!upcomingInterviews || upcomingInterviews.length === 0) && (
              <Card className="glass rounded-xl border-dashed border-2 border-border">
                <CardContent className="p-8 sm:p-12 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <HiOutlineVideoCamera className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground opacity-30" />
                  </div>
                  <p className="text-muted-foreground font-medium text-sm">No upcoming interviews</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Job Performance (glass card) */}
        <Card className="glass border-emerald-500/5 rounded-2xl min-w-0">
          <CardHeader className="pb-3 p-5 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <HiOutlineBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold truncate">Job Performance</CardTitle>
                <CardDescription className="text-xs text-muted-foreground/60">Applicants &amp; hires per job</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pb-2 mb-2 border-b border-border">
              <span className="col-span-2">Job</span>
              <span className="text-right">Apps</span>
              <span className="text-right">Hires</span>
            </div>
            <div className="space-y-1">
              {(jobPerformance || []).map((job, i) => (
                <motion.div
                  key={job.title + i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-4 gap-2 sm:gap-3 py-2.5 items-center rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <span className="col-span-2 text-sm font-bold truncate pr-2">{job.title}</span>
                  <span className="text-sm font-medium text-right text-muted-foreground">{job.apps}</span>
                  <span className={`text-sm font-bold text-right ${job.hires > 0 ? 'text-emerald-500' : 'text-muted-foreground/40'}`}>
                    {job.hires}
                  </span>
                </motion.div>
              ))}
              {(!jobPerformance || jobPerformance.length === 0) && (
                <p className="text-sm text-muted-foreground/50 text-center py-6">No job data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ Activity Feed (candidate Activity card style) ═══ */}
      <Card className="glass border-emerald-500/5 rounded-2xl min-w-0">
        <CardHeader className="pb-3 p-5 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <HiOutlineFire className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl sm:text-2xl font-bold truncate">Recent Activity</CardTitle>
              <CardDescription className="text-xs text-muted-foreground/60">Everything happening across your pipeline</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {(activityFeed || []).slice(0, 6).map((a, i) => (
              <ActivityItem key={i} a={a} i={i} />
            ))}
          </div>
          {(!activityFeed || activityFeed.length === 0) && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-secondary mx-auto mb-3 flex items-center justify-center">
                <HiOutlineClock className="w-6 h-6 text-muted-foreground opacity-30" />
              </div>
              <p className="text-sm text-muted-foreground/50">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div >
  );
}