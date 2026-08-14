'use client';

import React, {useEffect, useState} from 'react';
import {api} from '@/utils/api';
import {useAuth} from '@/context/AuthContext';
import Link from 'next/link';
import {cn} from '@/lib/utils';
import {
    HiOutlinePencilSquare,
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineGlobeAlt,
    HiOutlineEnvelope,
    HiOutlinePhone,
    HiOutlineArrowRight,
    HiOutlineDocumentDuplicate,
    HiOutlineClock,
} from 'react-icons/hi2';
import Image from 'next/image';
import ProfilePageSkeleton from '@/components/users/ProfileSkeleton';

function Chip({children, tone = 'neutral', className}) {
    const tones = {
        neutral: 'border-border/70 bg-background/70 text-muted-foreground',
        emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        cyan: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
        white: 'border-white/20 bg-white/10 text-white',
    };

    return (
        <span
            className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]', tones[tone], className)}>
      {children}
    </span>
    );
}

function ActionButton({children, variant = 'primary', className, ...props}) {
    const styles = {
        primary: 'border border-primary/20 bg-primary text-primary-foreground shadow-sm shadow-emerald-500/15 hover:bg-primary/90',
        ghost: 'border border-border/70 bg-background/70 text-foreground hover:bg-muted/70',
        white: 'border border-white/15 bg-white/10 text-white hover:bg-white/15',
    };

    return (
        <button
            {...props}
            className={cn('inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50', styles[variant], className)}
        >
            {children}
        </button>
    );
}

function Shell({className, children}) {
    return (
        <section
            className={cn('overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 shadow-sm backdrop-blur', className)}>
            {children}
        </section>
    );
}

function SectionShell({title, subtitle, action, children, className}) {
    return (
        <Shell className={className}>
            <div className="p-5 md:p-6 lg:p-7">
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{subtitle}</p>
                        <h3 className="mt-1 text-base md:text-lg font-semibold tracking-tight">{title}</h3>
                    </div>
                    {action}
                </div>
                {children}
            </div>
        </Shell>
    );
}

function InfoField({icon: Icon, label, value, editing, onChange, placeholder, type = 'text', multiline = false}) {
    return (
        <div className="space-y-2">
            <label
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
            {editing ? (
                multiline ? (
                    <textarea
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="min-h-45 w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/30 focus:bg-background resize-none"
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/30 focus:bg-background"
                    />
                )
            ) : (
                <div
                    className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm">
                    {Icon && <Icon className="h-4 w-4 text-primary"/>}
                    <span className="min-w-0 truncate text-foreground/90">{value || 'Not provided'}</span>
                </div>
            )}
        </div>
    );
}

