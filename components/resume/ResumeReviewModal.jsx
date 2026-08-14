'use client';

import {useState, Fragment} from 'react';
import {FiX, FiChevronLeft, FiChevronRight, FiCheck} from 'react-icons/fi';
import {resumeApi} from '@/utils/resume_api';

const STEPS = [
    {id: 'summary', label: 'Summary'},
    {id: 'skills', label: 'Skills'},
    {id: 'experience', label: 'Work Experience'},
    {id: 'projects', label: 'Projects'},
    {id: 'other', label: 'Other Info'},
];

export default function ResumeReviewModal({resumeData: initial, cloudinaryUrl, rawFullText, onClose}) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({...initial});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const update = (field, value) => setData({...data, [field]: value});

    const handleFinalize = async () => {
        setSaving(true);
        setError('');
        try {
            await resumeApi.post('/resumes/save', {
                resume_data: data,
                cloudinary_url: cloudinaryUrl,
                raw_full_text: rawFullText,
            });
            onClose(true);
        } catch (err) {
            setError(err?.message || 'Failed to save resume');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex sm:items-center sm:justify-center sm:p-4">
            <div
                className="bg-card w-full h-[100dvh] sm:h-[680px] sm:max-h-[90vh] sm:max-w-2xl lg:max-w-3xl sm:rounded-3xl shadow-2xl flex flex-col border-0 sm:border border-border">
                <div
                    className="flex items-center justify-between p-5 sm:p-6 border-b border-border shrink-0"
                    style={{paddingTop: 'max(1.25rem, env(safe-area-inset-top))'}}
                >
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-foreground">Review & Edit Resume</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Step {step + 1} of {STEPS.length} &middot; {STEPS[step].label}</p>
                    </div>
                    <button onClick={() => onClose(false)}
                            className="p-1 -m-1 text-muted-foreground hover:text-foreground transition-all shrink-0"
                            aria-label="Close">
                        <FiX className="w-6 h-6"/>
                    </button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center px-5 sm:px-6 pt-4 shrink-0">
                    {STEPS.map((s, i) => (
                        <Fragment key={s.id}>
                            <button
                                onClick={() => setStep(i)}
                                className="flex flex-col items-center gap-1 shrink-0"
                                aria-label={`Go to ${s.label}`}
                                aria-current={i === step ? 'step' : undefined}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        i === step
                                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/15'
                                            : i < step
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {i < step ? <FiCheck className="w-4 h-4"/> : i + 1}
                                </div>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-1 rounded-full transition-colors ${i < step ? 'bg-emerald-500' : 'bg-muted'}`}/>
                            )}
                        </Fragment>
                    ))}
                </div>

                {/* flex-col so a step's content can grow to fill remaining space on mobile */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-4 min-h-0">
                    {error && (
                        <div
                            className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium shrink-0">
                            {error}
                        </div>
                    )}

                    {step === 0 && (
                        <div className="flex-1 flex flex-col gap-3 min-h-0">
                            <h3 className="text-sm font-bold text-foreground shrink-0">Professional Summary</h3>
                            <textarea
                                value={data.summary || ''}
                                onChange={(e) => update('summary', e.target.value)}
                                rows={6}
                                className="w-full flex-1 min-h-0 px-4 py-3 text-sm bg-card text-foreground border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                placeholder="Write a professional summary..."
                            />
                            <p className="text-xs text-muted-foreground shrink-0">A 3-4 sentence overview of your
                                profile, experience level, and key strengths.</p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="flex-1 flex flex-col gap-3 min-h-0">
                            <div className="flex justify-between items-center shrink-0">
                                <h3 className="text-sm font-bold text-foreground">Skills</h3>
                            </div>
                            <textarea
                                value={(data.skills || []).join('\n')}
                                onChange={(e) => update('skills', e.target.value.split('\n').filter(Boolean))}
                                rows={8}
                                className="w-full flex-1 min-h-0 px-4 py-3 text-sm bg-card text-foreground border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono"
                                placeholder="One skill per line:&#10;React&#10;TypeScript&#10;Node.js&#10;PostgreSQL"
                            />
                            <p className="text-xs text-muted-foreground shrink-0">One skill per line.</p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex-1 flex flex-col gap-3 min-h-0">
                            <h3 className="text-sm font-bold text-foreground shrink-0">Work Experience</h3>
                            <textarea
                                value={(data.work_experience || []).join('\n---\n')}
                                onChange={(e) => update('work_experience', e.target.value.split('\n---\n').filter(Boolean))}
                                rows={10}
                                className="w-full flex-1 min-h-0 px-4 py-3 text-sm bg-card text-foreground border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono"
                                placeholder="Senior Engineer at Company — led team, built features.&#10;---&#10;Junior Dev at Startup — implemented APIs."
                            />
                            <p className="text-xs text-muted-foreground shrink-0">Separate each role with <code
                                className="bg-muted px-1 rounded">---</code> on its own line.</p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex-1 flex flex-col gap-3 min-h-0">
                            <h3 className="text-sm font-bold text-foreground shrink-0">Projects</h3>
                            <textarea
                                value={(data.projects || []).join('\n---\n')}
                                onChange={(e) => update('projects', e.target.value.split('\n---\n').filter(Boolean))}
                                rows={10}
                                className="w-full flex-1 min-h-0 px-4 py-3 text-sm bg-card text-foreground border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono"
                                placeholder="Project Alpha — built authentication system.&#10;---&#10;Project Beta — designed dashboard."
                            />
                            <p className="text-xs text-muted-foreground shrink-0">Separate each project with <code
                                className="bg-muted px-1 rounded">---</code> on its own line.</p>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex-1 flex flex-col gap-4 min-h-0">
                            <h3 className="text-sm font-bold text-foreground shrink-0">Additional Information</h3>

                            <div className="shrink-0">
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Job
                                    Title</label>
                                <input
                                    type="text"
                                    value={data.title || ''}
                                    onChange={(e) => update('title', e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-card text-foreground border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Senior Frontend Engineer"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Years of
                                        Experience</label>
                                    <input
                                        type="number"
                                        value={data.years_experience ?? ''}
                                        onChange={(e) => update('years_experience', e.target.value ? parseInt(e.target.value) : null)}
                                        className="w-full px-4 py-2.5 text-sm bg-card text-foreground border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="8"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Education
                                        Level</label>
                                    <select
                                        value={data.education_level || ''}
                                        onChange={(e) => update('education_level', e.target.value || null)}
                                        className="w-full px-4 py-2.5 text-sm bg-card text-foreground border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        <option value="">Not specified</option>
                                        <option value="phd">PhD</option>
                                        <option value="master">Master</option>
                                        <option value="bachelor">Bachelor</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="matric">Matric</option>
                                    </select>
                                </div>
                            </div>

                            <div className="shrink-0">
                                <label
                                    className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone</label>
                                <input
                                    type="tel"
                                    value={data.candidate_phone || ''}
                                    onChange={(e) => update('candidate_phone', e.target.value || null)}
                                    className="w-full px-4 py-2.5 text-sm bg-card text-foreground border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="+1-202-555-0143"
                                />
                            </div>

                            <div className="flex-1 flex flex-col gap-1.5 min-h-0">
                                <label className="text-xs font-semibold text-muted-foreground shrink-0">Links (one per
                                    line)</label>
                                <textarea
                                    value={(data.links || []).join('\n')}
                                    onChange={(e) => update('links', e.target.value.split('\n').filter(Boolean))}
                                    rows={4}
                                    className="w-full flex-1 sm:flex-none min-h-0 px-4 py-3 text-sm bg-card text-foreground border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono"
                                    placeholder="https://linkedin.com/in/...&#10;https://github.com/..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className="flex items-center justify-between gap-3 p-5 sm:p-6 border-t border-border shrink-0"
                    style={{paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))'}}
                >
                    <button
                        onClick={() => setStep(Math.max(0, step - 1))}
                        disabled={step === 0}
                        className="flex items-center gap-2 px-5 h-11 sm:h-12 text-foreground bg-secondary rounded-xl font-bold hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <FiChevronLeft className="w-4 h-4"/> Back
                    </button>

                    {step < STEPS.length - 1 ? (
                        <button
                            onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
                            className="flex items-center gap-2 px-5 h-11 sm:h-12 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                        >
                            Next <FiChevronRight className="w-4 h-4"/>
                        </button>
                    ) : (
                        <button
                            onClick={handleFinalize}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 h-11 sm:h-12 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50 active:scale-95"
                        >
                            {saving ? (
                                <>
                                    <div
                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiCheck className="w-5 h-5"/> Finalize & Save
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}