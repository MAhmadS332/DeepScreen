"use client";

import {useState, useEffect} from "react";
import {pdf, PDFViewer} from "@react-pdf/renderer";
import {Poppins} from "next/font/google";
import {useParams} from "next/navigation";
import {
    HiOutlineArrowPath,
    HiOutlineArrowDownTray,
    HiOutlineDocumentText,
    HiOutlineCloudArrowUp,
    HiOutlineCheck,
    HiOutlinePencilSquare,
} from "react-icons/hi2";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumeTemplate from "@/components/resume/ResumeTemplate";
import ResumeReviewModal from "@/components/resume/ResumeReviewModal";
import {resumeApi} from "@/utils/resume_api";
import {useRouter} from "next/navigation";
import defaultResumeData from "@/constants/resume";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export default function ResumePage() {
    const {resumeBuildId} = useParams();
    const router = useRouter();
    const [resumeData, setResumeData] = useState(defaultResumeData);
    const [showPreview, setShowPreview] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [templateId, setTemplateId] = useState(Number(resumeBuildId) || 1);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [reviewData, setReviewData] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [mobileView, setMobileView] = useState("edit"); // "edit" | "preview" (mobile/tablet only, like Overleaf)
    const [templateDropDown, setTemplateDropDown] = useState(false);

    useEffect(() => {
        if (resumeBuildId) {
            setTemplateId(Number(resumeBuildId));
        }
    }, [resumeBuildId]);

    const toggleTemplateDropDown = () => {
        setTemplateDropDown(!templateDropDown)
    }

    const handleDownloadPdf = async () => {
        const blob = await pdf(
            <ResumeTemplate templateId={templateId} data={resumeData}/>,
        ).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${resumeData.basics.name.replace(/\s+/g, "_")}_Resume.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveResume = async () => {
        setIsSaving(true);
        setSaveError("");
        setSaveSuccess(false);
        try {
            const blob = await pdf(
                <ResumeTemplate templateId={templateId} data={resumeData}/>,
            ).toBlob();
            const formData = new FormData();
            formData.append(
                "pdf_file",
                blob,
                `${resumeData.basics.name.replace(/\s+/g, "_")}_Resume.pdf`,
            );
            formData.append("resume_data", JSON.stringify(resumeData));
            const result = await resumeApi.post("/resumes/build", formData);
            setReviewData(result);
            setShowReviewModal(true);
        } catch (err) {
            setSaveError(err?.message || "Failed to save resume");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCompile = () => {
        setIsCompiling(true);
        setTimeout(() => {
            setShowPreview(true);
            setIsCompiling(false);
            setMobileView("preview");
        }, 500);
    };

    return (
        <div
            className={`min-h-screen pt-10 flex flex-col w-full  ${poppins.variable} font-sans overflow-x-hidden`}
            style={{fontFamily: "var(--font-poppins)"}}
        >
            <div className="border-b border-border shadow-sm">
                <div className="w-full px-4 md:px-6 pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="p-3 sm:p-4 bg-card border border-border rounded-2xl hover:bg-secondary transition-all shadow-sm hover:shadow-md group shrink-0"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-muted-foreground group-hover:-translate-x-1 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                                    Resume Builder
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Create your professional resume with ease
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                            {saveError && (
                                <span
                                    className="text-xs text-destructive font-semibold bg-destructive/10 px-3 py-1.5 rounded-lg">
                  {saveError}
                </span>
                            )}
                            <button
                                onClick={handleSaveResume}
                                disabled={isSaving}
                                className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${
                                    saveSuccess
                                        ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-400"
                                        : "bg-primary text-primary-foreground hover:bg-emerald-700 hover:shadow-emerald-200/50 disabled:opacity-50"
                                }`}
                            >
                                {isSaving ? (
                                    <>
                                        <div
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                        Saving...
                                    </>
                                ) : saveSuccess ? (
                                    <>
                                        <HiOutlineCheck className="w-5 h-5"/>
                                        Saved
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineCloudArrowUp className="w-5 h-5"/>
                                        <span className="hidden sm:inline">Save Resume</span>
                                        <span className="sm:hidden">Save</span>
                                    </>
                                )}
                            </button>
                            {showPreview && (
                                <button
                                    onClick={handleDownloadPdf}
                                    className="px-4 py-2.5 sm:py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <HiOutlineArrowDownTray className="w-5 h-5"/>
                                    <span className="hidden sm:inline text-sm">PDF</span>
                                </button>
                            )}
                            <div className="relative group">
                                <button
                                    onClick={toggleTemplateDropDown}
                                    className="flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-5 sm:py-3 bg-card text-foreground border border-border rounded-xl font-bold hover:bg-secondary transition-all shadow-sm">
                  <span className="text-sm max-w-[9rem] sm:max-w-none truncate">
                    {templateId === 1 && "LaTeX Professional"}
                      {templateId === 2 && "Creative Visual"}
                      {templateId === 3 && "Modern Minimal"}
                      {templateId === 4 && "Executive Corporate"}
                  </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 shrink-0 group-hover:rotate-180 transition-transform duration-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {templateDropDown && <div
                                    className="absolute top-full right-0 mt-2 w-52 sm:w-58 bg-card border border-border rounded-xl shadow-xl transition-all duration-200 z-50 py-2">
                                    {[
                                        {
                                            id: 1,
                                            name: "LaTeX Professional",
                                            desc: "Academic & Technical",
                                        },
                                        {id: 2, name: "Creative Visual", desc: "Design & Arts"},
                                        {id: 3, name: "Modern Minimal", desc: "Clean & Simple"},
                                        {
                                            id: 4,
                                            name: "Executive Corporate",
                                            desc: "Business & Management",
                                        },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setTemplateId(t.id);
                                                setShowPreview(false);
                                                setTemplateDropDown(false);
                                            }}
                                            className={`w-full flex flex-col px-5 py-3 transition-all ${
                                                templateId === t.id
                                                    ? "bg-emerald-500/10 border-r-4 border-emerald-500"
                                                    : "hover:bg-muted border-r-4 border-transparent"
                                            }`}
                                        >
                      <span
                          className={`text-sm font-bold ${templateId === t.id ? "text-emerald-500" : "text-foreground"}`}
                      >
                        {t.name}
                      </span>
                                            <span className="text-xs text-muted-foreground font-medium">
                        {t.desc}
                      </span>
                                        </button>
                                    ))}
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 sm:p-6">
                <div className="lg:hidden mb-4 flex p-1 bg-muted rounded-xl">
                    <button
                        onClick={() => setMobileView("edit")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            mobileView === "edit"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground"
                        }`}
                    >
                        <HiOutlinePencilSquare className="w-4 h-4"/>
                        Edit
                    </button>
                    <button
                        onClick={() => setMobileView("preview")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            mobileView === "preview"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground"
                        }`}
                    >
                        <HiOutlineDocumentText className="w-4 h-4"/>
                        Preview
                    </button>
                </div>

                <div className="lg:h-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div
                        className={`${mobileView === "edit" ? "block" : "hidden"} lg:block bg-card overflow-hidden rounded-xl shadow-lg border border-border h-[calc(100vh-13rem)] lg:h-full`}
                    >
                        <div className="h-full flex flex-col">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-base font-bold text-foreground">
                                    Edit Resume Data
                                </h2>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Fill in your information and compile to preview
                                </p>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <ResumeForm data={resumeData} onChange={setResumeData}/>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`${mobileView === "preview" ? "block" : "hidden"} lg:block bg-muted overflow-hidden rounded-xl shadow-lg border border-border h-[calc(100vh-13rem)] lg:h-full`}
                    >
                        <div className="h-full flex flex-col">
                            <div
                                className="flex justify-between items-center gap-3 px-4 sm:px-6 py-4 border-b border-border bg-card">
                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-foreground">
                                        Live Preview
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-1 truncate">
                                        {showPreview
                                            ? "Your resume is ready"
                                            : "Compile to see your resume"}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCompile}
                                    disabled={isCompiling}
                                    className="shrink-0 px-3 sm:px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-primary transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCompiling ? (
                                        <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-500"></div>
                      <span className="hidden sm:inline">Compiling...</span>
                    </span>
                                    ) : (
                                        <span className="flex items-center">
                      <HiOutlineArrowPath className="w-5 h-5 sm:mr-2"/>
                      <span className="hidden sm:inline">Compile Preview</span>
                    </span>
                                    )}
                                </button>
                            </div>

                            <div className="flex-1 overflow-hidden flex items-center justify-center p-1 bg-card">
                                {isCompiling ? (
                                    <div className="h-full w-full bg-card rounded-xl overflow-hidden">
                                        <div className="h-full w-full animate-pulse space-y-4 p-8">
                                            <div className="h-8 bg-muted rounded w-3/4"></div>
                                            <div className="h-4 bg-muted rounded w-1/2"></div>
                                            <div className="space-y-2 pt-4">
                                                <div className="h-3 bg-muted rounded"></div>
                                                <div className="h-3 bg-muted rounded w-5/6"></div>
                                            </div>
                                            <div className="space-y-2 pt-6">
                                                <div className="h-4 bg-emerald-500/20 rounded w-1/3"></div>
                                                <div className="h-3 bg-muted rounded"></div>
                                                <div className="h-3 bg-muted rounded w-4/5"></div>
                                                <div className="h-3 bg-muted rounded w-3/4"></div>
                                            </div>
                                            <div className="space-y-2 pt-6">
                                                <div className="h-4 bg-emerald-500/20 rounded w-1/3"></div>
                                                <div className="h-3 bg-muted rounded"></div>
                                                <div className="h-3 bg-muted rounded w-5/6"></div>
                                                <div className="h-3 bg-muted rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : showPreview ? (
                                    <div className="h-full w-full bg-white overflow-hidden shadow-inner">
                                        <PDFViewer
                                            width="100%"
                                            height="100%"
                                            showToolbar={false}
                                            className="border-0"
                                        >
                                            <ResumeTemplate
                                                templateId={templateId}
                                                data={resumeData}
                                            />
                                        </PDFViewer>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div
                                            className="w-24 h-24 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
                                            <HiOutlineDocumentText className="w-12 h-12 text-muted-foreground"/>
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">
                                            No Preview Yet
                                        </h3>
                                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                            Fill in your resume details and click{" "}
                                            <span className="font-semibold text-emerald-500">
                        Compile Preview
                      </span>{" "}
                                            to generate your professional resume.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showReviewModal && reviewData && (
                <ResumeReviewModal
                    resumeData={reviewData.resume_data}
                    cloudinaryUrl={reviewData.cloudinary_url}
                    rawFullText={reviewData.raw_full_text}
                    onClose={(saved) => {
                        setShowReviewModal(false);
                        setReviewData(null);
                        if (saved) router.push("/candidate/resumes");
                    }}
                />
            )}
        </div>
    );
}