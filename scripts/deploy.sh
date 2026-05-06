#!/bin/bash

# 企业级 API 网关部署脚本
# 支持 Docker Compose 和 Kubernetes 部署

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 命令未找到，请先安装"
        exit 1
    fi
}

# 检查环境
check_environment() {
    log_info "检查环境..."
    check_command "docker"
    check_command "docker-compose"
    log_info "环境检查通过"
}

# Docker Compose 部署
deploy_docker() {
    log_info "开始 Docker Compose 部署..."
    cd "$PROJECT_ROOT/docker"
    
    # 创建必要的目录
    log_info "创建必要的目录..."
    mkdir -p logs data
    
    # 拉取镜像
    log_info "拉取 Docker 镜像..."
    docker-compose pull
    
    # 启动服务
    log_info "启动服务..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 30
    
    # 检查服务状态
    log_info "检查服务状态..."
    docker-compose ps
    
    log_info "Docker Compose 部署完成"
    log_info "访问地址："
    log_info "  - APISIX Dashboard: http://localhost:9000"
    log_info "  - Grafana: http://localhost:3000"
    log_info "  - SkyWalking UI: http://localhost:8080"
}

# Kubernetes 部署
deploy_kubernetes() {
    log_info "开始 Kubernetes 部署..."
    
    # 检查 kubectl 是否安装
    check_command "kubectl"
    
    # 创建命名空间
    log_info "创建命名空间..."
    kubectl create namespace api-gateway --dry-run=client -o yaml | kubectl apply -f -
    
    # 部署依赖组件
    log_info "部署 Redis Cluster..."
    cd "$PROJECT_ROOT/helm/redis"
    helm install redis . -n api-gateway --create-namespace
    
    log_info "部署 PostgreSQL..."
    cd "$PROJECT_ROOT/helm/postgresql"
    helm install postgresql . -n api-gateway
    
    log_info "部署 Nacos..."
    cd "$PROJECT_ROOT/helm/nacos"
    helm install nacos . -n api-gateway
    
    # 等待依赖组件就绪
    log_info "等待依赖组件就绪（2分钟）..."
    sleep 120
    
    # 部署 APISIX
    log_info "部署 APISIX..."
    cd "$PROJECT_ROOT/helm/apisix"
    helm install apisix . -n api-gateway
    
    # 部署可观测性栈
    log_info "部署可观测性栈..."
    cd "$PROJECT_ROOT/helm/observability"
    helm install observability . -n api-gateway
    
    # 等待所有服务就绪
    log_info "等待所有服务就绪（3分钟）..."
    sleep 180
    
    # 检查部署状态
    log_info "检查部署状态..."
    kubectl get all -n api-gateway
    
    log_info "Kubernetes 部署完成"
}

# 停止服务
stop_services() {
    log_info "停止服务..."
    cd "$PROJECT_ROOT/docker"
    docker-compose down
}

# 清理部署
cleanup() {
    log_info "清理部署..."
    cd "$PROJECT_ROOT/docker"
    docker-compose down -v
    rm -rf logs data
}

# 打印帮助信息
print_help() {
    echo "企业级 API 网关部署脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  docker    部署到 Docker Compose"
    echo "  k8s       部署到 Kubernetes"
    echo "  stop      停止服务"
    echo "  cleanup   清理部署"
    echo "  help      显示帮助信息"
    echo ""
}

# 主函数
main() {
    case "${1:-help}" in
        docker)
            check_environment
            deploy_docker
            ;;
        k8s)
            deploy_kubernetes
            ;;
        stop)
            stop_services
            ;;
        cleanup)
            cleanup
            ;;
        help)
            print_help
            ;;
        *)
            log_error "未知命令: $1"
            print_help
            exit 1
            ;;
    esac
}

main "$@"
