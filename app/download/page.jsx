"use client";

import { useEffect, useRef, useState } from "react";
import {
    HiOutlineArrowDownTray as Download,
    HiOutlineComputerDesktop as Monitor,
    HiOutlineDeviceTablet as Apple,
    HiOutlineCommandLine as Terminal,
    HiOutlineArrowPath as Loader2,
    HiOutlineCheckCircle as CheckCircle2,
    HiOutlineExclamationTriangle as AlertTriangle,
    HiOutlineClock as Clock,
    HiOutlineXMark as X,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Config — replace with real release metadata / CDN URLs when available.
// ---------------------------------------------------------------------------

const APP_VERSION = "0.1.0";

// Served straight from Client/public — e.g. Client/public/downloads/DeepScreen_0.1.0_x64_en-US.msi
const WINDOWS_FILENAME = "DeepScreen_0.1.0_x64_en-US.msi";
const WINDOWS_DOWNLOAD_URL = `/downloads/${WINDOWS_FILENAME}`;
const WINDOWS_SIZE = "46 MB";

const AUTO_DOWNLOAD_SECONDS = 5;
const VERIFY_TIMEOUT_MS = 6000;

const PLATFORMS = [
    {
        id: "windows",
        name: "Windows",
        icon: Monitor,
        requirements: "Windows 10 or later · 64-bit",
        available: true,
    },
    {
        id: "mac",
        name: "macOS",
        icon: Apple,
        requirements: "macOS 12 or later · Apple silicon & Intel",
        available: false,
    },
    {
        id: "linux",
        name: "Linux",
        icon: Terminal,
        requirements: "Ubuntu 22.04+ · .deb and .rpm",
        available: false,
    },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Checks whether the installer is reachable before we start the countdown.
 * Returns "ok" | "not-found" | "network"
 */
async function verifyDownloadAvailable(url) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
        return "network";
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
        const res = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
            cache: "no-store",
        });
        clearTimeout(timeout);

        if (res.status === 404) return "not-found";
        if (!res.ok) return "network";
        return "ok";
    } catch {
        // Covers offline, DNS failure, CORS rejection on some static hosts,
        // and abort-on-timeout. We treat all of these as a network problem
        // rather than guessing which one it was.
        return "network";
    }
}

