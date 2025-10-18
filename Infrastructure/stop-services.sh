#!/bin/bash
# Stop all unicorn infrastructure services

echo "🛑 Stopping Unicorn Infrastructure Services..."
cd ~/Developer/Infrastructure
docker compose down

echo "✅ Services Stopped!"
