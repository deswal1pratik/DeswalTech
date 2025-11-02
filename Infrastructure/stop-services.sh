#!/bin/bash
# Stop all deswaltech infrastructure services

echo "🛑 Stopping DeswalTech Infrastructure Services..."
cd "$(dirname "$0")"
docker compose down

echo "✅ Services Stopped!"
