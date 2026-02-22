# Art Institute of Chicago - Artworks Browser

Browse the Art Institute of Chicago's public collection with server-side pagination and persistent row selection.

**Live:** _add deployed URL_
**Repo:** _add GitHub URL_

---

## Tech

- Vite + React 19 + TypeScript
- PrimeReact DataTable (unstyled)
- Tailwind CSS v4

---

## Features

- Server-side pagination - one API call per page, nothing cached
- Row selection persists across page navigation (stores IDs only, not objects)
- Select-all on current page
- Custom "select first N rows" overlay panel
- Rows per page: 6, 12, 24, 48, 100
- Go-to-page input
- Light / dark mode

---

## Running Locally

```bash
npm install
npm run dev      # http://localhost:5174
npm run build
npm run preview
```

---

## Deployment

Static site - no backend, no environment variables needed. Deploy `dist/` to Cloudflare Pages or Netlify. Do not use Vercel (requires login to access deployed apps).