/**
 * Next.js Middleware for i18n
 * 
 * Handles locale detection and routing
 */

import { NextRequest, NextResponse } from 'next/server';
import { i18nConfig, isValidLocale } from './src/lib/i18n/config';

/**
 * Get locale from request with dashboard isolation
 */
function getLocale(request: NextRequest): string {
  const { pathname } = request.nextUrl;

  // Detect dashboard
  let dashboardKey = 'default';
  if (pathname.includes('/dashboard-admin')) dashboardKey = 'dashboard-admin';
  else if (pathname.includes('/dashboard-tenant')) dashboardKey = 'dashboard-tenant';
  else if (pathname.includes('/dashboard-bundui')) dashboardKey = 'dashboard-bundui';
  else if (pathname.includes('/dashboard-vibethink')) dashboardKey = 'dashboard-vibethink';

  const isolatedCookieName = `${i18nConfig.cookieName}_${dashboardKey}`;

  // 1. Check isolated cookie
  const isolatedLocale = request.cookies.get(isolatedCookieName)?.value;
  if (isolatedLocale && isValidLocale(isolatedLocale)) {
    return isolatedLocale;
  }

  // 2. Check general cookie (legacy/global)
  const cookieLocale = request.cookies.get(i18nConfig.cookieName)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase());

    for (const lang of languages) {
      const locale = lang.split('-')[0];
      if (isValidLocale(locale)) {
        return locale;
      }
    }
  }

  // 4. Default locale
  return i18nConfig.defaultLocale;
}

/**
 * Middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Get locale
  const locale = getLocale(request);

  // Set locale header for server components
  const response = NextResponse.next();
  response.headers.set('x-locale', locale);

  return response;
}

/**
 * Matcher configuration
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};












