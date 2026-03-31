import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession } from '@/lib/auth-shared';

export async function middleware(request: NextRequest) {
    const session = await getSession();
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    // 1. If not logged in and not on a public route, redirect to login
    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. If logged in and on a public route, redirect to home
    if (session && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Admin protected routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const sessionData = session as { user?: { role?: string } };
        if (!sessionData?.user || sessionData.user.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Update session on every request if it exists
    return await updateSession(request);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

