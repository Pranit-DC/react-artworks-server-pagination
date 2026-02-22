import { useRef, useEffect, useState } from 'react';
import {
  Table, TableHeader, TableBody,
  TableHead, TableRow, TableCell,
} from './ui/table';
import type { Artwork } from '../types/artwork';
import { SelectNPanel } from './SelectNPanel';

interface Props {
  artworks: Artwork[];
  loading: boolean;
  selectedIds: Set<number>;
  onSelectionChange: (updated: Set<number>) => void;
}

function truncate(value: string | null, max = 80): string {
  if (!value) return '—';
  return value.length > max ? value.slice(0, max) + '…' : value;
}

// Pre-determined widths so skeleton rows look natural regardless of row index
const SK_WIDTHS = [
  ['62%', '38%', '55%', '44%', '36px', '36px'],
  ['48%', '50%', '70%', '28%', '36px', '36px'],
  ['74%', '32%', '42%', '60%', '36px', '36px'],
  ['55%', '46%', '65%', '35%', '36px', '36px'],
];

export function ArtworksTable({ artworks, loading, selectedIds, onSelectionChange }: Props) {
  const headerCheckRef = useRef<HTMLInputElement>(null);
  const scrollRef      = useRef<HTMLDivElement>(null);
  const [atEnd,   setAtEnd]   = useState(false);
  const [atStart, setAtStart] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function check() {
      if (!el) return;
      setAtEnd(el.scrollWidth - el.scrollLeft - el.clientWidth < 2);
      setAtStart(el.scrollLeft < 2);
    }
    check();
    el.addEventListener('scroll', check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', check); ro.disconnect(); };
  }, []);

  const selectedOnPage = artworks.filter(a => selectedIds.has(a.id));
  const allSelected = artworks.length > 0 && selectedOnPage.length === artworks.length;
  const someSelected = selectedOnPage.length > 0 && selectedOnPage.length < artworks.length;

  useEffect(() => {
    if (headerCheckRef.current) {
      headerCheckRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  function reconcile(nextSelected: Artwork[]) {
    const pageIdSet = new Set(artworks.map(a => a.id));
    const base = new Set([...selectedIds].filter(id => !pageIdSet.has(id)));
    nextSelected.forEach(a => base.add(a.id));
    onSelectionChange(base);
  }

  function handleSelectN(n: number) { reconcile(artworks.slice(0, n)); }

  function toggleAll() {
    allSelected ? reconcile([]) : reconcile(artworks);
  }

  function toggleRow(artwork: Artwork) {
    const cur = artworks.filter(a => selectedIds.has(a.id));
    if (selectedIds.has(artwork.id)) {
      reconcile(cur.filter(a => a.id !== artwork.id));
    } else {
      reconcile([...cur, artwork]);
    }
  }

  // Number of skeleton rows: use previous page count or default 12
  const skeletonCount = artworks.length || 12;

  return (
    <div className="relative">
      <div ref={scrollRef} className="artworks-wrap">
      <Table>
        <TableHeader>
          <TableRow className="artworks-thead hover:bg-transparent">
            <TableHead className="w-[52px] px-3">
              {/* Segmented pill: [checkbox | chevron] */}
              <div
                className="flex items-center justify-center"
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: 'fit-content',
                  margin: '0 auto',
                }}
              >
                <div
                  className="w-[26px] h-[26px] flex items-center justify-center"
                  style={{ borderRight: '1px solid var(--border-subtle)' }}
                  data-tooltip="Select all on page"
                  data-tooltip-pos="bottom"
                >
                  <input
                    ref={headerCheckRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    disabled={loading}
                    className="artworks-checkbox"
                    aria-label="Select all rows on this page"
                  />
                </div>
                <SelectNPanel
                  pageSize={artworks.length || 1}
                  onSelect={handleSelectN}
                  disabled={loading}
                  compact
                />
              </div>
            </TableHead>
            {(['Title', 'Place of Origin', 'Artist', 'Inscriptions', 'Start', 'End'] as const).map(h => (
              <TableHead
                key={h}
                className={`${
                  h === 'Start' || h === 'End'
                    ? 'text-right min-w-[64px]'
                    : h === 'Title'
                    ? 'min-w-[220px]'
                    : h === 'Place of Origin'
                    ? 'min-w-[140px]'
                    : h === 'Artist'
                    ? 'min-w-[180px]'
                    : 'min-w-[160px]'
                }`}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/*
         * Key changes when switching between skeleton↔data, which remounts
         * all rows and re-triggers their staggered rowIn animation.
         */}
        <TableBody key={loading ? `sk-${skeletonCount}` : `d-${artworks[0]?.id ?? 0}`}>
          {loading ? (
            // ── Skeleton rows ──────────────────────────────────────────────
            new Array(skeletonCount).fill(null).map((_, i) => (
              <TableRow
                key={`sk-${i}`}
                className="artwork-row pointer-events-none"
                style={{ animation: `rowIn .2s cubic-bezier(.2,.8,.4,1) ${i * 18}ms both` }}
              >
                <TableCell className="w-[52px] px-3 text-center">
                  <div className="w-[15px] h-[15px] rounded-[4px] skeleton-cell mx-auto" />
                </TableCell>
                {SK_WIDTHS[i % SK_WIDTHS.length].map((w, ci) => (
                  <TableCell key={ci} className={ci >= 4 ? 'text-right' : ''}>
                    <div className="skeleton-cell" style={{ width: w }} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : artworks.length === 0 ? (
            // ── Empty state ────────────────────────────────────────────────
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-(--text-3)">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                    <rect x="4" y="4" width="28" height="28" rx="8" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[13px]">No artworks found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            // ── Data rows ──────────────────────────────────────────────────
            artworks.map((row, i) => {
              const isSelected = selectedIds.has(row.id);
              return (
                <TableRow
                  key={row.id}
                  data-state={isSelected ? 'selected' : undefined}
                  onClick={() => toggleRow(row)}
                  className={`artwork-row cursor-pointer ${isSelected ? 'selected' : ''}`}
                  style={{ animation: `rowIn .22s cubic-bezier(.2,.8,.4,1) ${i * 22}ms both` }}
                >
                  <TableCell className="w-[52px] px-3 text-center" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row)}
                      className="artworks-checkbox"
                      aria-label={`Select ${row.title ?? 'row'}`}
                    />
                  </TableCell>
                  <TableCell className="col-title" title={row.title ?? undefined}>
                    {truncate(row.title, 60)}
                  </TableCell>
                  <TableCell className="col-secondary" title={row.place_of_origin ?? undefined}>
                    {truncate(row.place_of_origin, 40)}
                  </TableCell>
                  <TableCell className="col-secondary" title={row.artist_display ?? undefined}>
                    {truncate(row.artist_display, 50)}
                  </TableCell>
                  <TableCell className="col-secondary" title={row.inscriptions ?? undefined}>
                    {truncate(row.inscriptions, 50)}
                  </TableCell>
                  <TableCell className="col-date">
                    {row.date_start ?? <span style={{ opacity: .3 }}>—</span>}
                  </TableCell>
                  <TableCell className="col-date">
                    {row.date_end ?? <span style={{ opacity: .3 }}>—</span>}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      </div>

      {/* Right-edge progressive blur — fades when scrolled to end */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '72px',
          borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
          background: 'linear-gradient(to right, transparent, var(--surface))',
          pointerEvents: 'none',
          opacity: atEnd ? 0 : 1,
          transition: 'opacity .25s ease',
        }}
      />
      {/* Left-edge fade overlay — visible when scrolled away from start */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '72px',
          borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
          background: 'linear-gradient(to left, transparent, var(--surface))',
          pointerEvents: 'none',
          opacity: atStart ? 0 : 1,
          transition: 'opacity .25s ease',
        }}
      />
    </div>
  );
}
