import Link from 'next/link';
import { Wordmark } from './Wordmark';
import { Icon, Icons } from './Icon';

export function TopNav() {
  const items = [
    { href: '/curriculum', label: 'Curriculum' },
    { href: '/glossary',   label: 'Glossary'   },
    { href: '/videos',     label: 'Videos'     },
    { href: '/about',      label: 'About'      },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      height: 56,
      display: "flex",
      alignItems: "center",
      gap: 28,
      padding: "0 28px",
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "saturate(160%) blur(8px)",
      borderBottom: "1px solid var(--line)",
    }}>
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <Wordmark size={18} />
      </Link>

      <nav style={{ display: "flex", gap: 22, flex: 1, marginLeft: 8 }}>
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
        <span style={{ fontFamily: "var(--font-thai)", fontSize: 13, color: "var(--fg-3)" }}>
          ค้นหา…
        </span>
        <span style={{
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
    </header>
  );
}
