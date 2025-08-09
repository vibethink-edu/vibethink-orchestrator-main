import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Basic guard placeholder; extend with auth/session logic as needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect app routes (adjust as needed)
    '/((?!_next|static|.*\.(?:svg|png|jpg|jpeg|gif|ico|webp|css|js|map)).*)'
  ]
};

