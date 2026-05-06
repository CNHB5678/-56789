# 部署指南

## 前置条件

### Docker Compose 部署
- Docker 20.10+
- Docker Compose 2.0+
- 至少 8 CPU 和 16GB 内存

### Kubernetes 部署
- Kubernetes 1.24+
- Helm 3.8+
- 至少 3 个工作节点
- 支持持久化存储

## Docker Compose 部署

### 1. 克隆仓库
```bash
git clone <repo-url>
cd api-gateway
```

### 2. 启动服务
```bash
./scripts/deploy.sh docker
```

### 3. 验证部署
```bash
cd docker
docker-compose ps
```

### 4. 访问服务
- APISIX Dashboard: http://localhost:9000
- Grafana: http://localhost:3000
- SkyWalking UI: http://localhost:8080

### 5. 配置首个路由
```bash
curl -X PUT 'http://localhost:9080/apisix/admin/routes/1' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \
-H 'Content-Type: application/json' \
-d '{
    "uri": "/hello",
    "upstream": {
        "type": "roundrobin",
        "nodes": {
            "httpbin.org:80": 1
        }
    }
}'
```

## Kubernetes 部署

### 1. 准备环境
```bash
# 创建命名空间
kubectl create namespace api-gateway
```

### 2. 部署依赖组件
```bash
# 部署 Redis
helm install redis ./helm/redis -n api-gateway

# 部署 PostgreSQL
helm install postgresql ./helm/postgresql -n api-gateway

# 部署 Nacos
helm install nacos ./helm/nacos -n api-gateway
```

### 3. 部署 APISIX
```bash
helm install apisix ./helm/apisix -n api-gateway
```

### 4. 部署可观测性栈
```bash
helm install observability ./helm/observability -n api-gateway
```

### 5. 验证部署
```bash
# 检查所有 Pod 状态
kubectl get pods -n api-gateway

# 检查服务状态
kubectl get svc -n api-gateway

# 检查事件
kubectl get events -n api-gateway
```

### 6. 配置访问
```bash
# 获取 APISIX 地址
kubectl get svc apisix-gateway -n api-gateway

# 访问 Dashboard
kubectl port-forward svc/apisix-dashboard -n api-gateway 9000:80
```

## 运维管理

### 健康检查
```bash
# 检查 Docker Compose 服务
./scripts/health-check.sh docker

# 检查 Kubernetes 服务
./scripts/health-check.sh k8s
```

### 备份
```bash
# 备份 Docker 数据
./scripts/backup.sh

# 备份 Kubernetes 资源
./scripts/backup.sh k8s
```

### 监控告警
1. 访问 Grafana http://localhost:3000
2. 配置告警通道（邮件、Slack、Webhook）
3. 导入 Dashboard 模板（monitoring/grafana/ 目录）

## 安全配置

### 1. 修改默认密码
- APISIX admin key
- Grafana 管理员密码
- PostgreSQL 密码
- Nacos 密码

### 2. 配置 HTTPS
```yaml
apisix:
  ssl:
    enable: true
    cert: /path/to/cert.pem
    key: /path/to/key.pem
```

### 3. 配置 IP 白名单
```yaml
apisix:
  allow_admin:
    - 10.0.0.0/8
    - 172.16.0.0/12
```

## 扩容缩容

### Docker Compose
```bash
cd docker
docker-compose up -d --scale apisix=5
```

### Kubernetes
```bash
# 扩容 APISIX
kubectl scale deployment apisix -n api-gateway --replicas=5

# 或使用 HPA 自动扩缩容
kubectl autoscale deployment apisix -n api-gateway \
  --min=3 \
  --max=20 \
  --cpu-percent=70
```

## 故障排查

### 常见问题
1. Pod 无法启动：检查资源限制和持久化存储
2. 配置无法同步：检查 Nacos 和网络连接
3. 性能问题：检查资源使用和插件配置

### 日志查看
```bash
# 查看 APISIX 日志
kubectl logs -f deployment/apisix -n api-gateway

# 查看 Dashboard 日志
kubectl logs -f deployment/apisix-dashboard -n api-gateway
```

## 生产检查清单

- [ ] 资源限制已配置
- [ ] 持久化存储已配置
- [ ] 监控告警已设置
- [ ] 备份策略已实施
- [ ] 安全加固已完成
- [ ] 文档已更新
- [ ] 测试已通过
