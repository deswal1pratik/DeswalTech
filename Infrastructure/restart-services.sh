#!/bin/bash
# Restart all deswaltech infrastructure services

echo "🔄 Restarting DeswalTech Infrastructure Services..."
cd "$(dirname "$0")"
docker compose restart

echo "✅ Services Restarted!"
