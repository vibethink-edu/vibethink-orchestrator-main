/**
 * Next.js Middleware for i18n
 * 
 * Handles locale detection and routing
 */

import { NextRequest, NextResponse } from 'next/server';
import { i18nConfig, isValidLocale } from './src/lib/i18n/config';

/**
 * Get locale from request
 */
function getLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get(i18nConfig.cookieName)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check Accept-Language header
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

  // 3. Default locale
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

  // Set locale cookie if not present
  const response = NextResponse.next();
  if (!request.cookies.has(i18nConfig.cookieName)) {
    response.cookies.set(i18nConfig.cookieName, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }

  // Add locale header for server components
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

