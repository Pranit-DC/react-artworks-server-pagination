import { useState, useRef } from 'react';
import { useArtworks } from './hooks/useArtworks';
import { ArtworksTable } from './components/ArtworksTable';
import { TablePaginator } from './components/TablePaginator';
import { ThemeToggle } from './components/ThemeToggle';
import ClickSpark from './components/ClickSpark';
import type { Artwork, ArtworkPagination } from './types/artwork';

export default function App() {
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Persist last successful data so the table never goes blank while loading
  const savedArtworks   = useRef<Artwork[]>([]);
  const savedPagination = useRef<ArtworkPagination | null>(null);

  const state = useArtworks(page, pageSize);

  if (state.status === 'success') {
    savedArtworks.current   = state.data;
    savedPagination.current = state.pagination;
  }

  const isLoading       = state.status === 'idle' || state.status === 'loading';
  const displayArtworks = state.status === 'success' ? state.data : savedArtworks.current;
  const displayPagination =
    state.status === 'success' ? state.pagination : savedPagination.current;

  function handlePageChange(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  return (
    <ClickSpark sparkColor="var(--accent)" sparkSize={7} sparkRadius={16} sparkCount={8}>
      <div className="min-h-screen bg-(--bg) transition-colors duration-300">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-20 border-b border-(--border-subtle) transition-colors duration-300"
          style={{
            background: 'color-mix(in srgb, var(--surface) 88%, transparent)',
            backdropFilter: 'saturate(180%) blur(24px)',
            WebkitBackdropFilter: 'saturate(180%) blur(24px)',
          }}
        >
          <div
            className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"
            style={{
              height: 'var(--header-height)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Brand */}
            <div className="flex items-center gap-3 min-w-0">
              {/* App icon */}
              <div
                className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 select-none"
                style={{ background: 'var(--accent)' }}
                aria-hidden="true"
              >
                {/* Minimal picture-frame icon */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <rect x="1.5" y="1.5" width="15" height="15" rx="2.5" stroke="white" strokeWidth="1.6"/>
                  <circle cx="6" cy="6.5" r="1.4" fill="white" fillOpacity=".85"/>
                  <path d="M1.5 12.5l4-4 3 3.5 2.5-2.5 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity=".9"/>
                </svg>
              </div>

              <div className="min-w-0">
                <h1 className="text-[15px] font-semibold tracking-tight text-(--text-1) leading-tight truncate">
                  Art Institute of Chicago
                </h1>
                <p className="text-[11px] text-(--text-2) leading-tight mt-px">
                  Artworks Collection
                </p>
              </div>
            </div>

            {/* Right: selection badge + theme toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-1.5 animate-scale-in">
                  {/* Count badge */}
                  <span
                    className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-(--accent) rounded-full px-3 py-1 select-none"
                    style={{
                      background: 'var(--accent-muted)',
                      border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                      style={{ background: 'var(--accent)', animation: 'pulse-accent 2s ease infinite' }}
                    />
                    <span className="tabular-nums">{selectedIds.size}</span>
                    <span className="text-(--text-2) font-normal">selected</span>
                  </span>

                  {/* Clear button */}
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="inline-flex items-center gap-1 h-[26px] px-2.5 rounded-full text-[11.5px] font-medium text-(--text-2) border border-(--border) bg-(--surface) hover:border-(--accent) hover:text-(--accent) transition-colors duration-150 cursor-pointer select-none"
                    aria-label="Clear selection"
                    data-tooltip="Clear all selected rows"
                    data-tooltip-pos="bottom"
                  >
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                      <path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    Clear
                  </button>
                </div>
              )}
              <div className="w-px h-5 bg-(--border-subtle) mx-1" aria-hidden="true" />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* ── Main content ────────────────────────────────────────────── */}
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {state.status === 'error' && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-[12px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] animate-fade-in">
              <svg className="mt-px shrink-0" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M7.5 4.5v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="7.5" cy="10.5" r=".75" fill="currentColor"/>
              </svg>
              <span>Failed to load: {state.message}</span>
            </div>
          )}

          {/* Table — always mounted; shows skeleton rows while loading */}
          <ArtworksTable
            artworks={displayArtworks}
            loading={isLoading}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />

          {displayPagination && (
            <TablePaginator
              pagination={displayPagination}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </main>
      </div>
    </ClickSpark>
  );
}
