#!/usr/bin/env bash
# ============================================================================
# ANCHOR OS — one-command local development
#
#   npm run dev:local
#
# Starts the Firebase Emulator Suite (hard-locked to demo-anchor-os, listening
# on 0.0.0.0) and the Vite dev server (0.0.0.0). The app derives the emulator
# host from the browser hostname, so both of these work with no extra setup:
#
#   http://localhost:5173/                 -> emulators reached at 127.0.0.1
#   http://anchor.tail2fa2e.ts.net:5173/   -> emulators reached at the
#                                             Tailscale hostname itself
#
# Port policy: 5173 is the canonical dev port. If it is occupied (e.g. old VM
# residue such as a PM2-managed dev server), this script REPORTS the owning
# process and temporarily serves on 5199 instead — it never kills anything.
#
# It also seeds the disposable fixture identity (TEST_USER in
# e2e/fixtures/test-data.ts) into the auth emulator. An emulator suite starts
# EMPTY, so without this the app runs but nothing can be signed into — the
# sign-in screen can only answer "Incorrect email or password", which reads like
# a wrong password instead of missing data. Skip it with ANCHOR_SKIP_SEED=1.
# ============================================================================
set -euo pipefail

CANONICAL_PORT=5173
FALLBACK_PORT=5199
PORT="${CANONICAL_PORT}"

# --- 1. Port check: report the owner, fall back to 5199 — never kill --------
if lsof -nP -iTCP:"${CANONICAL_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "⚠️  Port ${CANONICAL_PORT} (canonical dev port) is currently occupied by:"
    lsof -nP -iTCP:"${CANONICAL_PORT}" -sTCP:LISTEN | tail -n +2 || true
    echo "   Nothing was killed. Temporarily serving on ${FALLBACK_PORT} for this session."
    echo "   Remove the old residue to restore ${CANONICAL_PORT}."
    PORT="${FALLBACK_PORT}"
fi

# --- 2. Firebase emulators (skip if already running) ------------------------
if curl -s -o /dev/null http://127.0.0.1:9099; then
    echo "✓ Firebase emulators already running (auth:9099 firestore:8080)"
else
    echo "🔥 Starting Firebase emulators (project: demo-anchor-os, host: 0.0.0.0)…"
    firebase emulators:start --project demo-anchor-os --only auth,firestore,functions,storage &
    EMULATOR_PID=$!
    trap 'kill "${EMULATOR_PID}" 2>/dev/null || true' EXIT
    for _ in $(seq 1 60); do
        curl -s -o /dev/null http://127.0.0.1:9099 && break
        sleep 1
    done
    if ! curl -s -o /dev/null http://127.0.0.1:9099; then
        echo "✗ Firebase emulators failed to start" >&2
        exit 1
    fi
    echo "✓ Emulators ready (auth:9099 firestore:8080 functions:5001 storage:9199)"
fi

# --- 2b. Seed the local login identity --------------------------------------
# Idempotent: the run id is fixed, so re-running overwrites the same documents
# rather than piling up accounts. The password is deliberately NOT printed here —
# it is committed in e2e/fixtures/test-data.ts (TEST_USER).
if [ "${ANCHOR_SKIP_SEED:-0}" = "1" ]; then
    echo "⏭️  ANCHOR_SKIP_SEED=1 — leaving the emulator with no seeded login"
else
    echo "🌱 Seeding the local login identity (fixture: e2e/fixtures/test-data.ts)…"
    if npm run --silent seed:local; then
        echo "✓ Sign in with TEST_USER from e2e/fixtures/test-data.ts (email + password)"
    else
        echo "⚠️  Could not seed the login identity (see above). The app still runs, but no" >&2
        echo "   local account exists to sign in with. Retry with: npm run seed:local" >&2
    fi
fi

# --- 3. Vite dev server (foreground; Ctrl+C also stops emulators we started)
echo "🚀 Starting Vite on 0.0.0.0:${PORT} …"
echo "   Local:     http://localhost:${PORT}/"
echo "   Tailscale: http://anchor.tail2fa2e.ts.net:${PORT}/"
npx vite --config config/vite.config.ts --host 0.0.0.0 --port "${PORT}" --strictPort
