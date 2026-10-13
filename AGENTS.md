# Base44 Dev Environment

## Project Overview
Static website ("Red Flags & Receipts — She Raised Me Right"). No build step, no backend, no package.json. `index.html` is the entry point.

## Running the App
```
docker compose -f docker-compose.base44.yml up -d
```
Serves static files via nginx:alpine on **port 3000**.

## File Permissions
The repo root directory can have restrictive (700) permissions after import. If nginx returns 403 Forbidden, run:
```
chmod 755 . && chmod 644 index.html styles.css script.js SheRaisedMeRight.jsx && chmod -R 755 assets images
```

## Health Check
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` should return 200
- Health path: `/`

## Notes
- `SheRaisedMeRight.jsx` is a React component but there is no build system to compile it; it is not served by the static site.
- `assets/` contains pre-built Vite bundles but they are not referenced by `index.html`.
- The site uses a Formspree endpoint for signup forms (external service, no credentials needed to serve the page).
