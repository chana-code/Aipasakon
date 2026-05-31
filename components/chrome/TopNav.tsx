'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wordmark } from './Wordmark';
import { Icon, Icons } from './Icon';
import { AuthButton } from '@/components/auth/AuthButton';

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const items = [
    { href: '/curriculum', label: 'Curriculum' },
    { href: '/glossary',   label: 'Glossary'   },
    { href: '/videos',     label: 'Videos'     },
    { href: '/about',      label: 'About'      },
  ];

  return (
    <>
      <header className="nav-header" style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "0 28px",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "saturate(160%) blur(8px)",
        borderBottom: "1px solid color-mix(in srgb, var(--line) 60%, transparent)",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <Wordmark size={18} />
        </Link>

        <nav className="nav-desktop" style={{ display: "flex", gap: 22, flex: 1, marginLeft: 8 }}>
          {items.map(it => (
            <Link
              key={it.href}
              href={it.href}
              style={{
                position: "relative",
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: "var(--font-thai)",
                fontSize: 14,
                color: "var(--fg-2)",
                fontWeight: 400,
                padding: "18px 0",
              }}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        {/* Spacer to push right-side items on mobile */}
        <div className="nav-mobile-toggle" style={{ flex: 1 }} />

        <Link
          href="/search"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            border: "1px solid var(--line-2)",
            borderRadius: 6,
            background: "#fff",
            cursor: "pointer",
            textDecoration: "none",
            color: "var(--fg-3)",
          }}
          aria-label="ค้นหา"
        >
          <Icon d={Icons.search} size={14} />
          <span className="search-text" style={{ fontFamily: "var(--font-thai)", fontSize: 13, color: "var(--fg-3)" }}>
            ค้นหา…
          </span>
          <span className="search-kbd" style={{
            marginLeft: 18,
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: "var(--fg-3)",
            border: "1px solid var(--line)",
            padding: "1px 5px",
            borderRadius: 3,
            background: "var(--paper)",
          }}>⌘K</span>
        </Link>

        <div className="auth-desktop">
          <AuthButton />
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={menuOpen}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            position: "sticky",
            top: 48,
            zIndex: 49,
            background: "#fff",
            borderBottom: "1px solid var(--line)",
            boxShadow: "var(--shadow-pop)",
            padding: "8px 0",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column" }}>
            {items.map(it => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 48,
                  padding: "0 20px",
                  textDecoration: "none",
                  fontFamily: "var(--font-thai)",
                  fontSize: 15,
                  color: "var(--fg-2)",
                  fontWeight: 400,
                }}
              >
                {it.label}
              </Link>
            ))}
          </nav>
          <div style={{ padding: "8px 20px 12px", borderTop: "1px solid var(--line)" }}>
            <AuthButton />
          </div>
        </div>
      )}
    </>
  );
}
