// components/profile-skeleton.jsx
'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function SkeletonShell({ className, children }) {
    return (
        <section
            className={cn(
                'overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 shadow-sm backdrop-blur',
                className
            )}
        >
            {children}
        </section>
    );
}

function SkeletonSectionShell({ children, hasAction = false }) {
    return (
        <SkeletonShell>
            <div className="p-5 md:p-6 lg:p-7">
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                        {/* subtitle */}
                        <Skeleton className="h-3 w-16 rounded-full" />
                        {/* title */}
                        <Skeleton className="mt-1 h-5 w-32 rounded-full" />
                    </div>
                    {hasAction && <Skeleton className="h-6 w-20 rounded-full" />}
                </div>
                {children}
            </div>
        </SkeletonShell>
    );
}

export default function ProfilePageSkeleton() {
    return (
        <div className="relative mx-auto w-full max-w-5xl px-4 py-4 pb-12 md:px-6 lg:px-8 lg:py-8">
            <div className="space-y-6">
                {/* ─── Hero / Header Shell ─── */}
                <SkeletonShell className="overflow-hidden border-border/70 bg-card/70 shadow-[0_20px_64px_-48px_rgba(16,185,129,0.34)]">
                    <div className="relative overflow-hidden p-4 md:p-5">
                        {/* decorative gradient overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.10),transparent_40%,rgba(6,182,212,0.08)_72%,transparent_100%)]" />
                        <div className="absolute -right-16 top-0 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />

                        <div className="relative space-y-5">
                            {/* role chip */}
                            <Skeleton className="h-7 w-24 rounded-full" />

                            <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
                                {/* avatar */}
                                <div className="flex size-20 items-center justify-center overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/80 shadow-sm sm:size-24">
                                    <Skeleton className="size-full rounded-none" />
                                </div>

                                <div className="space-y-4">
                                    {/* display name */}
                                    <Skeleton className="h-8 w-56 max-w-full rounded-lg md:h-9" />

                                    {/* email + last updated badges */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Skeleton className="h-9 w-52 rounded-full" />
                                        <Skeleton className="h-9 w-32 rounded-full" />
                                    </div>

                                    {/* action buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        <Skeleton className="h-10 w-36 rounded-2xl" />
                                        <Skeleton className="h-10 w-44 rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SkeletonShell>

                {/* ─── About me section ─── */}
                <SkeletonSectionShell>
                    <div className="space-y-3">
                        {/* bio lines */}
                        <Skeleton className="h-4 w-full rounded-full" />
                        <Skeleton className="h-4 w-[92%] rounded-full" />
                        <Skeleton className="h-4 w-[78%] rounded-full" />
                    </div>
                </SkeletonSectionShell>

                {/* ─── Links & portfolio section ─── */}
                <SkeletonSectionShell hasAction>
                    <div className="space-y-3">
                        {/* link item 1 */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-4 rounded-full" />
                                    <Skeleton className="h-4 w-20 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-56 rounded-full" />
                            </div>
                        </div>

                        {/* link item 2 */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-4 rounded-full" />
                                    <Skeleton className="h-4 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-48 rounded-full" />
                            </div>
                        </div>
                    </div>
                </SkeletonSectionShell>

                {/* ─── Contact info section ─── */}
                <SkeletonSectionShell>
                    <div className="space-y-5">
                        {/* phone field */}
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-14 rounded-full" />
                            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                                <Skeleton className="size-4 rounded-full" />
                                <Skeleton className="h-4 w-36 rounded-full" />
                            </div>
                        </div>

                        {/* email field */}
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-14 rounded-full" />
                            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                                <Skeleton className="size-4 rounded-full" />
                                <Skeleton className="h-4 w-52 rounded-full" />
                            </div>
                        </div>
                    </div>
                </SkeletonSectionShell>
            </div>
        </div>
    );
}