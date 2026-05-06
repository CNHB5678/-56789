# 运维手册

## 日常运维

### 健康检查
```bash
# 脚本检查
./scripts/health-check.sh docker

# 手动检查
curl -f http://localhost:9091/healthz  # APISIX 健康
curl -f http://localhost:9000/healthz  # Dashboard 健康
curl -f http://localhost:3000/api/health  # Grafana 健康
```

### 日志查看
```bash
# Docker Compose
cd docker
docker-compose logs -f apisix
docker-compose logs -f apisix-dashboard

# Kubernetes
kubectl logs -f deployment/apisix -n api-gateway
kubectl logs -f deployment/apisix-dashboard -n api-gateway
```

### 配置更新
```bash
# 修改配置后，平滑重启
docker-compose up -d --force-recreate apisix

# Kubernetes 滚动更新
kubectl set image deployment/apisix \
  apisix=apache/apisix:3.9.0-debian \
  -n api-gateway
```

## 性能调优

### 1. 监控性能指标
- CPU 使用率 < 70%
- 内存使用率 < 80%
- P99 延迟 < 300ms
- 错误率 < 0.1%

### 2. 调整配置
```yaml
nginx_config:
  worker_processes: auto
  worker_connections: 20480
  enable_cpu_affinity: true
```

### 3. 插件优化
- 减少不必要的插件
- 配置合理的限流策略
- 启用缓存机制

## 故障处理

### 问题 1: 服务不可用
```bash
# 检查服务状态
cd docker
docker-compose ps

# 查看错误日志
docker-compose logs apisix --tail=100

# 重启服务
docker-compose restart apisix
```

### 问题 2: 配置同步失败
```bash
# 检查 Nacos
curl -f http://nacos-0:8848/nacos/v1/console/health/readiness

# 检查网络连接
kubectl exec -n api-gateway deployment/apisix -- ping nacos-0
```

### 问题 3: 性能下降
```bash
# 检查资源使用
docker stats
kubectl top pod -n api-gateway

# 查看慢查询
grep "request_time" access.log | awk '$NF > 1'

# 分析热点
tail -f access.log | awk '{print $7}' | sort | uniq -c | sort -rn
```

## 容量规划

### 计算资源需求
```
单个 APISIX 实例:
- CPU: 2-4 cores
- 内存: 4-8 GB
- 磁盘: 10-20 GB

集群容量 (N 个实例):
- QPS: N * 30万
- 最大连接: N * 10万
```

### 扩容步骤
1. 监控容量指标（CPU、内存、连接数）
2. 预测容量需求
3. 制定扩容计划
4. 执行扩容操作
5. 验证扩容效果

## 安全审计

### 1. 访问日志审计
```bash
# 异常 IP
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head

# 异常状态码
awk '{print $9}' access.log | sort | uniq -c

# 敏感路径访问
grep -E "/admin|/secret|/password" access.log
```

### 2. 配置审计
- 定期检查安全配置
- 验证 SSL 证书有效期
- 检查访问控制规则

### 3. 漏洞扫描
```bash
# 扫描依赖漏洞
trivy image apache/apisix:3.9.0-debian

# 扫描配置
gitleaks --repo-path . --report-path security-report.json
```

## 备份和恢复

### 1. 定期备份
```bash
# 配置备份
./scripts/backup.sh

# 自动化备份（Cron）
0 2 * * * /path/to/scripts/backup.sh
```

### 2. 恢复步骤
```bash
# 1. 停止服务
docker-compose down

# 2. 清理数据
docker-compose down -v

# 3. 解压备份
tar -zxf backup-file.tar.gz

# 4. 恢复数据
# 按备份步骤反向操作

# 5. 启动服务
docker-compose up -d
```

## 变更管理

### 变更流程
1. 制定变更计划
2. 编写回滚方案
3. 在测试环境验证
4. 准备环境
5. 执行变更
6. 验证效果
7. 文档更新

### 回滚步骤
```bash
# Docker Compose 回滚
docker-compose up -d --force-recreate --scale apisix=3 apisix

# Kubernetes 回滚
kubectl rollout undo deployment/apisix -n api-gateway
```

## 应急处理

### 应急预案
| 故障级别 | 响应时间 | 处理方式 |
|---------|---------|---------|
| P0 严重故障 | < 15min | 电话通知，立即处理 |
| P1 重要故障 | < 1h | 值班人员处理 |
| P2 一般告警 | < 4h | 工作日处理 |

### 紧急电话簿
- 运维负责人: xxx-xxxx-xxxx
- 开发负责人: xxx-xxxx-xxxx
- 供应商支持: xxx-xxxx-xxxx

### 紧急操作手册
1. 确认故障影响范围
2. 记录故障时间和现象
3. 收集相关信息（日志、监控、配置）
4. 执行紧急处置（回滚、扩容、限流）
5. 通知相关人员
6. 持续监控
7. 撰写故障报告

## 文档更新

- [ ] 每次变更后更新文档
- [ ] 保留历史版本
- [ ] 定期审查文档准确性
