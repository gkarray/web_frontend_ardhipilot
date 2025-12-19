# Human Dev Setup: Web Frontend

## 1. Overview
- **Purpose**: Zero-to-hero setup for a fresh Ubuntu environment.
- **Component**: `web_frontend_ardhipilot`
- **Goal**: Result in a fully functional local development environment.

## 2. Prerequisites
Ensure the following are installed:
- **Node.js 20+** (LTS recommended)
- **npm** (comes with Node)

## 3. System Dependencies

### Install Node.js (v20)
```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
Verify:
```bash
node -v  # Should be >= v20.x.x
npm -v   # Should be >= 10.x.x
```

### Install Git
```bash
sudo apt update && sudo apt install -y git
```

## 4. Project Installation

### Navigate & Install
```bash
cd web_frontend_ardhipilot
npm install
```

## 5. Configuration
1. **Copy Environment File**:
   ```bash
   cp .env.example .env
   ```
2. **Edit `.env`**:
   - `VITE_API_BASE_URL`: Set to backend URL (default: `http://localhost:8000`)

## 6. Verification
Run the dev server:
```bash
npm run dev
```
- **Visually Check**: [http://localhost:5173](http://localhost:5173) should render the app.
- **Check Console**: Ensure no red errors in the browser developer tools.