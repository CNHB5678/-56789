#!/bin/bash

set -e

echo "=========================================="
echo "  灵剪Agent - 智能视频创作助手"
echo "=========================================="
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ 错误: 需要安装 $1"
        exit 1
    fi
}

echo "🔍 检查环境..."
check_command python3
check_command node
check_command npm
echo "✅ 环境检查通过"

echo ""
echo "📁 创建数据目录..."
mkdir -p data/media
mkdir -p data/temp
mkdir -p data/chromadb
mkdir -p data/projects
echo "✅ 目录创建完成"

echo ""
echo "🔧 安装后端依赖..."
cd backend
if command -v uv &> /dev/null; then
    uv pip install -r requirements.txt --system
else
    pip3 install -r requirements.txt
fi
cd ..
echo "✅ 后端依赖安装完成"

echo ""
echo "📦 安装前端依赖..."
cd frontend
npm install
cd ..
echo "✅ 前端依赖安装完成"

echo ""
echo "=========================================="
echo "  安装完成！"
echo "=========================================="
echo ""
echo "启动方式："
echo ""
echo "1. 启动后端服务:"
echo "   cd backend"
echo "   python3 -m uvicorn app.main:app --reload --port 8000"
echo ""
echo "2. 启动前端开发服务器:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "或者使用快捷脚本:"
echo "   ./scripts/start.sh"
echo ""
