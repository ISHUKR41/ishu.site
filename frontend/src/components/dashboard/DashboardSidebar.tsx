/**
 * DashboardSidebar.tsx — Premium Collapsible Sidebar Navigation
 * 
 * Design: Vercel/Linear-inspired dark glassmorphism sidebar
 * Features:
 * - Collapse/expand with smooth width animation
 * - Active route indicator with framer-motion layoutId
 * - Icon-only mode when collapsed
 * - User avatar + sign-out at bottom
 * - Gradient hover effects
 * - Responsive: hidden on mobile (replaced by bottom nav)
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, Settings, Bookmark, Bell, History,
  ChevronLeft, ChevronRight, LogOut, Shield, Trophy,
  FileText, GraduationCap, X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// Sidebar navigation items with icons, labels, and routes
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", color: "from-blue-500 to-cyan-500" },
  { icon: User, label: "Profile", href: "/profile", color: "from-violet-500 to-purple-500" },
  { icon: GraduationCap, label: "Exam Tracker", href: "/tracker", color: "from-amber-500 to-orange-500" },
  { icon: Bookmark, label: "Saved Items", href: "/saved", color: "from-emerald-500 to-green-500" },
  { icon: Bell, label: "Notifications", href: "/notifications", color: "from-rose-500 to-pink-500" },
  { icon: History, label: "Tool History", href: "/tools/history", color: "from-teal-500 to-cyan-500" },
  { icon: Trophy, label: "Activity", href: "/activity", color: "from-yellow-500 to-amber-500" },
  { icon: Settings, label: "Settings", href: "/settings", color: "from-gray-400 to-gray-500" },
];

const DashboardSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* ──── Logo Area ──── */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/[0.06]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20">
                <span className="text-[10px] font-bold text-white">IS</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-white">ISHU</span>
                <span className="text-[8px] tracking-wider text-white/40 uppercase">Dashboard</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* ──── Main Navigation ──── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onMobileClose}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-white/50 hover:text-white/90 hover:bg-white/[0.04]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator background */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.06]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Active gradient accent bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-accent"
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-to-b ${item.color}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                isActive ? `bg-gradient-to-br ${item.color} shadow-lg` : "group-hover:bg-white/[0.04]"
              }`}>
                <item.icon size={16} className={isActive ? "text-white" : "text-white/60 group-hover:text-white/80"} />
              </div>

              {/* Label */}
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="relative z-10 truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

            </Link>
          );
        })}
      </nav>

      {/* ──── Bottom: User Info + Admin + Sign Out ──── */}
      <div className="border-t border-white/[0.06] p-3 space-y-2">
        {/* Admin button */}
        {isAdmin && (
          <Link
            to="/admin"
            onClick={onMobileClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-amber-400/80 hover:bg-amber-500/[0.06] transition-all"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Shield size={16} className="text-amber-400" />
            </div>
            {!collapsed && <span>Admin Panel</span>}
          </Link>
        )}

        {/* User profile card */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-[10px] font-bold text-white shadow-lg shadow-blue-500/20">
            {user?.email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-medium text-white/80 truncate">
                  {user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[10px] text-white/30 truncate">{user?.email || ""}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LogOut size={16} />
          </div>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex h-screen flex-col fixed left-0 top-0 z-40 border-r border-white/[0.06] bg-[hsl(225,50%,5%)]/95 backdrop-blur-2xl"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Overlay + Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Slide-in sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-white/[0.06] bg-[hsl(225,50%,5%)] lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
