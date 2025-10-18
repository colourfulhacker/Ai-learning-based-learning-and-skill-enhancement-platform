// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt');
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/home', '/profile', '/create', '/my-projects', '/course', '/admin'];

  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && token) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/admin/verify`, {
        headers: {
          Cookie: `jwt=${token.value}`
        }
      });
      
      if (!response.ok) {
        const url = request.nextUrl.clone();
        url.pathname = '/home';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Admin auth check error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configuration to specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};