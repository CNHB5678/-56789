#!/bin/bash
# 性能压测运行脚本

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT_DIR="$SCRIPT_DIR/../benchmark-reports"
mkdir -p "$REPORT_DIR"

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

# 默认配置
API_GATEWAY_URL="${API_GATEWAY_URL:-http://localhost:9080}"
DURATION="${DURATION:-10m}"
VUS="${VUS:-100}"
REPORT_FORMAT="${REPORT_FORMAT:-json}"

# 检查 k6 安装
check_k6() {
    if ! command -v k6 &>/dev/null; then
        log_warn "k6 未安装，尝试使用 Docker 运行"
        if command -v docker &>/dev/null; then
            log_info "使用 Docker 运行 k6"
            return 1
        else
            log_fail "需要安装 k6 或 Docker"
            log_info "k6 安装方法: https://k6.io/docs/getting-started/installation/"
            exit 1
        fi
    fi
    return 0
}

# 运行基准测试
run_benchmark() {
    local test_name="$1"
    local test_file="$2"
    local report_file="$REPORT_DIR/${test_name}-$(date +%Y%m%d-%H%M%S).${REPORT_FORMAT}"
    
    log_info "开始测试: $test_name"
    log_info "目标: $API_GATEWAY_URL"
    log_info "报告文件: $report_file"
    
    if check_k6; then
        # 本地 k6
        k6 run --out "$REPORT_FORMAT=$report_file" "$test_file"
    else
        # Docker k6
        docker run --rm -i \
            -v "$SCRIPT_DIR:/tests" \
            -v "$REPORT_DIR:/reports" \
            -e "API_GATEWAY_URL=$API_GATEWAY_URL" \
            grafana/k6 run --out "$REPORT_FORMAT=/reports/$(basename "$report_file")" /tests/$(basename "$test_file")
    fi
    
    log_pass "测试完成: $test_name"
}

# 快速冒烟测试
run_smoke() {
    log_info "运行冒烟测试 (Smoke Test)..."
    run_benchmark "smoke" "$SCRIPT_DIR/smoke-test.js"
}

# 负载测试
run_load() {
    log_info "运行负载测试 (Load Test)..."
    run_benchmark "load" "$SCRIPT_DIR/load-test.js"
}

# 压力测试
run_stress() {
    log_info "运行压力测试 (Stress Test)..."
    run_benchmark "stress" "$SCRIPT_DIR/stress-test.js"
}

# 浸泡测试
run_soak() {
    log_info "运行浸泡测试 (Soak Test)..."
    run_benchmark "soak" "$SCRIPT_DIR/soak-test.js"
}

# 完整测试套件
run_full() {
    log_info "运行完整测试套件..."
    
    run_smoke
    sleep 30
    
    run_load
    sleep 60
    
    run_stress
    sleep 60
    
    log_pass "完整测试套件执行完成"
}

# 生成性能报告
generate_report() {
    log_info "生成性能报告..."
    
    local report_file="$REPORT_DIR/performance-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" <<EOF
# API 网关性能测试报告

## 测试概述

- **测试时间**: $(date '+%Y-%m-%d %H:%M:%S')
- **测试环境**: $API_GATEWAY_URL
- **测试持续时间**: $DURATION
- **虚拟用户数**: $VUS

## 性能基准

| 指标 | 目标值 | 实际值 | 状态 |
|------|--------|--------|------|
| 单实例 QPS | ≥ 30,000 | - | ⏳ |
| P50 延迟 | < 100ms | - | ⏳ |
| P95 延迟 | < 500ms | - | ⏳ |
| P99 延迟 | < 1000ms | - | ⏳ |
| 错误率 | < 0.1% | - | ⏳ |
| 可用性 | > 99.99% | - | ⏳ |

## 测试详情

### 1. 冒烟测试 (Smoke Test)

验证基本功能是否正常工作。

### 2. 负载测试 (Load Test)

模拟正常生产负载。

### 3. 压力测试 (Stress Test)

测试系统极限。

### 4. 浸泡测试 (Soak Test)

长时间运行测试稳定性。

## 结论

待添加...

---

*报告生成时间: $(date '+%Y-%m-%d %H:%M:%S')*
EOF
    
    log_pass "性能报告已生成: $report_file"
}

# 主函数
main() {
    local command="${1:-help}"
    
    case "$command" in
        smoke)
            run_smoke
            ;;
        load)
            run_load
            ;;
        stress)
            run_stress
            ;;
        soak)
            run_soak
            ;;
        full)
            run_full
            ;;
        report)
            generate_report
            ;;
        help)
            echo "API 网关性能测试工具"
            echo ""
            echo "用法: $0 [命令]"
            echo ""
            echo "命令:"
            echo "  smoke   冒烟测试"
            echo "  load    负载测试"
            echo "  stress  压力测试"
            echo "  soak    浸泡测试"
            echo "  full    完整测试套件"
            echo "  report  生成报告"
            echo "  help    显示帮助"
            echo ""
            echo "环境变量:"
            echo "  API_GATEWAY_URL  API 网关地址"
            echo "  DURATION         测试持续时间"
            echo "  VUS              虚拟用户数"
            echo "  REPORT_FORMAT    报告格式 (json/csv)"
            echo ""
            ;;
        *)
            log_fail "未知命令: $command"
            main help
            exit 1
            ;;
    esac
}

main "$@"
