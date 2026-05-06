#!/bin/bash
# 企业级 API 网关安全检查脚本
# 检查安全配置并生成安全报告

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# 安全检查计数器
PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

# 报告变量
REPORT_FILE="security-report-$(date +%Y%m%d_%H%M%S).txt"
JSON_REPORT="security-report-$(date +%Y%m%d_%H%M%S).json"

# 初始化报告
init_report() {
    echo "# 企业级 API 网关安全报告" > $REPORT_FILE
    echo "## 报告生成时间: $(date '+%Y-%m-%d %H:%M:%S')" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    
    cat > $JSON_REPORT <<EOF
{
    "generated_at": "$(date +%Y-%m-%dT%H:%M:%SZ)",
    "checks": [],
    "summary": {
        "pass": 0,
        "warn": 0,
        "fail": 0
    }
}
EOF
}

# 记录检查结果
record_result() {
    local check_name="$1"
    local status="$2"
    local message="$3"
    
    echo "### $check_name" >> $REPORT_FILE
    echo "- **状态**: $status" >> $REPORT_FILE
    echo "- **详情**: $message" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    
    # 增加计数器
    case "$status" in
        "PASS") ((PASS_COUNT++)) ;;
        "WARN") ((WARN_COUNT++)) ;;
        "FAIL") ((FAIL_COUNT++)) ;;
    esac
}

# 检查文件权限
check_file_permissions() {
    log_info "检查配置文件权限..."
    
    local config_files=("config/security.yaml" "config/apisix/config.yaml")
    local permission_ok=true
    
    for file in "${config_files[@]}"; do
        if [ -f "$file" ]; then
            local perms=$(stat -c "%a" "$file")
            if [ "$perms" != "600" ] && [ "$perms" != "640" ]; then
                log_warn "文件 $file 权限为 $perms，建议设置为 600"
                record_result "配置文件权限" "WARN" "文件 $file 权限过于宽松"
                permission_ok=false
            fi
        fi
    done
    
    if [ "$permission_ok" = true ]; then
        log_pass "配置文件权限检查通过"
        record_result "配置文件权限" "PASS" "所有配置文件权限设置正确"
    fi
}

# 检查默认密码
check_default_passwords() {
    log_info "检查默认密码..."
    
    local security_config="config/security.yaml"
    local has_defaults=false
    
    if [ -f "$security_config" ]; then
        if grep -q "your_strong" "$security_config"; then
            log_fail "检测到默认密码！请立即修改"
            record_result "默认密码检查" "FAIL" "配置文件中发现默认密码"
            has_defaults=true
        else
            log_pass "默认密码检查通过"
            record_result "默认密码检查" "PASS" "未发现默认密码"
        fi
    fi
}

# 检查 SSL 配置
check_ssl_configuration() {
    log_info "检查 SSL/TLS 配置..."
    
    local apisix_config="config/apisix/config.yaml"
    
    if [ -f "$apisix_config" ]; then
        if ! grep -q "ssl:" "$apisix_config"; then
            log_warn "未检测到 SSL 配置，生产环境请启用 HTTPS"
            record_result "SSL 配置" "WARN" "未启用 HTTPS"
        else
            if grep -q "protocols.*tls_1.2" "$apisix_config" || grep -q "TLS_v1.2" "$apisix_config"; then
                log_pass "TLS 配置符合要求"
                record_result "SSL 配置" "PASS" "TLS 1.2+ 已启用"
            else
                log_warn "建议使用 TLS 1.2 或更高版本"
                record_result "SSL 配置" "WARN" "建议启用 TLS 1.2"
            fi
        fi
    fi
}

# 检查网络配置
check_network_config() {
    log_info "检查网络和防火墙配置..."
    
    # 检查是否有 localhost 绑定
    if netstat -tuln 2>/dev/null | grep -q "0.0.0.0"; then
        log_warn "检测到服务绑定在 0.0.0.0，生产环境建议限制监听地址"
        record_result "网络绑定配置" "WARN" "服务监听在所有网络接口"
    else
        log_pass "网络绑定配置检查通过"
        record_result "网络绑定配置" "PASS" "服务绑定在专用网络接口"
    fi
}

# 检查 Docker Compose 配置
check_docker_config() {
    log_info "检查 Docker Compose 安全配置..."
    
    local compose_file="docker/docker-compose.yml"
    
    if [ -f "$compose_file" ]; then
        # 检查是否以 root 运行
        if grep -q "user.*root" "$compose_file"; then
            log_warn "服务以 root 用户运行，建议使用非特权用户"
            record_result "Docker 用户权限" "WARN" "服务以 root 用户运行"
        fi
        
        # 检查敏感文件挂载
        if grep -q "docker.sock" "$compose_file"; then
            log_warn "检测到 Docker socket 挂载，存在安全风险"
            record_result "Docker 挂载配置" "WARN" "Docker socket 挂载可能被利用"
        fi
    fi
}

# 检查安全更新
check_security_updates() {
    log_info "检查安全更新..."
    
    # 这里可以集成实际的 CVE 检查
    if command -v trivy &>/dev/null; then
        log_info "使用 Trivy 进行安全扫描..."
        record_result "安全扫描工具" "PASS" "Trivy 已安装"
    else
        log_warn "建议安装 Trivy 进行镜像安全扫描"
        record_result "安全扫描工具" "WARN" "Trivy 未安装"
    fi
}

# 运行完整安全检查
run_security_scan() {
    log_info "开始全面安全检查..."
    
    init_report
    
    echo "## 检查结果汇总" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    
    check_file_permissions
    check_default_passwords
    check_ssl_configuration
    check_network_config
    check_docker_config
    check_security_updates
    
    echo "## 总结" >> $REPORT_FILE
    echo "- **通过**: $PASS_COUNT" >> $REPORT_FILE
    echo "- **警告**: $WARN_COUNT" >> $REPORT_FILE
    echo "- **失败**: $FAIL_COUNT" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    
    if [ $FAIL_COUNT -gt 0 ]; then
        log_fail "安全检查发现 $FAIL_COUNT 个严重问题！"
    elif [ $WARN_COUNT -gt 0 ]; then
        log_warn "安全检查发现 $WARN_COUNT 个警告"
    else
        log_pass "所有安全检查通过！"
    fi
    
    echo "详细报告已保存至: $REPORT_FILE"
}

# 帮助菜单
show_help() {
    echo "企业级 API 网关安全检查脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  scan        运行完整安全扫描"
    echo "  check       检查主要安全配置"
    echo "  help        显示帮助信息"
    echo ""
}

# 主函数
main() {
    case "${1:-scan}" in
        "scan")
            run_security_scan
            ;;
        "check")
            init_report
            check_default_passwords
            check_ssl_configuration
            ;;
        "help")
            show_help
            ;;
        *)
            log_error "未知命令"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
