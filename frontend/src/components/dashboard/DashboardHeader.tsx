/**
 * DashboardHeader.tsx — Top Bar for Dashboard Layout
 * 
 * Features:
 * - Mobile hamburger menu trigger
 * - Breadcrumb navigation showing current page
 * - Notification bell with REAL unread count from API
 * - Quick search shortcut hint (⌘K)
 * - Premium dark glassmorphism style
 */

import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Bell, Search, Command } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

// Map routes to page titles for breadcrumb
const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/settings": "Settings",
  "/tracker": "Exam Tracker",
  "/saved": "Saved Items",
  "/notifications": "Notifications",
  "/tools/history": "Tool History",
  "/activity": "Activity",
};

const DashboardHeader = ({ onMobileMenuToggle }: HeaderProps) => {
  const location = useLocation();
  const currentTitle = routeTitles[location.pathname] || "Dashboard";
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[hsl(225,50%,4%)]/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Left side: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/30">ISHU</span>
          <span className="text-white/20">/</span>
          <motion.span
            key={currentTitle}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-medium text-white/80"
          >
            {currentTitle}
          </motion.span>
        </div>
      </div>

      {/* Right side: Search hint + Notifications */}
      <div className="flex items-center gap-2">
        {/* Search shortcut hint */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-white/30 text-xs cursor-pointer hover:bg-white/[0.06] hover:text-white/50 transition-all">
          <Search size={13} />
          <span>Search...</span>
          <div className="flex items-center gap-0.5 rounded border border-white/[0.08] bg-white/[0.04] px-1 py-0.5">
            <Command size={10} />
            <span className="text-[10px]">K</span>
          </div>
        </div>

        {/* Notification bell — REAL unread count from API */}
        <Link to="/notifications">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
          >
            <Bell size={18} />
            {/* Show badge only when there are unread notifications */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-[8px] font-bold text-white shadow-lg shadow-red-500/30"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.div>
            )}
          </motion.div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
