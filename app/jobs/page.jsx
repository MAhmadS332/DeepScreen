'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@/utils/api';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineFunnel,
  HiOutlineChevronRight,
  HiOutlineXMark,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineArrowsUpDown,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2';

// shadcn components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

/* ── Constants ── */
const SALARY_RANGES = [
  { label: 'Under $1,000', value: '0-1000', min: 0, max: 1000 },
  { label: '$1,000 – $2,500', value: '1000-2500', min: 1000, max: 2500 },
  { label: '$2,500 – $5,000', value: '2500-5000', min: 2500, max: 5000 },
  { label: '$5,000+', value: '5000+', min: 5000, max: Infinity },
];

const WORK_MODES = [
  { label: 'Any', value: 'any' },
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-site', value: 'onsite' },
];

const DEFAULT_FILTERS = { jobType: [], mode: 'any', salary: 'any' };
const PAGE_SIZE = 6;

/* ── Helpers ── */
function parseSalary(str) {
  if (!str || typeof str !== 'string') return null;
  const parts = [...str.matchAll(/(\d+(?:,\d{3})*(?:\.\d+)?)\s*(k)?/gi)].map((m) => {
    let n = parseFloat(m[1].replace(/,/g, ''));
    if (m[2]) n *= 1000;
    return n;
  });
  if (!parts.length) return null;
  return { min: Math.min(...parts), max: Math.max(...parts) };
}

function getWorkMode(job) {
  const loc = (job.location || '').toLowerCase();
  if (loc.includes('remote')) return 'remote';
  if (loc.includes('hybrid')) return 'hybrid';
  return 'onsite';
}

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const secs = (Date.now() - d.getTime()) / 1000;
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  if (secs < 2629800) return `${Math.floor(secs / 604800)}w ago`;
  return `${Math.floor(secs / 2629800)}mo ago`;
}

