#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing dependencies…"
npm install

echo ""
echo "==> Starting dev server…"
echo "→ http://localhost:5173"
exec npx vite --host 0.0.0.0
