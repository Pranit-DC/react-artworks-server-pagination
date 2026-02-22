import type { ArtworkPagination } from '../types/artwork';
import { useState } from 'react';

interface Props {
  pagination: ArtworkPagination;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48, 100];

export function TablePaginator({ pagination, onPageChange, pageSize, onPageSizeChange }: Props) {
  const { current_page, total_pages, total, limit } = pagination;
  const start = (current_page - 1) * limit + 1;
  const end   = Math.min(current_page * limit, total);

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

  /* Shared style for first/prev/next/last buttons inside the nav pill */
  const navBtn = (disabled: boolean) =>
    [
      'w-8 h-8 flex items-center justify-center transition-colors duration-150 select-none',
      disabled
        ? 'text-(--text-3) opacity-35 pointer-events-none cursor-default'
        : 'text-(--text-2) hover:text-(--accent) hover:bg-(--accent-muted) cursor-pointer active:scale-90',
    ].join(' ');

  return (
    <div className="mt-4 flex items-center justify-between flex-wrap gap-y-3 gap-x-4 px-0.5 animate-fade-in">

      {/* ── Left: record range + per-page ─────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Record range */}
        <p className="text-[12px] text-(--text-2) tabular-nums select-none whitespace-nowrap">
          <span className="font-semibold text-(--text-1)">{start.toLocaleString()}–{end.toLocaleString()}</span>
          <span className="text-(--text-3)"> of {total.toLocaleString()}</span>
        </p>

        {/* Divider */}
        <div className="w-px h-3.5 bg-(--border-subtle) hidden sm:block" aria-hidden="true" />

        {/* Per page */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11.5px] text-(--text-3) select-none hidden sm:block">Per page</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="page-size-select"
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Right: go-to + nav controls ───────────────────────────────── */}
      <div className="flex items-center gap-2.5">

        {/* Go to page — input + submit button as a unit */}
        <form
          onSubmit={handleJump}
          className="flex items-center overflow-hidden transition-colors duration-150"
          style={{
            border: '1px solid var(--border)',
            borderRadius: '8px',
            background: 'var(--surface)',
          }}
        >
          <label
            htmlFor="goto-page-input"
            className="pl-2.5 pr-1.5 text-[11.5px] text-(--text-2) select-none whitespace-nowrap hidden sm:block"
          >
            Go to
          </label>
          <input
            id="goto-page-input"
            type="text"
            inputMode="numeric"
            value={jumpVal}
            onChange={e => {
              const digits = e.target.value.replace(/\D/g, '');
              setJumpVal(digits);
            }}
            onKeyDown={e => {
              const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Enter','Home','End'];
              if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onPaste={e => {
              e.preventDefault();
              const digits = e.clipboardData.getData('text').replace(/\D/g, '');
              setJumpVal(digits);
            }}
            placeholder={String(current_page)}
            className="w-11 h-[30px] text-center text-(--text-1) font-medium bg-transparent text-[12px] tabular-nums focus:outline-none placeholder:text-(--text-3) placeholder:opacity-50"
            aria-label="Go to page number"
          />
          <button
            type="submit"
            className={[
              'h-[30px] px-2 flex items-center justify-center border-l transition-colors duration-150',
              jumpVal
                ? 'text-(--accent) bg-(--accent-muted) border-(--accent) hover:opacity-80 cursor-pointer'
                : 'text-(--text-3) border-(--border-subtle) cursor-default pointer-events-none',
            ].join(' ')}
            tabIndex={jumpVal ? 0 : -1}
            aria-label="Jump to page"
            data-tooltip="Go to page"
          >
            <svg width="11" height="10" viewBox="0 0 11 10" fill="none" aria-hidden="true">
              <path d="M1 5h9M6.5 1.5L10 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

        {/* Nav pill: first · prev · page-x-of-y · next · last */}
        <div
          className="flex items-center overflow-hidden"
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            background: 'var(--surface)',
          }}
        >
          {/* First */}
          <button
            className={navBtn(isFirst) + ' px-2 border-r border-(--border-subtle)'}
            onClick={() => onPageChange(1)}
            disabled={isFirst}
            aria-label="First page"
            data-tooltip="First page"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M2 1.5v8M5 5.5l4-4M5 5.5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Prev */}
          <button
            className={navBtn(isFirst) + ' px-2.5 border-r border-(--border-subtle)'}
            onClick={() => onPageChange(current_page - 1)}
            disabled={isFirst}
            aria-label="Previous page"
            data-tooltip="Previous page"
          >
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
              <path d="M6 1L1.5 5.5 6 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Page X of Y */}
          <div className="px-3 h-8 flex items-center gap-1 text-[12px] tabular-nums select-none">
            <span className="font-semibold text-(--text-1)">{current_page.toLocaleString()}</span>
            <span className="text-(--text-3) font-normal">of</span>
            <span className="text-(--text-2)">{total_pages.toLocaleString()}</span>
          </div>

          {/* Next */}
          <button
            className={navBtn(isLast) + ' px-2.5 border-l border-(--border-subtle)'}
            onClick={() => onPageChange(current_page + 1)}
            disabled={isLast}
            aria-label="Next page"
            data-tooltip="Next page"
          >
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
              <path d="M1 1l4.5 4.5L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Last */}
          <button
            className={navBtn(isLast) + ' px-2 border-l border-(--border-subtle)'}
            onClick={() => onPageChange(total_pages)}
            disabled={isLast}
            aria-label="Last page"
            data-tooltip="Last page"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M9 1.5v8M6 5.5L2 1.5M6 5.5l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
