## About this file
- **Purpose**: day-to-day development commands (run/test/lint/debug).
- **Not included**: first-time machine setup (that lives in `web_frontend_ardhipilot/human_dev_setup.md`).
- **Style**: be concise; prefer copy/pasteable commands with expected outcomes (ports/URLs/log hints).

## Quick start (dev)
```bash
cd web_frontend_ardhipilot
npm run dev
```
→ Dev server: `http://localhost:5173`

## Common commands
- **Run server**:
  ```bash
  npm run dev
  ```
- **Build**:
  ```bash
  npm run build
  ```
- **Preview production build**:
  ```bash
  npm run preview
  ```
- **Lint**:
  ```bash
  npm run lint
  ```
- **Tests**:
  ```bash
  # (to be added when testing framework is set up)
  ```

## Troubleshooting
- **Symptom**: `command not found: npm` or `command not found: node`
  - **Fix**: Ensure Node.js is installed and in your PATH. Try logging out and back in, or restart your terminal.

- **Symptom**: Port 5173 already in use
  - **Fix**: Vite will automatically try the next available port, or specify a different port: `npm run dev -- --port 3000`

- **Symptom**: Module not found errors
  - **Fix**: Run `npm install` to ensure all dependencies are installed

- **Symptom**: Tailwind styles not applying
  - **Fix**: Verify that `@import "tailwindcss";` is in `src/index.css` and the file is imported in `src/main.tsx`. Also check that `tailwindcss()` plugin is in `vite.config.ts`.