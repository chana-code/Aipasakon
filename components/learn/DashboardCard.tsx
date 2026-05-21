import Link from 'next/link';
import { LevelChip } from '@/components/chrome/LevelChip';
import { StatusBadge } from '@/components/reader/StatusBadge';
import type { Level } from '@/lib/content/levels';

interface DashboardCardProps {
  slug: string;
  title: string;
  level: Level;
  status: 'stub' | 'drafting' | 'reviewed' | 'stable';
  isBookmarked?: boolean;
  isCompleted?: boolean;
}

export function DashboardCard({
  slug,
  title,
  level,
  status,
  isBookmarked = false,
  isCompleted = false,
}: DashboardCardProps) {
  return (
    <div style={{
      position: 'relative',
      background: isCompleted ? '#F0FDF4' : '#fff',
      border: `1px solid ${isCompleted ? '#86EFAC' : 'var(--line)'}`,
      borderRadius: 10,
      padding: '16px 18px',
      transition: 'box-shadow 0.15s',
    }}>
      {/* Bookmark star */}
      {isBookmarked && (
        <span style={{
          position: 'absolute',
          top: 12,
          right: 14,
          fontSize: 16,
          color: 'var(--teal-600)',
          lineHeight: 1,
        }}>
          ★
        </span>
      )}

      {/* Completion checkmark */}
      {isCompleted && (
        <span style={{
          position: 'absolute',
          top: 10,
          right: isBookmarked ? 36 : 14,
          fontSize: 13,
          color: '#16A34A',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
        }}>
          ✓
        </span>
      )}

      <Link
        href={`/${level}/${slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <h3 style={{
          margin: '0 0 10px',
          fontFamily: 'var(--font-thai)',
          fontSize: 15.5,
          fontWeight: 600,
          color: 'var(--fg-1)',
          lineHeight: 1.4,
          paddingRight: isBookmarked || isCompleted ? 32 : 0,
        }}>
          {title}
        </h3>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <LevelChip level={level} size="sm" />
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
