const COL_WIDTHS = ['220px', '130px', '180px', '160px', '64px', '64px'];
const HEADERS = ['Title', 'Place of Origin', 'Artist', 'Inscriptions', 'Start', 'End'];
const ROW_COUNT = 12;

export function TableSkeleton() {
  return (
    <div className="artworks-wrap">
      {/* thead */}
      <div className="flex border-b bg-(--surface-2)" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="w-[52px] shrink-0 px-3 py-2.5 flex items-center justify-center">
          <div className="w-[15px] h-[15px] rounded-[4px] skeleton-cell" />
        </div>
        {HEADERS.map((h, i) => (
          <div
            key={h}
            style={{ minWidth: COL_WIDTHS[i] }}
            className="flex-1 px-[14px] py-2.5"
          >
            <span className="text-[10px] font-semibold tracking-[.7px] uppercase text-(--text-2)">
              {h}
            </span>
          </div>
        ))}
      </div>

      {/* rows */}
      {Array.from({ length: ROW_COUNT }).map((_, ri) => (
        <div
          key={ri}
          className="flex last:border-b-0"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            animation: `rowIn .22s cubic-bezier(.2,.8,.4,1) ${ri * 35}ms both`,
          }}
        >
          <div className="w-[52px] shrink-0 px-3 py-3 flex items-center justify-center">
            <div className="w-[15px] h-[15px] rounded-[4px] skeleton-cell" />
          </div>
          {COL_WIDTHS.map((w, ci) => (
            <div
              key={ci}
              style={{ minWidth: w }}
              className={`flex-1 px-[14px] py-3 flex items-center ${
                ci >= 4 ? 'justify-end' : ''
              }`}
            >
              <div
                className="skeleton-cell"
                style={{
                  width: ci >= 4 ? '36px' : `${50 + ((ri * 7 + ci * 13) % 40)}%`,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