function ProfileStat({label, value, icon: Icon, tone = 'emerald'}) {
    const tones = {
        emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        cyan: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
        violet: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400',
    };

    return (
        <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
                </div>
                <div className={cn('grid size-10 place-items-center rounded-2xl border', tones[tone])}>
                    <Icon className="size-4"/>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const {user} = useAuth();
    const role = user?.role || 'CANDIDATE';

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        phone: '',
        extra_data: {},
    });
    const [newLink, setNewLink] = useState({key: '', value: ''});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await api.get('/accounts/profiles/me/');

                setProfile(profileData);
                setFormData({
                    first_name: profileData.first_name || '',
                    last_name: profileData.last_name || '',
                    bio: profileData.bio || '',
                    phone: profileData.phone || '',
                    extra_data: profileData.extra_data || {},
                });
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchProfile();
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = await api.put('/accounts/profiles/me/', formData);
            setProfile(data);
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                bio: data.bio || '',
                phone: data.phone || '',
                extra_data: data.extra_data || {},
            });
            setIsEditing(false);
        } catch (err) {
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            bio: profile?.bio || '',
            phone: profile?.phone || '',
            extra_data: profile?.extra_data || {},
        });
        setNewLink({key: '', value: ''});
        setIsEditing(false);
    };

    const addLink = () => {
        if (!newLink.key || !newLink.value) return;

        setFormData({
            ...formData,
            extra_data: {...formData.extra_data, [newLink.key]: newLink.value},
        });
        setNewLink({key: '', value: ''});
    };

    const removeLink = (key) => {
        const updated = {...formData.extra_data};
        delete updated[key];
        setFormData({...formData, extra_data: updated});
    };

    const displayName = profile?.first_name || profile?.last_name
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
        : 'Your Profile';
    const links = Object.entries(isEditing ? formData.extra_data : (profile?.extra_data || {}));
    const hasLinks = links.length > 0;
    const lastUpdated = profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'New profile';


    if (loading) return <ProfilePageSkeleton/>;

    return (


        <div className="relative mx-auto w-full max-w-5xl px-4 py-4 pb-12 md:px-6 lg:px-8 lg:py-8">


            <div className="space-y-6">
                <Shell
                    className="overflow-hidden border-border/70 bg-card/70 shadow-[0_20px_64px_-48px_rgba(16,185,129,0.34)]">
                    <div className="relative overflow-hidden p-4 md:p-5">
                        <div
                            className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.10),transparent_40%,rgba(6,182,212,0.08)_72%,transparent_100%)]"/>
                        <div className="absolute -right-16 top-0 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl"/>
                        <div className="relative space-y-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <Chip tone="neutral">{role}</Chip>
                            </div>

                            <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
                                <div
                                    className="relative flex size-20 items-center justify-center overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/80 shadow-sm sm:size-24">
                                    {profile?.avatar_url || user?.google_picture ? (
                                        <img src={profile?.avatar_url || user.google_picture} alt="Avatar"
                                             className="h-full w-full object-cover" height={80} width={80}/>
                                    ) : (
                                        <span className="text-4xl font-semibold tracking-tight text-primary">
                      {user?.email?.[0]?.toUpperCase() || '?'}
                    </span>
                                    )}
                                    <span
                                        className="absolute bottom-2 right-2 size-3 rounded-full border border-background bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"/>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <h1 className="max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">{displayName}</h1>

                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span
                        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5">
                      <HiOutlineEnvelope className="h-4 w-4 text-primary"/>
                      <span className="truncate">{profile?.user?.email || user?.email}</span>
                    </span>
                                        <span
                                            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5">
                      <HiOutlineClock className="h-4 w-4 text-primary"/>
                      <span>{lastUpdated}</span>
                    </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {isEditing ? (
                                            <>
                                                <ActionButton variant="primary" onClick={handleSave} disabled={saving}>
                                                    <HiOutlineCheck className="h-4 w-4"/>
                                                    {saving ? 'Saving...' : 'Save changes'}
                                                </ActionButton>
                                                <ActionButton variant="ghost" onClick={handleCancel} disabled={saving}>
                                                    <HiOutlineXMark className="h-4 w-4"/>
                                                    Cancel
                                                </ActionButton>
                                            </>
                                        ) : (
                                            <ActionButton variant="primary" onClick={() => setIsEditing(true)}>
                                                <HiOutlinePencilSquare className="h-4 w-4"/>
                                                Edit profile
                                            </ActionButton>
                                        )}
                                        <Link
                                            href={role === 'CANDIDATE' ? '/candidate' : '/recruiter'}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:bg-muted/70"
                                        >
                                            <HiOutlineArrowRight className="h-4 w-4"/>
                                            Back to dashboard
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Shell>

                <SectionShell
                    subtitle="Story"
                    title="About me"
                    action={isEditing ?
                        <span className="text-xs font-medium text-muted-foreground">Editing enabled</span> : null}
                >
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <InfoField
                                    label="First name"
                                    editing
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                    placeholder="First name"
                                />
                                <InfoField
                                    label="Last name"
                                    editing
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                    placeholder="Last name"
                                />
                            </div>
                            <InfoField
                                label="Bio"
                                editing
                                multiline
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground md:text-[15px]">
                                {profile?.bio || 'No bio provided yet.'}
                            </p>

                        </div>
                    )}
                </SectionShell>

                <SectionShell subtitle="Links" title="Links & portfolio"
                              action={hasLinks ? <Chip tone="neutral">{links.length} saved</Chip> : null}>
                    {links.length === 0 && !isEditing ? (
                        <div
                            className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
                            No links added yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {links.map(([key, value]) => (
                                <div key={key}
                                     className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <HiOutlineGlobeAlt className="h-4 w-4 shrink-0 text-primary"/>
                                            <span
                                                className="text-sm font-semibold capitalize text-foreground">{key}</span>
                                        </div>
                                        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank"
                                           rel="noopener noreferrer"
                                           className="mt-2 block max-w-full truncate text-sm text-muted-foreground hover:underline">
                                            {value}
                                        </a>
                                    </div>
                                    {isEditing && (
                                        <button onClick={() => removeLink(key)}
                                                className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                                aria-label={`Remove ${key}`}>
                                            <HiOutlineXMark className="h-4 w-4"/>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {isEditing && (
                        <div className="mt-6 rounded-3xl border border-border/70 bg-background/70 p-4">
                            <div className="grid gap-3 md:grid-cols-[0.9fr_1.2fr_auto] md:items-end">
                                <InfoField
                                    label="Label"
                                    editing
                                    value={newLink.key}
                                    onChange={(e) => setNewLink({...newLink, key: e.target.value})}
                                    placeholder="LinkedIn"
                                />
                                <InfoField
                                    label="URL"
                                    editing
                                    value={newLink.value}
                                    onChange={(e) => setNewLink({...newLink, value: e.target.value})}
                                    placeholder="https://..."
                                />
                                <ActionButton variant="primary" onClick={addLink}>
                                    <HiOutlineCheck className="h-4 w-4"/>
                                    Add
                                </ActionButton>
                            </div>
                        </div>
                    )}
                </SectionShell>

                <SectionShell subtitle="Contact" title="Contact info">
                    <div className="space-y-5">
                        <InfoField
                            icon={HiOutlinePhone}
                            label="Phone"
                            value={isEditing ? formData.phone : profile?.phone}
                            editing={isEditing}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+1 234 567 890"
                        />

                        <div className="space-y-2">
                            <label
                                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                            <div
                                className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm">
                                <HiOutlineEnvelope className="h-4 w-4 text-primary"/>
                                <span className="min-w-0 truncate">{profile?.user?.email || user?.email}</span>
                            </div>
                        </div>
                    </div>
                </SectionShell>
            </div>
        </div>
    );
}
