/**
 * DashboardLayout.tsx — Main Layout for All Dashboard Pages
 * 
 * Wraps all protected pages (/dashboard, /profile, /settings, etc.)
 * Provides:
 * - Collapsible sidebar (DashboardSidebar)
 * - Top header bar (DashboardHeader)
 * - Responsive: sidebar hidden on mobile, shown via hamburger
 * - Animated page transitions
 * - Premium dark background with subtle effects
 */

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[hsl(225,50%,3%)]">
      {/* ──── Sidebar ──── */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* ──── Main Content Area ──── */}
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-[260px]"
        style={{ marginLeft: undefined }} // Let framer-motion handle it
      >
        {/* Top Header */}
        <DashboardHeader onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Subtle background effects */}
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full blur-[180px] opacity-30" 
              style={{ background: "radial-gradient(circle, hsl(217 100% 55% / 0.06), transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-[140px] opacity-20"
              style={{ background: "radial-gradient(circle, hsl(260 100% 65% / 0.05), transparent 70%)" }} />
          </div>

          {/* Animated content entrance */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
