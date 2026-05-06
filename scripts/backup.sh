#!/bin/bash

# 企业级 API 网关备份脚本
# 备份配置、数据和日志

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_ROOT}/backups/$(date +%Y%m%d_%H%M%S)"

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

# 备份函数
backup_configs() {
    log_info "备份配置文件..."
    mkdir -p "$BACKUP_DIR/config"
    cp -r "${PROJECT_ROOT}/config" "$BACKUP_DIR/config"
    cp "${PROJECT_ROOT}/docker/docker-compose.yml" "$BACKUP_DIR/config/"
}

backup_kubernetes() {
    log_info "备份 Kubernetes 资源..."
    mkdir -p "$BACKUP_DIR/k8s"
    local namespace="api-gateway"
    
    kubectl get all -n "$namespace" -o yaml > "$BACKUP_DIR/k8s/all-resources.yaml"
    kubectl get secrets -n "$namespace" -o yaml > "$BACKUP_DIR/k8s/secrets.yaml"
    kubectl get configmaps -n "$namespace" -o yaml > "$BACKUP_DIR/k8s/configmaps.yaml"
    kubectl get pv,pvc -n "$namespace" -o yaml > "$BACKUP_DIR/k8s/storage.yaml"
}

backup_postgresql() {
    log_info "备份 PostgreSQL 数据..."
    mkdir -p "$BACKUP_DIR/postgres"
    
    # 使用 pg_dump 备份数据库
    if command -v docker &> /dev/null; then
        docker exec api-gateway-postgresql-primary pg_dump -U apisix -d apisix > "$BACKUP_DIR/postgres/apisix.sql"
    fi
}

backup_nacos() {
    log_info "备份 Nacos 配置..."
    mkdir -p "$BACKUP_DIR/nacos"
    # 备份 Nacos 数据（需要通过 API 或数据库）
}

backup_grafana() {
    log_info "备份 Grafana 配置..."
    mkdir -p "$BACKUP_DIR/grafana"
    cp -r "${PROJECT_ROOT}/monitoring/grafana" "$BACKUP_DIR/"
}

# 创建压缩包
create_archive() {
    log_info "创建备份压缩包..."
    local backup_name="api-gateway-backup-$(date +%Y%m%d_%H%M%S).tar.gz"
    
    cd "$BACKUP_DIR" && tar -zcf "$backup_name" . && mv "$backup_name" "$PROJECT_ROOT/backups/"
    log_info "备份文件已保存到: $PROJECT_ROOT/backups/$backup_name"
}

# 清理旧备份
cleanup_old_backups() {
    log_info "清理30天前的旧备份..."
    find "$PROJECT_ROOT/backups" -type f -name "api-gateway-backup-*.tar.gz" -mtime +30 -delete
}

# 主函数
main() {
    log_info "开始备份过程..."
    
    # 创建备份目录
    mkdir -p "$BACKUP_DIR" "$PROJECT_ROOT/backups"
    
    # 执行备份
    backup_configs
    backup_postgresql
    backup_grafana
    
    # 如果是 Kubernetes 环境
    if [ "$1" = "k8s" ]; then
        backup_kubernetes
    fi
    
    create_archive
    cleanup_old_backups
    
    log_info "备份完成"
}

main "$@"
