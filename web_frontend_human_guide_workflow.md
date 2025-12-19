# Human Dev Workflow: Web Frontend

## 1. Overview
- **Purpose**: Daily development operations (run, build, test).
- **Component**: `web_frontend_ardhipilot`
- **Assumed State**: Completed `human_dev_setup.md`.

## 2. Quick Start
```bash
cd web_frontend_ardhipilot
npm run dev
```
- **Local URL**: [http://localhost:5173](http://localhost:5173)

## 3. Common Tasks

### Development Server
```bash
npm run dev
```
Runs the app in development mode with HMR (Hot Module Replacement).

### Linting
```bash
npm run lint
```
Checks code quality and style.

### Building for Production
```bash
npm run build
npm run preview
```
- `build`: Generates static files in `dist/`.
- `preview`: Serves the built files locally for testing.

## 4. Troubleshooting

### Port Already in Use
- **Symptom**: `Error: listen EADDRINUSE: address already in use`
- **Fix**: Vite usually picks the next port (e.g., 5174). To force a port:
  ```bash
  npm run dev -- --port 3000
  ```

### Missing Modules
- **Symptom**: Import errors or "module not found".
- **Fix**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Tailwind Styles Not Applying
- **Check**:
  - `src/index.css` should have `@import "tailwindcss";`.
  - `vite.config.ts` should include the tailwind plugin.