/**
 * Dashboard Context Provider
 * 
 * Provides dashboard-specific context including cookie prefix for isolation.
 * Each dashboard (BundUI, VibeThink, Dashboard) gets its own cookie namespace.
 * 
 * @example
 * ```tsx
 * <DashboardProvider cookiePrefix="bundui" dashboardName="BundUI Premium">
 *   <App />
 * </DashboardProvider>
 * ```
 */

"use client";

import React, { createContext, useContext, useCallback } from 'react';

type DashboardContextType = {
    cookiePrefix: string;
    dashboardName: string;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({
    cookiePrefix,
    dashboardName,
    children
}: {
    cookiePrefix: string;
    dashboardName: string;
    children: React.ReactNode;
}) {
    const value = React.useMemo(
        () => ({ cookiePrefix, dashboardName }),
        [cookiePrefix, dashboardName]
    );

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboardContext() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboardContext must be used within DashboardProvider');
    }
    return context;
}

/**
 * Hook for dashboard-scoped cookies with automatic prefixing
 * 
 * @param cookieName - Base cookie name (will be prefixed automatically)
 * @returns Object with setCookie, getCookie, deleteCookie functions
 * 
 * @example
 * ```tsx
 * const { setCookie, getCookie } = useDashboardCookie('theme');
 * setCookie('dark'); // Saves as "bundui_theme" or "vibethink_theme"
 * const theme = getCookie(); // Reads from "bundui_theme" or "vibethink_theme"
 * ```
 */
export function useDashboardCookie(cookieName: string) {
    const { cookiePrefix } = useDashboardContext();
    const fullCookieName = `${cookiePrefix}_${cookieName}`;

    const setCookie = useCallback(
        (value: string, maxAge = 60 * 60 * 24 * 7) => {
            if (typeof document === 'undefined') return; // SSR safety
            document.cookie = `${fullCookieName}=${value}; path=/; max-age=${maxAge}`;
        },
        [fullCookieName]
    );

    const getCookie = useCallback((): string | null => {
        if (typeof document === 'undefined') return null; // SSR safety
        const cookies = document.cookie.split(';');
        const cookie = cookies.find(c => c.trim().startsWith(`${fullCookieName}=`));
        return cookie ? cookie.split('=')[1] : null;
    }, [fullCookieName]);

    const deleteCookie = useCallback(() => {
        if (typeof document === 'undefined') return; // SSR safety
        document.cookie = `${fullCookieName}=; path=/; max-age=0`;
    }, [fullCookieName]);

    return {
        setCookie,
        getCookie,
        deleteCookie,
        cookieName: fullCookieName
    };
}
