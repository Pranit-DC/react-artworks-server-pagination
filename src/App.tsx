import { useState } from 'react';
import { useArtworks } from './hooks/useArtworks';
import { ArtworksTable } from './components/ArtworksTable';
import { TablePaginator } from './components/TablePaginator';
import { TableSkeleton } from './components/TableSkeleton';
import { ThemeToggle } from './components/ThemeToggle';
import ClickSpark from './components/ClickSpark';

export default function App() {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const state = useArtworks(page);

  function handlePageChange(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isLoading = state.status === 'idle' || state.status === 'loading';

  return (
    <ClickSpark sparkColor="var(--accent)" sparkSize={7} sparkRadius={16} sparkCount={8}>
      <div className="min-h-screen bg-(--bg) transition-colors duration-300">

        {/* ── Header ───────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-20 border-b border-(--border-subtle) transition-colors duration-300"
          style={{
            background: 'color-mix(in srgb, var(--surface) 85%, transparent)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          }}
        >
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8" style={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

            {/* Left — brand */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Monogram */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-[13px] tracking-tight select-none"
                style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hi) 100%)', boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent)' }}
                aria-hidden="true"
              >
                AIC
              </div>
              <div className="min-w-0">
                <h1 className="text-[15px] font-semibold tracking-tight text-(--text-1) leading-tight truncate">
                  Art Institute of Chicago
                </h1>
                <p className="text-[11px] text-(--text-2) leading-tight mt-px">Artworks Collection</p>
              </div>
            </div>

            {/* Right — selection badge + theme toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-1 animate-scale-in">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-(--accent) rounded-full px-3 py-1 cursor-default select-none"
                    style={{ background: 'var(--accent-muted)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ background: 'var(--accent)', animation: 'pulse-accent 2s ease infinite' }}
                    />
                    <span className="tabular-nums">{selectedIds.size}</span>
                    <span className="hidden sm:inline text-(--text-2) font-normal">selected</span>
                  </span>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-(--text-2) transition-colors duration-150 cursor-pointer hover:bg-(--surface-2) hover:text-(--text-1)"
                    aria-label="Clear selection"
                    title="Clear selection"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                      <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              )}
              <div className="w-px h-5 bg-(--border-subtle) mx-1" aria-hidden="true" />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* ── Main ─────────────────────────────────────────────── */}
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {state.status === 'error' && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] animate-fade-in">
              <svg className="mt-px shrink-0" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M7.5 4.5v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="7.5" cy="10.5" r=".75" fill="currentColor"/>
              </svg>
              <span>Failed to load: {state.message}</span>
            </div>
          )}

          {isLoading ? (
            <div className="animate-fade-in">
              <TableSkeleton />
            </div>
          ) : (
            <ArtworksTable
              artworks={state.status === 'success' ? state.data : []}
              loading={false}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          )}

          {state.status === 'success' && (
            <TablePaginator
              pagination={state.pagination}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </ClickSpark>
  );
}

