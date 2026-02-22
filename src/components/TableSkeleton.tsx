const COL_WIDTHS = ['240px', '150px', '200px', '180px', '72px', '72px'];
const HEADERS = ['Title', 'Place of Origin', 'Artist', 'Inscriptions', 'Start', 'End'];
const ROW_COUNT = 12;

export function TableSkeleton() {
  return (
    <div className="rounded-[10px] border border-(--border) bg-(--surface) overflow-hidden shadow-(--shadow-sm)">
      {/* thead */}
      <div className="flex border-b border-(--border) bg-(--surface-2)">
        {/* checkbox column */}
        <div className="w-14 shrink-0 px-3.5 py-2.5 flex items-center justify-center">
          <div className="w-4 h-4 rounded skeleton-cell" />
        </div>
        {HEADERS.map((h, i) => (
          <div
            key={h}
            style={{ minWidth: COL_WIDTHS[i] }}
            className="flex-1 px-3.5 py-2.5"
          >
            <span className="text-[11px] font-semibold tracking-wider uppercase text-(--text-2)">
              {h}
            </span>
          </div>
        ))}
      </div>

      {/* rows */}
      {Array.from({ length: ROW_COUNT }).map((_, ri) => (
        <div
          key={ri}
          className="flex border-b border-(--border) last:border-b-0"
          style={{ animationDelay: `${ri * 40}ms` }}
        >
          <div className="w-14 shrink-0 px-3.5 py-2.5 flex items-center justify-center">
            <div className="w-4 h-4 rounded skeleton-cell" />
          </div>
          {COL_WIDTHS.map((w, ci) => (
            <div
              key={ci}
              style={{ minWidth: w }}
              className={`flex-1 px-3.5 py-2.5 flex items-center ${ci >= 4 ? 'justify-end' : ''}`}
            >
              <div
                className="skeleton-cell"
                style={{ width: ci >= 4 ? '40px' : `${55 + ((ri * 7 + ci * 13) % 35)}%` }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
