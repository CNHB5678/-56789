#!/bin/bash
# SSL/TLS 证书生成脚本
# 用于生成自签名证书或获取 Let's Encrypt 证书

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERTS_DIR="$SCRIPT_DIR/../certs"
mkdir -p "$CERTS_DIR"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_pass() { echo -e "${GREEN}[PASS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_fail() { echo -e "${RED}[FAIL]${NC} $1"; }

# 生成自签名证书
generate_self_signed() {
    local domain="$1"
    local cert_path="$CERTS_DIR/$domain.crt"
    local key_path="$CERTS_DIR/$domain.key"
    local csr_path="$CERTS_DIR/$domain.csr"
    
    log_info "为 $domain 生成自签名证书..."
    
    # 检查是否已存在
    if [ -f "$cert_path" ] && [ -f "$key_path" ]; then
        log_warn "证书已存在，跳过生成"
        return
    fi
    
    # 生成私钥
    openssl genrsa -out "$key_path" 4096
    log_pass "私钥已生成: $key_path"
    
    # 生成 CSR (证书签名请求)
    openssl req -new -key "$key_path" -out "$csr_path" -subj "/C=CN/ST=Beijing/L=Beijing/O=API Gateway/OU=Tech/CN=$domain"
    log_pass "CSR 已生成: $csr_path"
    
    # 自签名证书，有效期 1 年
    openssl x509 -req -days 365 -in "$csr_path" -signkey "$key_path" -out "$cert_path"
    log_pass "自签名证书已生成: $cert_path"
    
    # 生成 DH 参数 (可选，但推荐)
    log_info "生成 DH 参数 (Diffie-Hellman)..."
    openssl dhparam -out "$CERTS_DIR/dhparam.pem" 2048
    log_pass "DH 参数已生成"
}

# 生成企业级证书配置
generate_cert_config() {
    local domain="$1"
    local config_path="$CERTS_DIR/$domain.conf"
    
    cat > "$config_path" <<EOF
# SSL/TLS 配置文件
domain=$domain

# TLS 版本和加密套件
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers on;

# 会话缓存
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS (HTTP Strict Transport Security)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# 安全头部
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self'";
EOF

    log_pass "证书配置文件已生成: $config_path"
}

# 生成证书链
generate_cert_chain() {
    local domain="$1"
    log_info "生成证书链..."
    
    # 如果有 CA 证书，这里可以合并
    if [ -f "$CERTS_DIR/ca.crt" ]; then
        cat "$CERTS_DIR/$domain.crt" "$CERTS_DIR/ca.crt" > "$CERTS_DIR/$domain-fullchain.crt"
        log_pass "证书链已生成: $domain-fullchain.crt"
    fi
}

# 验证证书
verify_certificates() {
    local domain="$1"
    log_info "验证证书..."
    
    local cert_path="$CERTS_DIR/$domain.crt"
    local key_path="$CERTS_DIR/$domain.key"
    
    if openssl x509 -in "$cert_path" -text -noout; then
        log_pass "证书验证通过"
    else
        log_fail "证书验证失败"
        return 1
    fi
    
    # 验证私钥和证书匹配
    local cert_mod=$(openssl x509 -noout -modulus -in "$cert_path" | openssl md5)
    local key_mod=$(openssl rsa -noout -modulus -in "$key_path" | openssl md5)
    
    if [ "$cert_mod" = "$key_mod" ]; then
        log_pass "私钥和证书匹配"
    else
        log_fail "私钥和证书不匹配"
        return 1
    fi
}

# 主函数
main() {
    local domain="${1:-api.yourcompany.com}"
    
    log_info "开始生成 SSL 证书..."
    log_info "域名: $domain"
    
    # 生成自签名证书
    generate_self_signed "$domain"
    
    # 生成配置
    generate_cert_config "$domain"
    
    # 验证证书
    verify_certificates "$domain"
    
    log_pass "SSL 证书生成完成！"
    log_info "证书目录: $CERTS_DIR"
}

# 帮助菜单
show_help() {
    echo "SSL/TLS 证书生成脚本"
    echo ""
    echo "用法: $0 [域名]"
    echo ""
    echo "示例:"
    echo "  $0 api.yourcompany.com"
    echo "  $0 yourdomain.com"
    echo ""
}

# 检查参数
if [ "${1:-}" = "help" ] || [ "${1:-}" = "--help" ]; then
    show_help
    exit 0
fi

main "$@"
