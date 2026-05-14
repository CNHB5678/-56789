#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "=========================================="
echo "  灵剪Agent - 启动中..."
echo "=========================================="

if [ -d "$PROJECT_ROOT/backend" ]; then
    echo ""
    echo "🚀 启动后端服务 (端口 8000)..."
    cd backend
    python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    echo "   后端 PID: $BACKEND_PID"
    cd ..
fi

if [ -d "$PROJECT_ROOT/frontend" ]; then
    echo ""
    echo "🎨 启动前端开发服务器 (端口 1420)..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "   前端 PID: $FRONTEND_PID"
    cd ..
fi

echo ""
echo "=========================================="
echo "  服务已启动！"
echo "=========================================="
echo ""
echo "  🌐 前端界面: http://localhost:1420"
echo "  🔧 后端API:  http://localhost:8000"
echo "  📚 API文档:  http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    [ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null
    [ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

trap cleanup SIGINT SIGTERM

wait
