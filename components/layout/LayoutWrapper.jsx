"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "motion/react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import {
  NAVBAR_ONLY_PATHS,
  SIDEBAR_PATHS,
  NO_LAYOUT_PATHS,
} from "@/constants/layout";

export default function LayoutWrapper({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const showNoLayout =
    isHome ||
    NO_LAYOUT_PATHS.some((path) => {
      const rest = pathname.startsWith(path) ? pathname.slice(path.length) : "";
      return rest.startsWith("/") && rest.length > 1;
    });
  const showNavbar =
    !showNoLayout &&
    NAVBAR_ONLY_PATHS.some((path) =>
      path === "/" ? pathname === "/" : pathname.startsWith(path),
    );
  const showSidebar =
    !showNoLayout && !showNavbar && SIDEBAR_PATHS.some((path) => pathname.startsWith(path));

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMobileSidebarOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!showSidebar) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileSidebarOpen, showSidebar]);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <AnimatePresence mode="wait">
        {showSidebar && (
          <>
            <motion.button
              key="sidebar-backdrop"
              type="button"
              aria-label="Close sidebar"
              onClick={() => setIsMobileSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: isMobileSidebarOpen ? 1 : 0 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-40 bg-background/75 backdrop-blur-sm lg:hidden ${isMobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}
            />
            <motion.div
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="z-50"
            >
              <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                mobileOpen={isMobileSidebarOpen}
                setMobileOpen={setIsMobileSidebarOpen}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        style={{
          "--sidebar-width": showSidebar ? (isCollapsed ? "80px" : "240px") : "0px",
        }}
        className="flex-1 flex flex-col transition-[padding-left] duration-300 lg:pl-(--sidebar-width)"
      >
        {showNavbar && <Navbar />}
        {showSidebar && (
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="fixed right-4 top-4 z-30 inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/90 px-3 py-2 text-sm font-medium shadow-lg shadow-black/5 backdrop-blur-lg transition-colors hover:border-primary/30 hover:bg-card lg:hidden"
            aria-label="Open sidebar"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary">
              <HiOutlineSquares2X2 className="size-4" />
            </span>
            <span>Menu</span>
          </button>
        )}
        <main
          className={`flex-1 w-full max-w-full overflow-x-hidden ${!showNoLayout && (showSidebar || !showNavbar) ? "pt-16 lg:pt-10" : "pt-0"} `}
        >
          {children}
        </main>
      </motion.div>
    </div>
  );
}
