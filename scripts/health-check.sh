#!/bin/bash

# 企业级 API 网关健康检查脚本
# 检查所有服务的健康状态

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# 健康检查函数
check_health() {
    local service_name="$1"
    local endpoint="$2"
    local max_retries=10
    local retry_delay=3
    
    log_info "检查 $service_name 健康状态..."
    
    for ((i=1; i<=max_retries; i++)); do
        if curl -sf "$endpoint" > /dev/null 2>&1; then
            log_info "$service_name 健康检查通过"
            return 0
        fi
        
        log_warn "$service_name 健康检查失败（第 $i 次重试）..."
        sleep $retry_delay
    done
    
    log_error "$service_name 健康检查失败"
    return 1
}

# 检查 Docker Compose 服务
check_docker_services() {
    log_info "检查 Docker Compose 服务..."
    
    check_health "APISIX Dashboard" "http://localhost:9000/healthz" || true
    check_health "Prometheus" "http://localhost:9090/-/ready" || true
    check_health "Grafana" "http://localhost:3000/api/health" || true
    check_health "SkyWalking UI" "http://localhost:8080/health" || true
    
    # 检查 APISIX 数据面
    for port in 9091 9092 9093; do
        check_health "APISIX Node (port $port)" "http://localhost:$port/healthz" || true
    done
}

# 检查 Kubernetes 服务
check_kubernetes_services() {
    log_info "检查 Kubernetes 服务..."
    
    local namespace="api-gateway"
    
    # 检查所有 Pod 状态
    log_info "检查 Pod 状态..."
    kubectl get pods -n "$namespace"
    
    # 检查 Pod 事件
    log_info "检查最近的 Pod 事件..."
    kubectl get events -n "$namespace" --sort-by=.lastTimestamp | tail -30
    
    # 检查 APISIX 服务
    check_health "APISIX Dashboard" "http://localhost:9000/healthz" || true
}

# 打印帮助信息
print_help() {
    echo "企业级 API 网关健康检查脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  docker    检查 Docker Compose 服务"
    echo "  k8s       检查 Kubernetes 服务"
    echo "  help      显示帮助信息"
    echo ""
}

# 主函数
main() {
    case "${1:-help}" in
        docker)
            check_docker_services
            ;;
        k8s)
            check_kubernetes_services
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
