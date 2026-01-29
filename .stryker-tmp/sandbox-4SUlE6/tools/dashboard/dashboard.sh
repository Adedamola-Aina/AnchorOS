#!/bin/bash
# Dashboard Control Script
# Usage: ./dashboard.sh [start|stop|restart|status|logs]

DASHBOARD_DIR="/root/anchor-os/tools/dashboard"

case "$1" in
    start)
        echo "🚀 Starting Dashboard..."
        # Kill any existing processes on port 3001
        lsof -ti:3001 | xargs kill -9 2>/dev/null
        sleep 1
        # Start with PM2
        pm2 start "$DASHBOARD_DIR/ecosystem.config.cjs" --update-env
        pm2 save
        echo "✅ Dashboard started at http://localhost:3001"
        ;;
    stop)
        echo "🛑 Stopping Dashboard..."
        pm2 stop anchor-dashboard
        pm2 save
        echo "✅ Dashboard stopped"
        ;;
    restart)
        echo "🔄 Restarting Dashboard..."
        lsof -ti:3001 | xargs kill -9 2>/dev/null
        sleep 1
        pm2 restart anchor-dashboard --update-env
        pm2 save
        echo "✅ Dashboard restarted"
        ;;
    status)
        pm2 status anchor-dashboard
        echo ""
        curl -s http://localhost:3001/api/git/stats 2>/dev/null && echo "✅ API responding" || echo "❌ API not responding"
        ;;
    logs)
        pm2 logs anchor-dashboard --lines 50
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
