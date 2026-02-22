import { useRef, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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

  // Embed selection state into each row so DataTable's value changes → forces re-render
  type ArtworkRow = Artwork & { _selected: boolean };
  const rows: ArtworkRow[] = artworks.map(a => ({ ...a, _selected: selectedIds.has(a.id) }));

  // Passthrough: map PrimeReact DataTable internals → our existing CSS classes
  const pt = {
    root:           { className: '' },
    table:          { className: 'w-full caption-bottom text-sm' },
    thead:          { className: 'artworks-thead' },
    tbody:          { className: '' },
    headerRow:      { className: 'artworks-thead hover:bg-transparent' },
    bodyRow:        ({ context }: { context: { rowIndex: number } }) => ({
      className: 'artwork-row cursor-pointer',
      style:     { animation: `rowIn .22s cubic-bezier(.2,.8,.4,1) ${context.rowIndex * 22}ms both` },
    }),
    headerCell:     { className: '' },
    bodyCell:       { className: '' },
    emptyMessage:   { className: '' },
  };

  // ── Header: checkbox + selectN pill ────────────────────────────────
  const selectionHeader = (
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
  );

  // ── Column body templates ───────────────────────────────────────────
  const checkboxBody = (row: ArtworkRow) => (
    <input
      type="checkbox"
      checked={row._selected}
      onChange={() => toggleRow(row)}
      onClick={e => e.stopPropagation()}
      className="artworks-checkbox"
      aria-label={`Select ${row.title ?? 'row'}`}
    />
  );

  const emptyMsg = (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-(--text-3)">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="28" height="28" rx="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="text-[13px]">No artworks found</span>
    </div>
  );

  return (
    <div className="relative">

      {/* ── Skeleton overlay — absolutely covers the table while loading ── */}
      {loading && (
        <div
          className="artworks-wrap"
          style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}
        >
          <table className="w-full caption-bottom text-sm">
            <thead className="artworks-thead">
              <tr className="artworks-thead hover:bg-transparent">
                <th className="w-[52px] px-3 text-center artworks-thead" style={{ width: 52 }} />
                {['Title','Place of Origin','Artist','Inscriptions','Start','End'].map(h => (
                  <th key={h} className="artworks-thead px-[14px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {new Array(skeletonCount).fill(null).map((_, i) => (
                <tr
                  key={`sk-${i}`}
                  className="artwork-row pointer-events-none"
                  style={{ animation: `rowIn .2s cubic-bezier(.2,.8,.4,1) ${i * 18}ms both` }}
                >
                  <td className="w-[52px] px-3 text-center">
                    <div className="w-[15px] h-[15px] rounded-[4px] skeleton-cell mx-auto" />
                  </td>
                  {SK_WIDTHS[i % SK_WIDTHS.length].map((w, ci) => (
                    <td key={ci} className={ci >= 4 ? 'text-right px-[14px] py-[12px]' : 'px-[14px] py-[12px]'}>
                      <div className="skeleton-cell" style={{ width: w }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PrimeReact DataTable ────────────────────────────────────────── */}
      <div ref={scrollRef} className="artworks-wrap" style={loading ? { visibility: 'hidden' } : undefined}>
        <DataTable<ArtworkRow[]>
          value={rows}
          unstyled
          pt={pt}
          emptyMessage={emptyMsg}
          onRowClick={e => toggleRow(e.data as ArtworkRow)}
          rowClassName={(row: ArtworkRow) => row._selected ? 'selected' : ''}
          tableStyle={{ width: '100%', borderCollapse: 'collapse' }}
        >
          {/* Checkbox + SelectN header */}
          <Column
            header={selectionHeader}
            body={checkboxBody}
            headerStyle={{ width: '52px', padding: '10px 12px', textAlign: 'center' }}
            bodyStyle={{ width: '52px', padding: '12px', textAlign: 'center' }}
            pt={{ headerCell: { className: 'artworks-thead' }, bodyCell: { className: '' } }}
          />

          <Column
            field="title"
            header="Title"
            headerStyle={{ padding: '10px 14px', minWidth: '220px' }}
            bodyStyle={{ padding: '12px 14px', minWidth: '220px' }}
            pt={{ headerCell: { className: 'artworks-thead' }, bodyCell: { className: 'col-title' } }}
            body={(row: ArtworkRow) => (
              <span title={row.title ?? undefined}>{truncate(row.title, 60)}</span>
            )}
          />

          <Column
            field="place_of_origin"
            header="Place of Origin"
            headerStyle={{ padding: '10px 14px', minWidth: '140px' }}
            bodyStyle={{ padding: '12px 14px', minWidth: '140px' }}
            pt={{ headerCell: { className: 'artworks-thead' }, bodyCell: { className: 'col-secondary' } }}
            body={(row: ArtworkRow) => (
              <span title={row.place_of_origin ?? undefined}>{truncate(row.place_of_origin, 40)}</span>
            )}
          />

          <Column
            field="artist_display"
            header="Artist"
            headerStyle={{ padding: '10px 14px', minWidth: '180px' }}
            bodyStyle={{ padding: '12px 14px', minWidth: '180px' }}
            pt={{ headerCell: { className: 'artworks-thead' }, bodyCell: { className: 'col-secondary' } }}
            body={(row: ArtworkRow) => (
              <span title={row.artist_display ?? undefined}>{truncate(row.artist_display, 50)}</span>
            )}
          />

          <Column
            field="inscriptions"
            header="Inscriptions"
            headerStyle={{ padding: '10px 14px', minWidth: '160px' }}
            bodyStyle={{ padding: '12px 14px', minWidth: '160px' }}
            pt={{ headerCell: { className: 'artworks-thead' }, bodyCell: { className: 'col-secondary' } }}
            body={(row: ArtworkRow) => (
              <span title={row.inscriptions ?? undefined}>{truncate(row.inscriptions, 50)}</span>
            )}
          />

          <Column
            field="date_start"
            header="Start"
            headerStyle={{ padding: '10px 14px', minWidth: '64px', textAlign: 'right' }}
            bodyStyle={{ padding: '12px 14px', minWidth: '64px', textAlign: 'right' }}
            pt={{ headerCell: { className: 'artworks-thead text-right' }, bodyCell: { className: 'col-date' } }}
            body={(row: ArtworkRow) => row.date_start ?? <span style={{ opacity: .3 }}>—</span>}
          />

          <Column
            field="date_end"
            header="End"
            headerStyle={{ padding: '10px 14px', minWidth: '64px', textAlign: 'right' }}
            bodyStyle={{ padding: '12px 14px', minWidth: '64px', textAlign: 'right' }}
            pt={{ headerCell: { className: 'artworks-thead text-right' }, bodyCell: { className: 'col-date' } }}
            body={(row: ArtworkRow) => row.date_end ?? <span style={{ opacity: .3 }}>—</span>}
          />
        </DataTable>
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