function triggerBrowserDownload(url, filename) {
    try {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    } catch {
        return false;
    }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DownloadsPage() {
    // "idle" | "verifying" | "counting" | "started" | "error"
    const [state, setState] = useState("idle");
    // "not-found" | "network" | "trigger-failed" | null
    const [error, setError] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(AUTO_DOWNLOAD_SECONDS);

    const intervalRef = useRef(null);
    const cancelledRef = useRef(false);

    const clearCountdown = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => clearCountdown, []);

    const startDownloadFlow = async () => {
        cancelledRef.current = false;
        setError(null);
        setState("verifying");

        const result = await verifyDownloadAvailable(WINDOWS_DOWNLOAD_URL);

        if (cancelledRef.current) return;

        if (result !== "ok") {
            setError(result);
            setState("error");
            return;
        }

        setSecondsLeft(AUTO_DOWNLOAD_SECONDS);
        setState("counting");

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearCountdown();
                    const started = triggerBrowserDownload(
                        WINDOWS_DOWNLOAD_URL,
                        WINDOWS_FILENAME,
                    );
                    if (!cancelledRef.current) {
                        if (started) {
                            setState("started");
                        } else {
                            setError("trigger-failed");
                            setState("error");
                        }
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const cancelDownloadFlow = () => {
        cancelledRef.current = true;
        clearCountdown();
        setState("idle");
        setError(null);
    };

    const retry = () => {
        setError(null);
        startDownloadFlow();
    };

    const manualDownload = () => {
        const started = triggerBrowserDownload(
            WINDOWS_DOWNLOAD_URL,
            WINDOWS_FILENAME,
        );
        if (!started) {
            setError("trigger-failed");
            setState("error");
        }
    };

    return (
        <main className="bg-mesh min-h-screen w-full">
            <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24">
                {/* Hero */}
                <Badge
                    variant="secondary"
                    className="mb-5 rounded-full px-3 py-1 text-xs font-medium"
                >
                    Version {APP_VERSION} · Latest release
                </Badge>

                <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
                    Download <span className="text-gradient">DeepScreen</span>
                </h1>

                <p className="mt-4 max-w-xl text-center text-base text-muted-foreground sm:text-lg">
                    Get the DeepScreen desktop app for your operating system.
                    Windows is available now — macOS and Linux are on the way.
                </p>

                {/* Platform cards */}
                <div className="mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {PLATFORMS.map((platform) => (
                        <Card
                            key={platform.id}
                            className={
                                platform.available
                                    ? "border-primary/40 shadow-sm ring-1 ring-primary/15"
                                    : "opacity-80"
                            }
                        >
                            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={
                                            "flex h-10 w-10 items-center justify-center rounded-xl " +
                                            (platform.available
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted text-muted-foreground")
                                        }
                                    >
                                        <platform.icon className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-lg">
                                        {platform.name}
                                    </CardTitle>
                                </div>
                                <Badge
                                    variant={platform.available ? "default" : "secondary"}
                                    className="shrink-0"
                                >
                                    {platform.available ? "Available" : "Coming soon"}
                                </Badge>
                            </CardHeader>

                            <CardContent>
                                <CardDescription>
                                    {platform.requirements}
                                </CardDescription>
                                {platform.id === "windows" && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        .msi installer · {WINDOWS_SIZE}
                                    </p>
                                )}
                            </CardContent>

                            <CardFooter>
                                {platform.available ? (
                                    <Button
                                        className="w-full gap-2"
                                        disabled={
                                            state === "verifying" ||
                                            state === "counting"
                                        }
                                        onClick={startDownloadFlow}
                                    >
                                        {state === "verifying" ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Checking…
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4" />
                                                Download for Windows
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full"
                                        variant="secondary"
                                        disabled
                                    >
                                        Not available yet
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Download flow panel */}
                {state !== "idle" && (
                    <Card className="animate-in fade-in-0 slide-in-from-bottom-4 mt-8 w-full max-w-md duration-300">
                        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                            {state === "verifying" && (
                                <>
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">
                                        Checking that the installer is
                                        available…
                                    </p>
                                </>
                            )}

                            {state === "counting" && (
                                <>
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                                        {secondsLeft}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="flex items-center justify-center gap-2 text-sm font-medium">
                                            <Clock className="h-4 w-4" />
                                            Your download will start
                                            shortly…
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {WINDOWS_FILENAME} ·{" "}
                                            {WINDOWS_SIZE}
                                        </p>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                                            style={{
                                                width: `${
                                                    ((AUTO_DOWNLOAD_SECONDS -
                                                        secondsLeft) /
                                                        AUTO_DOWNLOAD_SECONDS) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1.5 text-muted-foreground"
                                        onClick={cancelDownloadFlow}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Cancel
                                    </Button>
                                </>
                            )}

                            {state === "started" && (
                                <>
                                    <CheckCircle2 className="h-8 w-8 text-primary" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            Your download has started
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {WINDOWS_FILENAME} ·{" "}
                                            {WINDOWS_SIZE}
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Didn&apos;t get a prompt?{" "}
                                        <button
                                            type="button"
                                            onClick={manualDownload}
                                            className="font-medium text-primary underline underline-offset-2"
                                        >
                                            Click here to download manually
                                        </button>
                                        .
                                    </p>
                                </>
                            )}

                            {state === "error" && (
                                <>
                                    <AlertTriangle className="h-8 w-8 text-destructive" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            {error === "not-found" &&
                                                "This installer couldn't be found."}
                                            {error === "network" &&
                                                "We couldn't reach the download server."}
                                            {error === "trigger-failed" &&
                                                "Your browser blocked the download."}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {error === "not-found" &&
                                                "It may have been moved or the link is out of date."}
                                            {error === "network" &&
                                                "Check your internet connection and try again."}
                                            {error === "trigger-failed" &&
                                                "Allow downloads for this site, or use the manual link below."}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={retry}>
                                            Try again
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={manualDownload}
                                        >
                                            Download manually
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                <p className="mt-10 text-xs text-muted-foreground">
                    By downloading, you agree to DeepScreen&apos;s terms of
                    service.
                </p>
            </div>
        </main>
    );
}