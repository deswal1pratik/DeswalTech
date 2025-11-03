#!/bin/bash
# Start all deswaltech infrastructure services

echo "🚀 Starting DeswalTech Infrastructure Services..."
cd "$(dirname "$0")"
docker compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "✅ Services Started!"
echo ""
echo "📊 Service URLs:"
echo "  PostgreSQL:    localhost:5432 (user: postgres, pass: postgres)"
echo "  Redis:         localhost:6379 (pass: redispass)"
echo "  MinIO Console: http://localhost:9001 (user: minioadmin, pass: minioadmin123)"
echo "  MinIO API:     http://localhost:9000"
echo "  pgAdmin:       http://localhost:5050 (user: admin@deswal.tech, pass: admin123)"
echo "  Prometheus:    http://localhost:9090"
echo "  Grafana:       http://localhost:3001 (user: admin, pass: admin123)"
echo "  Temporal UI:   http://localhost:8080 (workflow visualization)"
echo "  Temporal gRPC: localhost:7233 (workflow execution)"
echo ""
echo "🔍 Check status: docker compose ps"
echo "📋 View logs:    docker compose logs -f"
echo "🛑 Stop all:     ./stop-services.sh"
