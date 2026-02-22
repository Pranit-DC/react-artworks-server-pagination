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

        <header className="sticky top-0 z-10 bg-(--surface) border-b border-(--border) shadow-(--shadow-sm) transition-colors duration-300">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <h1 className="text-[16px] font-semibold tracking-tight text-(--text-1) leading-tight">
                  Art Institute of Chicago
                </h1>
                <p className="text-[11px] text-(--text-2) mt-0.5 font-normal">Artworks Collection</p>
              </div>
              {selectedIds.size > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 animate-fade-in shrink-0">
                  <span className="text-[11px] font-medium text-(--accent) bg-(--row-selected) px-2.5 py-1 rounded-full">
                    {selectedIds.size} selected
                  </span>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="text-[11px] text-(--text-2) hover:text-(--text-1) transition-colors cursor-pointer px-1 py-0.5"
                    aria-label="Clear selection"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {selectedIds.size > 0 && (
                <div className="sm:hidden flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-(--accent)">
                    {selectedIds.size} selected
                  </span>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="text-[11px] text-(--text-2) cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {state.status === 'error' && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] animate-fade-in">
              Failed to load: {state.message}
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

