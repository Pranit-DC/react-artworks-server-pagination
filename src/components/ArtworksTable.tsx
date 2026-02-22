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

  function handleSelectN(n: number) {
    reconcile(artworks.slice(0, n));
  }

  function toggleAll() {
    if (allSelected) {
      reconcile([]);
    } else {
      reconcile(artworks);
    }
  }

  function toggleRow(artwork: Artwork) {
    const currentlySelected = artworks.filter(a => selectedIds.has(a.id));
    if (selectedIds.has(artwork.id)) {
      reconcile(currentlySelected.filter(a => a.id !== artwork.id));
    } else {
      reconcile([...currentlySelected, artwork]);
    }
  }

  return (
    <div
      key={artworks[0]?.id ?? 'empty'}
      className={`animate-fade-in rounded-[10px] border border-(--border) bg-(--surface) shadow-(--shadow-sm) overflow-hidden transition-opacity duration-200 ${loading ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-(--surface-2) hover:bg-(--surface-2) border-b border-(--border)">
            <TableHead className="w-12 px-3 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <input
                  ref={headerCheckRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="artworks-checkbox"
                  aria-label="Select all rows"
                />
                <SelectNPanel pageSize={artworks.length} onSelect={handleSelectN} />
              </div>
            </TableHead>
            {(['Title', 'Place of Origin', 'Artist', 'Inscriptions', 'Start', 'End'] as const).map(h => (
              <TableHead
                key={h}
                className={`text-(--text-2) text-[10.5px] font-semibold tracking-wider uppercase px-[14px] h-auto py-[9px] ${h === 'Start' || h === 'End' ? 'text-right' : ''}`}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {artworks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-(--text-2)">
                No records
              </TableCell>
            </TableRow>
          ) : (
            artworks.map((row) => {
              const isSelected = selectedIds.has(row.id);
              return (
                <TableRow
                  key={row.id}
                  data-state={isSelected ? 'selected' : undefined}
                  onClick={() => toggleRow(row)}
                  className={`artwork-row cursor-pointer border-b border-(--border) ${isSelected ? 'selected' : ''}`}
                >
                  <TableCell
                    className="w-12 px-3 text-center"
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row)}
                      className="artworks-checkbox"
                      aria-label={`Select ${row.title ?? 'row'}`}
                    />
                  </TableCell>
                  <TableCell className="col-title min-w-[240px]" title={row.title ?? undefined}>
                    {truncate(row.title, 60)}
                  </TableCell>
                  <TableCell className="col-secondary min-w-[150px]" title={row.place_of_origin ?? undefined}>
                    {truncate(row.place_of_origin, 60)}
                  </TableCell>
                  <TableCell className="col-secondary min-w-[200px]" title={row.artist_display ?? undefined}>
                    {truncate(row.artist_display, 60)}
                  </TableCell>
                  <TableCell className="col-secondary min-w-[180px]" title={row.inscriptions ?? undefined}>
                    {truncate(row.inscriptions, 60)}
                  </TableCell>
                  <TableCell className="col-date min-w-[72px] text-right">
                    {row.date_start !== null ? row.date_start : <span className="opacity-40">—</span>}
                  </TableCell>
                  <TableCell className="col-date min-w-[72px] text-right">
                    {row.date_end !== null ? row.date_end : <span className="opacity-40">—</span>}
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
