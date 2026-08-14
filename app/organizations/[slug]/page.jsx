'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
  HiOutlineUsers, HiOutlineBriefcase, HiOutlineChartBar,
  HiOutlineCommandLine, HiOutlineSpeakerWave, HiOutlineVideoCamera,
  HiOutlineCog6Tooth, HiOutlineBuildingOffice2,
  HiOutlineArrowRight, HiOutlineChevronRight, HiOutlinePlus,
  HiOutlineDocumentText, HiOutlineCalendar,
  HiOutlineClipboardDocumentList, HiOutlineMapPin, HiOutlineClock,
} from 'react-icons/hi2';
import Link from 'next/link';

// shadcn components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navLinks = [
  { label: 'Jobs', icon: HiOutlineBriefcase, path: 'jobs', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20' },
  { label: 'Assessments', icon: HiOutlineCommandLine, path: 'assesments', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20' },
  { label: 'AI Interviews', icon: HiOutlineSpeakerWave, path: 'ai-interviews', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' },
  { label: 'Live Interviews', icon: HiOutlineVideoCamera, path: 'interviews', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20' },
  { label: 'Analytics', icon: HiOutlineChartBar, path: 'analytics', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/20' },
  { label: 'Team', icon: HiOutlineUsers, path: 'team', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' },
];

/* ── Job Card ── */
function JobCard({ job, index }) {
  const statusStyles = {
    open: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    closed: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  const formatStage = (s) => String(s).replace(/[_-]+/g, ' ').trim();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="rounded-[15px] border-border hover:border-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group overflow-hidden">
        <CardContent className="p-4 sm:p-5">
          {/* ── Top row: icon + title/meta + applicants ── */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[15px] bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <HiOutlineBriefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="font-bold text-foreground group-hover:text-emerald-500 transition-colors text-sm sm:text-base break-words min-w-0">
                  {job.job_title}
                </h3>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 border shrink-0 ${
                    statusStyles[job.status] || 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {job.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1.5">
                {job.department && (
                  <span className="flex items-center gap-1">
                    <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 shrink-0" /> {job.department}
                  </span>
                )}
                {job.location && (
                  <span className="flex items-center gap-1">
                    <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0" /> {job.location}
                  </span>
                )}
                {job.job_type && (
                  <span className="flex items-center gap-1">
                    <HiOutlineClock className="w-3.5 h-3.5 shrink-0" /> {job.job_type}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0 pl-1">
              <div className="text-lg sm:text-xl font-black text-foreground leading-none">{job.applications_count}</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">Applicants</div>
            </div>
          </div>

          {/* ── Hiring pipeline ── */}
          {job.interview_pipeline?.length > 0 && (
            <div className="mt-3 sm:mt-4 rounded-xl bg-secondary/30 border border-border/60 p-2.5 sm:p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">
                Hiring Pipeline
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
                {job.interview_pipeline.map((stage, si) => (
                  <React.Fragment key={stage}>
                    <Badge variant="secondary" className="rounded-full text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1">
                      {formatStage(stage)}
                    </Badge>
                    {si < job.interview_pipeline.length - 1 && (
                      <HiOutlineChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* ── Linked modules ── */}
          {(job.assessment || job.ai_interviews?.length > 0 || job.interview_config) && (
            <>
              <Separator className="my-3" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mr-1">Linked:</span>
                {job.assessment && (
                  <Badge variant="outline" className="rounded-full bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px] font-semibold flex items-center gap-1 px-2.5 py-1">
                    <HiOutlineCommandLine className="w-3 h-3" /> Assessment
                  </Badge>
                )}
                {job.ai_interviews?.length > 0 && (
                  <Badge variant="outline" className="rounded-full bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-semibold flex items-center gap-1 px-2.5 py-1">
                    <HiOutlineSpeakerWave className="w-3 h-3" /> AI Interview
                  </Badge>
                )}
                {job.interview_config && (
                  <Badge variant="outline" className="rounded-full bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px] font-semibold flex items-center gap-1 px-2.5 py-1">
                    <HiOutlineVideoCamera className="w-3 h-3" /> Live Interview
                  </Badge>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Loading Skeleton ── */
function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
      <Card className="rounded-[15px] border-border">
        <CardContent className="p-5 sm:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <Skeleton className="w-14 h-14 sm:w-20 sm:h-20 rounded-[15px] shrink-0" />
          <div className="flex-1 w-full space-y-3">
            <Skeleton className="h-7 sm:h-9 w-48 sm:w-72 rounded-lg" />
            <Skeleton className="h-4 w-full max-w-md rounded" />
            <Skeleton className="h-4 w-full max-w-lg rounded" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-[15px] border-border">
            <CardContent className="p-3 sm:p-5 flex items-center gap-3 sm:gap-4">
              <Skeleton className="w-9 h-9 sm:w-12 sm:h-12 rounded-[12px] shrink-0" />
              <div className="space-y-1.5 min-w-0 flex-1">
                <Skeleton className="h-5 w-10 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-20 sm:h-24 rounded-[15px]" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-[15px]" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-36 rounded" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-[15px]" />
          ))}
          <Skeleton className="h-32 rounded-[15px]" />
        </div>
      </div>
    </div>
  );
}

export default function OrganizationDashboardPage() {
  const { slug } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [configs, setConfigs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const [dash, cfg] = await Promise.all([
          api.get(`/organizations/${slug}/dashboard/`).catch(() => null),
          api.get(`/organizations/${slug}/configs/`).catch(() => null),
        ]);
        if (!cancelled) {
          if (dash) { setDashboard(dash); setConfigs(cfg); }
          else {
            const orgData = await api.get(`/organizations/${slug}/`);
            setDashboard({ organization: orgData, overview: { total_jobs: 0, total_applications: 0, applications_by_status: {}, applications_by_stage: {} }, jobs: [] });
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <DashboardSkeleton />;

  if (!dashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground px-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <HiOutlineBuildingOffice2 className="w-8 h-8 text-destructive" />
        </div>
        <p className="text-sm font-medium text-center">Failed to load organization.</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-600 rounded-xl"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const { organization: org, overview, jobs } = dashboard;
  const totalConfigs = (configs?.assessments?.length || 0) + (configs?.ai_interviews?.length || 0) + (configs?.interview_configs?.length || 0);

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
      {/* ═══ Hero Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="rounded-[15px] border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/[0.04] rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
          <CardContent className="p-5 sm:p-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-[15px] bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center text-emerald-500 shadow-lg border border-emerald-500/10 shrink-0">
                <HiOutlineBuildingOffice2 className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                  <h1 className="text-xl sm:text-3xl font-bold text-foreground break-words min-w-0">{org.name}</h1>
                  {org.is_verified && (
                    <span className="bg-emerald-500 text-white p-1 rounded-full shrink-0" title="Verified">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </span>
                  )}
                  <Badge variant="secondary" className="rounded-full border-border text-xs font-semibold text-muted-foreground shrink-0">
                    {org.industry}
                  </Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed text-sm sm:text-base break-words">
                  {org.description || 'No description.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══ Stats Row ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Jobs', value: overview.total_jobs, icon: HiOutlineBriefcase, color: 'from-blue-500/10 to-blue-600/5 text-blue-500' },
          { label: 'Applications', value: overview.total_applications, icon: HiOutlineDocumentText, color: 'from-purple-500/10 to-purple-600/5 text-purple-500' },
          { label: 'Active Configs', value: totalConfigs, icon: HiOutlineCog6Tooth, color: 'from-amber-500/10 to-amber-600/5 text-amber-500' },
          { label: 'Hired', value: org.total_hired_count, icon: HiOutlineClipboardDocumentList, color: 'from-emerald-500/10 to-emerald-600/5 text-emerald-500' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="rounded-[15px] border-border hover:border-emerald-500/20 transition-all cursor-pointer group overflow-hidden">
              <CardContent className="p-3 sm:p-5 flex items-center gap-3 sm:gap-4">
                <div className={`w-9 h-9 hidden sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[15px] bg-gradient-to-br ${stat.color} sm:flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-black text-foreground truncate">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══ Quick Nav Cards ═══ */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
        {navLinks.map((link, i) => (
          <motion.div key={link.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04 }}>
            <Button
              variant="outline"
              as-child='true'
              className={`h-auto w-full p-0 flex flex-col items-center gap-1.5 sm:gap-2 rounded-[15px] border ${link.color} group`}
            >
              <Link href={`/organizations/${slug}/${link.path}`} className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 w-full">
                <link.icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-center leading-tight whitespace-normal">
                  {link.label}
                </span>
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Recent Jobs</h2>
            <Button variant="ghost" size="sm" as-child='true' className="text-emerald-500 hover:bg-emerald-500/10 text-xs sm:text-sm font-bold rounded-xl shrink-0">
              <Link href={`/organizations/${slug}/jobs`} className="flex items-center gap-1">
                View All <HiOutlineArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>

          {jobs.length === 0 ? (
            <Card className="rounded-[15px] border-dashed border-2 border-border">
              <CardContent className="p-8 sm:p-12 text-center">
                <HiOutlineBriefcase className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground font-medium text-sm sm:text-base">No jobs yet.</p>
                <Button size="sm" as-child='true' className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-[15px] text-xs sm:text-sm">
                  <Link href={`/organizations/${slug}/jobs/create`} className="flex items-center gap-2 px-5 py-2.5">
                    <HiOutlinePlus className="w-4 h-4" /> Create Job
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job, i) => (
                <JobCard key={job.job_id} job={job} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Configs & Stats Sidebar */}
        <div className="space-y-4 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Configurations</h2>

          {!configs ? (
            <Card className="rounded-[15px] border-border">
              <CardContent className="p-6 text-center">
                <HiOutlineCog6Tooth className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Loading configs...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Assessments', count: configs.assessments?.length || 0, icon: HiOutlineCommandLine, path: 'assesments', color: 'text-purple-500 bg-purple-500/10' },
                { label: 'AI Interviews', count: configs.ai_interviews?.length || 0, icon: HiOutlineSpeakerWave, path: 'ai-interviews', color: 'text-amber-500 bg-amber-500/10' },
                { label: 'Interview Configs', count: configs.interview_configs?.length || 0, icon: HiOutlineVideoCamera, path: 'interviews', color: 'text-rose-500 bg-rose-500/10' },
              ].map((cfg) => (
                <Card key={cfg.label} className="rounded-[15px] border-border hover:border-emerald-500/20 transition-all group cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <Link href={`/organizations/${slug}/${cfg.path}`} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] sm:rounded-[15px] ${cfg.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <cfg.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-emerald-500 transition-colors">{cfg.label}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">{cfg.count} {cfg.count === 1 ? 'config' : 'configs'}</div>
                      </div>
                      <HiOutlineChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Owner Info */}
          <Card className="rounded-[15px] border-border overflow-hidden">
            <CardHeader className="pb-3 p-4 sm:p-6 sm:pb-3">
              <CardTitle className="text-sm font-bold">Organization Owner</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm">
                    {org.owner?.email?.[0]?.toUpperCase() || 'O'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-foreground truncate">{org.owner?.email?.split('@')[0] || 'Owner'}</div>
                  <div className="text-xs text-muted-foreground truncate">{org.owner?.email || ''}</div>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <HiOutlineUsers className="w-3.5 h-3.5 shrink-0" /> {org.members_count} members
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineCalendar className="w-3.5 h-3.5 shrink-0" /> {new Date(org.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}