## About this file
- **Purpose**: first-time setup on a fresh Ubuntu machine (clone → working dev environment).
- **Not included**: day-to-day commands (those live in `web_frontend_ardhipilot/human_dev_workflow.md`).
- **Style**: be concise; prefer explicit versions and copy/pasteable commands.

## Scope
- **Component**: web frontend (`web_frontend_ardhipilot/`)
- **Supported OS**: Ubuntu (fresh install)

## Prerequisites
- Node.js 20+ installed
- npm package manager

## Install system dependencies

### Install Node.js (using NodeSource repository)
```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

### Install Git (if not already installed)
```bash
sudo apt update
sudo apt install -y git
```

## Project setup

### 1. Navigate to web frontend directory
```bash
cd web_frontend_ardhipilot
```

### 2. Install dependencies
```bash
npm install
```

## Environment variables

### 3. Create environment file
```bash
cp .env.example .env
```

### 4. Configure environment variables
Edit `.env` and set:
- `VITE_API_BASE_URL`: Backend API base URL (e.g., `http://localhost:8000`)
- `VITE_APP_NAME`: Application name (optional)

## First run (verification)
```bash
npm run dev
```

→ Verify: `http://localhost:5173` (default Vite dev server port)
→ Check browser console for any errors
→ Verify API connection if backend is running

## Troubleshooting
- **Symptom**: `command not found: node` or `command not found: npm`
  - **Fix**: Ensure Node.js is installed and in your PATH. Try logging out and back in, or restart your terminal.

- **Symptom**: Permission errors when installing packages
  - **Fix**: Avoid using `sudo` with npm. If needed, fix npm permissions: `mkdir ~/.npm-global && npm config set prefix '~/.npm-global'` and add to PATH.