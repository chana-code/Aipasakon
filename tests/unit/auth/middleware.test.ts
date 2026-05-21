import { describe, it, expect } from 'vitest';

/**
 * We can't fully unit-test the Supabase middleware (it depends on cookies + HTTP),
 * but we can test the route-matching logic that determines what gets protected.
 */

const PROTECTED_PREFIXES = ['/learn'];
const AUTH_PAGES = ['/login', '/signup'];

function shouldRedirectToLogin(pathname: string, isAuthenticated: boolean): boolean {
  if (isAuthenticated) return false;
  return PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function shouldRedirectToDashboard(pathname: string, isAuthenticated: boolean): boolean {
  if (!isAuthenticated) return false;
  return AUTH_PAGES.includes(pathname);
}

describe('auth route matching', () => {
  it('redirects /learn to /login when unauthenticated', () => {
    expect(shouldRedirectToLogin('/learn', false)).toBe(true);
    expect(shouldRedirectToLogin('/learn/bookmarks', false)).toBe(true);
  });

  it('does NOT redirect /learn when authenticated', () => {
    expect(shouldRedirectToLogin('/learn', true)).toBe(false);
  });

  it('does NOT redirect public routes when unauthenticated', () => {
    expect(shouldRedirectToLogin('/', false)).toBe(false);
    expect(shouldRedirectToLogin('/foundations/what-is-ai', false)).toBe(false);
    expect(shouldRedirectToLogin('/curriculum', false)).toBe(false);
    expect(shouldRedirectToLogin('/glossary', false)).toBe(false);
    expect(shouldRedirectToLogin('/about', false)).toBe(false);
  });

  it('redirects /login to /learn when authenticated', () => {
    expect(shouldRedirectToDashboard('/login', true)).toBe(true);
    expect(shouldRedirectToDashboard('/signup', true)).toBe(true);
  });

  it('does NOT redirect /login when unauthenticated', () => {
    expect(shouldRedirectToDashboard('/login', false)).toBe(false);
  });
});
