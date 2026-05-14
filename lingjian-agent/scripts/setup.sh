#!/bin/bash

set -e

echo "正在安装 灵剪Agent..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 需要安装 Node.js"
    exit 1
fi

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "错误: 需要安装 Python 3"
    exit 1
fi

# 检查 FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "警告: FFmpeg 未安装，AI功能可能受限"
fi

echo "安装前端依赖..."
cd frontend
npm install

echo "安装后端依赖..."
cd ../backend
pip install -r requirements.txt

echo "创建数据目录..."
mkdir -p ../data/media
mkdir -p ../data/temp
mkdir -p ../data/chromadb

echo ""
echo "安装完成！"
echo ""
echo "启动开发服务器:"
echo "  后端: cd backend && uvicorn app.main:app --reload --port 8000"
echo "  前端: cd frontend && npm run tauri dev"
echo ""