/* ── Filter Panel (shared: desktop sidebar + mobile sheet) ── */
function FilterPanel({ filters, jobTypes, typeCounts, onToggleType, onModeChange, onSalaryChange, onClear, activeCount }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-foreground flex items-center gap-2">
          Filter
          {activeCount > 0 && (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full">
              {activeCount} active
            </Badge>
          )}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={activeCount === 0}
          className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600 text-xs font-bold h-auto px-2 py-1"
        >
          Clear all
        </Button>
      </div>
      <Separator />

      {/* Job Type */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Job Type</p>
        <div className="space-y-1">
          {jobTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-2 -mx-2 hover:bg-secondary/40 transition-colors"
            >
              <Checkbox
                id={`type-${type}`}
                checked={filters.jobType.includes(type)}
                onCheckedChange={() => onToggleType(type)}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <span className={`text-sm font-bold flex-1 ${filters.jobType.includes(type) ? 'text-foreground' : 'text-muted-foreground'}`}>
                {type}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground/50 bg-secondary/60 px-2 py-0.5 rounded-full">
                {typeCounts[type] || 0}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Working Mode</p>
        <RadioGroup value={filters.mode} onValueChange={onModeChange} className="space-y-1">
          {WORK_MODES.map((m) => (
            <label
              key={m.value}
              className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-2 -mx-2 hover:bg-secondary/40 transition-colors"
            >
              <RadioGroupItem
                value={m.value}
                id={`mode-${m.value}`}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:text-white"
              />
              <Label htmlFor={`mode-${m.value}`} className={`text-sm font-bold cursor-pointer ${filters.mode === m.value ? 'text-foreground' : 'text-muted-foreground'}`}>
                {m.label}
              </Label>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Salary Range */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Salary Range</p>
        <RadioGroup value={filters.salary} onValueChange={onSalaryChange} className="space-y-1">
          {[{ label: 'Any', value: 'any' }, ...SALARY_RANGES].map((r) => (
            <label
              key={r.value}
              className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-2 -mx-2 hover:bg-secondary/40 transition-colors"
            >
              <RadioGroupItem
                value={r.value}
                id={`salary-${r.value}`}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:text-white"
              />
              <Label htmlFor={`salary-${r.value}`} className={`text-sm font-bold cursor-pointer ${filters.salary === r.value ? 'text-foreground' : 'text-muted-foreground'}`}>
                {r.label}
              </Label>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

/* ── Job Card Skeleton ── */
function JobCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl border border-border p-5 sm:p-6">
      <div className="flex gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3 rounded-full" />
              <Skeleton className="h-4 w-1/4 rounded-full" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-5/6 rounded-full" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-7 w-28 rounded-xl" />
            <Skeleton className="h-7 w-28 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════════════ */
export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('newest');
  const [showSidebar, setShowSidebar] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/jobs/');
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ── Derived data ── */
  const typeCounts = useMemo(() => {
    const m = {};
    jobs.forEach((j) => { if (j.job_type) m[j.job_type] = (m[j.job_type] || 0) + 1; });
    return m;
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const base = Object.keys(typeCounts);
    return base.length ? base : ['Full-time', 'Freelance', 'Internship', 'Volunteer', 'Contract'];
  }, [typeCounts]);

  const orgCount = useMemo(() => new Set(jobs.map((j) => j.organization_details?.name).filter(Boolean)).size, [jobs]);

  /* ── Filtering ─ */
  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const loc = locationQuery.trim().toLowerCase();
    const salaryRange = SALARY_RANGES.find((r) => r.value === filters.salary);

    return jobs.filter((job) => {
      const matchSearch =
        !q ||
        (job.job_title || '').toLowerCase().includes(q) ||
        (job.organization_details?.name || '').toLowerCase().includes(q) ||
        (job.key_skills || []).some((s) => (s || '').toLowerCase().includes(q));

      const matchLocation = !loc || (job.location || '').toLowerCase().includes(loc);
      const matchType = filters.jobType.length === 0 || filters.jobType.includes(job.job_type);
      const matchMode = filters.mode === 'any' || getWorkMode(job) === filters.mode;

      let matchSalary = true;
      if (salaryRange) {
        const s = parseSalary(job.salary_range);
        // Jobs without salary data stay visible (they might match)
        matchSalary = !s || (s.min <= salaryRange.max && s.max >= salaryRange.min);
      }

      return matchSearch && matchLocation && matchType && matchMode && matchSalary;
    });
  }, [jobs, searchQuery, locationQuery, filters]);

  /* ── Sorting ── */
  const sortedJobs = useMemo(() => {
    const arr = [...filteredJobs];
    switch (sortBy) {
      case 'newest':
        arr.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      case 'oldest':
        arr.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        break;
      case 'title-az':
        arr.sort((a, b) => (a.job_title || '').localeCompare(b.job_title || ''));
        break;
      case 'title-za':
        arr.sort((a, b) => (b.job_title || '').localeCompare(a.job_title || ''));
        break;
      case 'salary-high':
        arr.sort((a, b) => (parseSalary(b.salary_range)?.max ?? -1) - (parseSalary(a.salary_range)?.max ?? -1));
        break;
      default:
        break;
    }
    return arr;
  }, [filteredJobs, sortBy]);

  /* Reset pagination when anything changes */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, locationQuery, filters, sortBy]);

  const visibleJobs = sortedJobs.slice(0, visibleCount);

  /* ── Filter handlers ── */
  const toggleType = (value) =>
    setFilters((prev) => ({
      ...prev,
      jobType: prev.jobType.includes(value) ? prev.jobType.filter((i) => i !== value) : [...prev.jobType, value],
    }));

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setLocationQuery('');
  };

  const activeFilterCount =
    filters.jobType.length + (filters.mode !== 'any' ? 1 : 0) + (filters.salary !== 'any' ? 1 : 0);

  /* ── Active chips ── */
  const chips = [
    ...(searchQuery.trim() ? [{ key: 'search', label: `"${searchQuery.trim()}"`, remove: () => setSearchQuery('') }] : []),
    ...(locationQuery.trim() ? [{ key: 'loc', label: `📍 ${locationQuery.trim()}`, remove: () => setLocationQuery('') }] : []),
    ...filters.jobType.map((t) => ({ key: `type-${t}`, label: t, remove: () => toggleType(t) })),
    ...(filters.mode !== 'any' ? [{ key: 'mode', label: WORK_MODES.find((m) => m.value === filters.mode)?.label, remove: () => setFilters((p) => ({ ...p, mode: 'any' })) }] : []),
    ...(filters.salary !== 'any' ? [{ key: 'salary', label: SALARY_RANGES.find((r) => r.value === filters.salary)?.label, remove: () => setFilters((p) => ({ ...p, salary: 'any' })) }] : []),
  ];

  const filterPanelProps = {
    filters,
    jobTypes,
    typeCounts,
    onToggleType: toggleType,
    onModeChange: (v) => setFilters((p) => ({ ...p, mode: v })),
    onSalaryChange: (v) => setFilters((p) => ({ ...p, salary: v })),
    onClear: clearAll,
    activeCount: activeFilterCount,
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        {/* ═══ Hero + Search ═══ */}
        <div className="mt-8 pt-8 lg:pt-14 pb-8">
          <div className="relative overflow-hidden bg-mesh rounded-[32px] p-6 sm:p-10 mb-6 text-foreground">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
              <svg viewBox="0 0 400 400" className="w-full h-full rotate-12"><path d="M0 0 L400 0 L400 400 Z" fill="currentColor" /></svg>
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 leading-[1.1]">
                Find your <span className="text-emerald-500 italic">dream job</span>
              </h1>
              <p className="text-muted-foreground font-medium mb-6 max-w-xl">
                Browse our latest job openings and apply to the best opportunities today.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-bold border-border">
                  <HiOutlineBriefcase className="w-3.5 h-3.5 text-emerald-500" /> {jobs.length} open positions
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-bold border-border">
                  <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-emerald-500" /> {orgCount} companies
                </Badge>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex flex-col md:flex-row bg-card rounded-2xl shadow-xl shadow-emerald-500/5 border border-border overflow-hidden">
            <div className="flex-1 flex items-center px-5 py-4 border-b md:border-b-0 md:border-r border-border">
              <HiOutlineMagnifyingGlass className="text-muted-foreground mr-3 w-5 h-5 shrink-0" />
              <Input
                type="text"
                placeholder="Job title, company, or skill"
                className="w-full border-0 bg-card shadow-none focus-visible:ring-0 px-0 h-auto font-medium placeholder:text-muted-foreground/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-muted-foreground/50 hover:text-foreground transition-colors ml-2 shrink-0" aria-label="Clear search">
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1 flex items-center px-5 py-4 border-b md:border-b-0 md:border-r border-border">
              <HiOutlineMapPin className="text-muted-foreground mr-3 w-5 h-5 shrink-0" />
              <Input
                type="text"
                placeholder="Location"
                className="w-full border-0 bg-card shadow-none focus-visible:ring-0 px-0 h-auto font-medium placeholder:text-muted-foreground/50"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
              {locationQuery && (
                <button onClick={() => setLocationQuery('')} className="text-muted-foreground/50 hover:text-foreground transition-colors ml-2 shrink-0" aria-label="Clear location">
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-16">
          {/* ═══ Desktop Sidebar ═══ */}
          {showSidebar && (
            <aside className="hidden lg:block w-[300px] shrink-0 lg:self-start">
              <div className="bg-card rounded-3xl border border-border p-6 lg:sticky lg:top-24">
                <FilterPanel {...filterPanelProps} />
              </div>
            </aside>
          )}

          {/* ═══ Mobile Filter Sheet ═══ */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent side="left" className="w-[320px] sm:w-[360px] overflow-y-auto p-6">
              <SheetHeader className="mb-4">
                <SheetTitle>Filter jobs</SheetTitle>
                <SheetDescription>Narrow down opportunities to what matters to you.</SheetDescription>
              </SheetHeader>
              <FilterPanel {...filterPanelProps} />
              <Button
                onClick={() => setSheetOpen(false)}
                className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
              >
                Show {sortedJobs.length} {sortedJobs.length === 1 ? 'job' : 'jobs'}
              </Button>
            </SheetContent>
          </Sheet>

          {/* ═══ Main Content ═══ */}
          <main className="flex-1 min-w-0">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center justify-between gap-3">
                {error}
                <Button variant="outline" size="sm" onClick={fetchJobs} className="border-destructive/30 text-destructive hover:bg-destructive/10 shrink-0">
                  Retry
                </Button>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <p className="text-muted-foreground font-bold text-sm">
                <span className="text-foreground text-base">{sortedJobs.length}</span>{' '}
                {sortedJobs.length === 1 ? 'job' : 'jobs'} found
                {!loading && sortedJobs.length < jobs.length && (
                  <span className="text-muted-foreground/50 font-medium"> (filtered from {jobs.length})</span>
                )}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[170px] rounded-xl bg-card border-border text-xs font-bold">
                    <HiOutlineArrowsUpDown className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="title-az">Title A–Z</SelectItem>
                    <SelectItem value="title-za">Title Z–A</SelectItem>
                    <SelectItem value="salary-high">Highest salary</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile: open sheet */}
                <Button
                  variant="outline"
                  onClick={() => setSheetOpen(true)}
                  className="lg:hidden rounded-xl bg-card border-border text-xs font-bold relative"
                >
                  <HiOutlineFunnel className="w-4 h-4 text-emerald-500" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {/* Desktop: toggle sidebar */}
                <Button
                  variant="outline"
                  onClick={() => setShowSidebar((s) => !s)}
                  className="hidden lg:inline-flex rounded-xl bg-card border-border text-xs font-bold"
                >
                  <HiOutlineFunnel className="w-4 h-4 text-emerald-500" />
                  {showSidebar ? 'Hide filters' : 'Show filters'}
                </Button>
              </div>
            </div>

            {/* Active filter chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {chips.map((chip) => (
                  <Badge key={chip.key} variant="secondary" className="rounded-full px-3 py-1.5 text-xs font-bold border-border gap-1.5">
                    {chip.label}
                    <button onClick={chip.remove} className="hover:text-destructive transition-colors" aria-label={`Remove ${chip.label}`}>
                      <HiOutlineXMark className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <button onClick={clearAll} className="text-xs font-bold text-emerald-500 hover:underline ml-1">
                  Clear all
                </button>
              </div>
            )}

            {/* Job list */}
            <div className="space-y-4">
              {loading ? (
                <>
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                </>
              ) : visibleJobs.length > 0 ? (
                <>
                  {visibleJobs.map((job, i) => {
                    const posted = timeAgo(job.created_at);
                    return (
                      <motion.div
                        key={job.job_id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.3) }}
                      >
                        <Link
                          href={`/jobs/${job.job_id}`}
                          className="block group bg-card rounded-3xl border border-border p-5 sm:p-6 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
                        >
                          <div className="flex items-start gap-4 sm:gap-5">
                            {/* Logo */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 group-hover:scale-105 transition-all duration-300">
                              {job.organization_details?.logo_url ? (
                                <div className="w-full h-full bg-white rounded-2xl p-1.5 flex items-center justify-center">
                                  <Image src={job.organization_details.logo_url} alt="" className="w-full h-full object-contain" />
                                </div>
                              ) : job.organization_details?.name ? (
                                <span className="text-lg font-black tracking-tight">
                                  {job.organization_details.name.charAt(0).toUpperCase()}
                                </span>
                              ) : (
                                <HiOutlineDocumentText className="w-6 h-6" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Title row */}
                              <div className="flex items-start justify-between gap-3 sm:gap-4">
                                <div className="min-w-0">
                                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors truncate">
                                    {job.job_title || 'Untitled Position'}
                                  </h3>
                                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                                    {job.organization_details?.name || 'Unknown Organization'}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                  <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 px-3 py-1">
                                    {job.job_type || 'N/A'}
                                  </Badge>
                                  {posted && (
                                    <span className="text-[10px] font-bold text-muted-foreground/50 flex items-center gap-1">
                                      <HiOutlineClock className="w-3 h-3" /> {posted}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              {job.job_description && (
                                <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                  {job.job_description}
                                </p>
                              )}

                              {/* Meta chips */}
                              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary border border-border text-xs sm:text-sm font-semibold">
                                  <HiOutlineMapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                                  {job.location || 'Remote / Anywhere'}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary border border-border text-xs sm:text-sm font-semibold">
                                  <HiOutlineCurrencyDollar className="w-4 h-4 text-emerald-500 shrink-0" />
                                  {job.salary_range || 'Competitive'}
                                </span>
                              </div>

                              {/* Footer */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
                                <div className="flex gap-2 flex-wrap items-center min-w-0">
                                  {job.key_skills?.length > 0 ? (
                                    job.key_skills.slice(0, 3).map((skill) => (
                                      <Badge key={skill} variant="secondary" className="text-[10px] font-bold border-border rounded-lg px-2.5 py-1">
                                        {skill}
                                      </Badge>
                                    ))
                                  ) : (
                                    <Badge variant="secondary" className="text-[10px] font-bold text-muted-foreground/50 border-border rounded-lg px-2.5 py-1">
                                      No skills listed
                                    </Badge>
                                  )}
                                  {job.key_skills?.length > 3 && (
                                    <span className="text-[10px] font-bold text-muted-foreground/40 px-1">
                                      +{job.key_skills.length - 3} more
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-emerald-500 group-hover:gap-3 transition-all shrink-0">
                                  View Details <HiOutlineChevronRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Load more */}
                  {sortedJobs.length > visibleCount && (
                    <div className="flex flex-col items-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="rounded-xl bg-card border-border font-bold text-sm px-8"
                      >
                        Load more jobs
                      </Button>
                      <span className="text-[11px] text-muted-foreground/50 font-semibold">
                        Showing {visibleJobs.length} of {sortedJobs.length}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 sm:py-20 bg-card rounded-[32px] border border-border px-4">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiOutlineBriefcase size={40} className="text-muted-foreground/30" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-2">No jobs found</h3>
                  <p className="text-muted-foreground font-medium mb-6">Try adjusting your search or filters</p>
                  <Button onClick={clearAll} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                    <HiOutlineXMark className="w-4 h-4" /> Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}