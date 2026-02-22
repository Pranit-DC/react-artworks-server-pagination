import { useRef, useEffect } from 'react';
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

export function ArtworksTable({ artworks, loading, selectedIds, onSelectionChange }: Props) {
  const headerCheckRef = useRef<HTMLInputElement>(null);

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

  return (
    <div
      key={artworks[0]?.id ?? 'empty'}
      className={`animate-fade-in artworks-wrap transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <Table>
        <TableHeader>
          <TableRow className="artworks-thead hover:bg-transparent">
            <TableHead className="w-[52px] px-3">
              <div className="flex items-center justify-center gap-1">
                <input
                  ref={headerCheckRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="artworks-checkbox"
                  aria-label="Select all rows on this page"
                />
                <SelectNPanel pageSize={artworks.length} onSelect={handleSelectN} />
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
                    ? 'min-w-[130px]'
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
        <TableBody>
          {artworks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-(--text-3)">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                    <rect x="4" y="4" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[13px]">No artworks found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
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
  );
}
