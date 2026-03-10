/**
 * use-mobile.tsx - Mobile Device Detection Hook
 * 
 * Returns true if the browser window width is less than 768px (tablet breakpoint).
 * Automatically updates when the window is resized.
 * 
 * Usage:
 *   const isMobile = useIsMobile();
 *   if (isMobile) return <MobileLayout />;
 */

import * as React from "react";

const MOBILE_BREAKPOINT = 768;  // Screens below this width are considered "mobile"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
