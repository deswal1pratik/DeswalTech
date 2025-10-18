#!/bin/bash
# Restart all unicorn infrastructure services

echo "🔄 Restarting Unicorn Infrastructure Services..."
cd ~/Developer/Infrastructure
docker compose restart

echo "✅ Services Restarted!"
