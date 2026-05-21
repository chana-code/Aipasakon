import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  // Refresh session — wrapped in try/catch so placeholder env vars don't crash
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Placeholder credentials or network error — treat as unauthenticated
  }

  const { pathname } = request.nextUrl;

  // Protect /learn/* routes — redirect to login if not authenticated
  if (pathname.startsWith('/learn') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup
  if ((pathname === '/login' || pathname === '/signup') && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/learn';
    url.searchParams.delete('next');
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
