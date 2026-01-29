#!/bin/bash
# Stable local development with Tailscale exposure
# Usage: ./scripts/dev-serve.sh

set -e

PORT=5173
TAILSCALE_PORT=443

echo "🚀 Starting Anchor OS Development Server..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping dev server..."
    tailscale funnel reset 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    echo "✅ Cleanup complete"
    exit 0
}

trap cleanup EXIT INT TERM

# Reset any existing Tailscale config
echo "📡 Configuring Tailscale..."
tailscale funnel reset 2>/dev/null || true
tailscale serve reset 2>/dev/null || true

# Start Vite in background with auto-restart
echo "⚡ Starting Vite dev server on port $PORT..."
cd /root/anchor-os

# Use a loop to auto-restart if Vite crashes
while true; do
    npm run dev -- --host 0.0.0.0 --port $PORT &
    VITE_PID=$!
    
    # Wait for Vite to start
    sleep 3
    
    # Set up Tailscale funnel (expose to internet)
    echo "🌐 Exposing via Tailscale Funnel..."
    tailscale funnel --bg $PORT
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  ✅ DEV SERVER RUNNING"
    echo ""
    echo "  Local:     http://localhost:$PORT"
    echo "  Tailscale: https://anchor.tail2fa2e.ts.net"
    echo ""
    echo "  Press Ctrl+C to stop"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    
    # Wait for Vite process
    wait $VITE_PID
    
    echo "⚠️  Vite crashed, restarting in 2 seconds..."
    sleep 2
done
