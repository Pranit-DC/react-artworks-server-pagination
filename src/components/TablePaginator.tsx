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

  const btnBase = 'w-8 h-8 flex items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--text-1) text-[15px] leading-none transition-all duration-150 cursor-pointer select-none';
  const btnHover = 'hover:border-(--accent) hover:text-(--accent) hover:bg-(--surface-2) active:scale-90';
  const btnOff   = 'opacity-25 cursor-not-allowed pointer-events-none';

  return (
    <div className="mt-1 flex items-center justify-between flex-wrap gap-y-3 gap-x-4 px-1 pt-3.5 pb-1">
      <span className="text-[12px] text-(--text-2) tabular-nums">
        {start.toLocaleString()}–{end.toLocaleString()}{' '}
        <span className="opacity-50">of</span>{' '}
        {total.toLocaleString()}
      </span>

      <div className="flex items-center gap-2">
        <form onSubmit={handleJump} className="flex items-center gap-1.5">
          <label className="text-[11px] text-(--text-2) hidden sm:block">Go to</label>
          <input
            type="number"
            min={1}
            max={total_pages}
            value={jumpVal}
            onChange={e => setJumpVal(e.target.value)}
            placeholder={String(current_page)}
            className="w-14 h-8 rounded-md border border-(--border) bg-(--surface) text-(--text-1) text-[12px] text-center px-2 tabular-nums focus:outline-none focus:border-(--accent) transition-colors placeholder:opacity-30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </form>

        <div className="w-px h-4 bg-(--border) mx-0.5" />

        <button
          className={`${btnBase} ${current_page <= 1 ? btnOff : btnHover}`}
          onClick={() => onPageChange(1)}
          disabled={current_page <= 1}
          aria-label="First page"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2v8M5.5 6l4-4M5.5 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          className={`${btnBase} ${current_page <= 1 ? btnOff : btnHover}`}
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        <span className="text-[12px] text-(--text-1) tabular-nums min-w-[80px] text-center select-none">
          {current_page.toLocaleString()} / {total_pages.toLocaleString()}
        </span>

        <button
          className={`${btnBase} ${current_page >= total_pages ? btnOff : btnHover}`}
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page >= total_pages}
          aria-label="Next page"
        >
          ›
        </button>

        <button
          className={`${btnBase} ${current_page >= total_pages ? btnOff : btnHover}`}
          onClick={() => onPageChange(total_pages)}
          disabled={current_page >= total_pages}
          aria-label="Last page"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M10 2v8M6.5 6L2.5 2M6.5 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}


