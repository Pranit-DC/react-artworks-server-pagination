import type { ArtworkPagination } from '../types/artwork';
import { useState } from 'react';

interface Props {
  pagination: ArtworkPagination;
  onPageChange: (page: number) => void;
}

export function TablePaginator({ pagination, onPageChange }: Props) {
  const { current_page, total_pages, total, limit } = pagination;
  const start = (current_page - 1) * limit + 1;
  const end = Math.min(current_page * limit, total);

  const [jumpVal, setJumpVal] = useState('');

  function handleJump(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(jumpVal, 10);
    if (!isNaN(n) && n >= 1 && n <= total_pages && n !== current_page) {
      onPageChange(n);
    }
    setJumpVal('');
  }

  const isFirst = current_page <= 1;
  const isLast  = current_page >= total_pages;

  const btn = (disabled: boolean) =>
    [
      'w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-150 cursor-pointer select-none text-[13px]',
      disabled
        ? 'border-(--border-subtle) text-(--text-3) opacity-40 pointer-events-none'
        : 'border-(--border) text-(--text-2) bg-(--surface) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent-muted) active:scale-90',
    ].join(' ');

  return (
    <div className="mt-3 flex items-center justify-between flex-wrap gap-y-3 gap-x-6 px-0.5 py-1 animate-fade-in">

      {/* Record count */}
      <p className="text-[11.5px] text-(--text-2) tabular-nums select-none">
        <span className="font-medium text-(--text-1)">{start.toLocaleString()}–{end.toLocaleString()}</span>
        {' '}
        <span className="text-(--text-3)">of {total.toLocaleString()}</span>
      </p>

      <div className="flex items-center gap-2">
        {/* Jump to page */}
        <form onSubmit={handleJump} className="flex items-center gap-1.5">
          <label className="text-[11px] text-(--text-3) hidden sm:block select-none">Page</label>
          <input
            type="number"
            min={1}
            max={total_pages}
            value={jumpVal}
            onChange={e => setJumpVal(e.target.value)}
            placeholder={String(current_page)}
            className="w-12 h-8 rounded-lg border border-(--border) bg-(--surface) text-(--text-1) text-[12px] text-center px-2 tabular-nums focus:outline-none focus:border-(--accent) transition-colors placeholder:opacity-25 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </form>

        <div className="w-px h-4 bg-(--border-subtle)" aria-hidden="true" />

        {/* First */}
        <button className={btn(isFirst)} onClick={() => onPageChange(1)} disabled={isFirst} aria-label="First page">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path d="M2 1.5v8M5 5.5l4-4M5 5.5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Prev */}
        <button className={btn(isFirst)} onClick={() => onPageChange(current_page - 1)} disabled={isFirst} aria-label="Previous page">
          <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
            <path d="M6 1L1.5 5.5 6 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Current / Total pill */}
        <div
          className="flex items-center gap-1 px-3 h-8 rounded-lg select-none text-[12px] tabular-nums font-medium"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            minWidth: '80px',
            justifyContent: 'center',
          }}
        >
          <span className="text-(--text-1)">{current_page.toLocaleString()}</span>
          <span className="text-(--text-3) font-normal">/</span>
          <span className="text-(--text-2) font-normal">{total_pages.toLocaleString()}</span>
        </div>

        {/* Next */}
        <button className={btn(isLast)} onClick={() => onPageChange(current_page + 1)} disabled={isLast} aria-label="Next page">
          <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
            <path d="M1 1l4.5 4.5L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Last */}
        <button className={btn(isLast)} onClick={() => onPageChange(total_pages)} disabled={isLast} aria-label="Last page">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path d="M9 1.5v8M6 5.5L2 1.5M6 5.5l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}


