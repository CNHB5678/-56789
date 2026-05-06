# 企业级 API 中转站（API 网关代理平台）

基于 Apache APISIX 的生产级 API 网关代理平台，支持 99.99% SLA、30万+ QPS、多租户隔离。

## 📋 方案特性

### 核心能力
- **数据面/控制面分离**：控制面故障不影响流量转发
- **全协议支持**：HTTP/HTTPS、gRPC、WebSocket、Dubbo、MQTT
- **多租户隔离**：租户级配置、资源、数据隔离
- **高可用性**：同城双活、异地容灾、自动故障恢复
- **企业级安全**：等保2.0三级、国密算法、全链路审计

### 性能指标
- 单实例 QPS ≥30万
- P99 延迟 <300μs
- 可用性 SLA：数据面 99.99%，控制面 99.95%

## 📁 项目结构

```
.
├── helm/                  # Helm Charts（K8s 部署）
│   ├── apisix/           # APISIX 数据面 + 控制面
│   ├── redis/            # Redis Cluster
│   ├── postgresql/       # PostgreSQL 高可用
│   ├── nacos/            # Nacos 配置中心
│   └── observability/    # Prometheus + Grafana + Loki + SkyWalking
├── docker/               # Docker Compose 本地开发
├── config/               # 配置文件
│   ├── apisix/          # APISIX 配置与插件
│   └── scripts/         # 运维脚本
├── monitoring/           # 监控大盘模板
│   └── grafana/         # Grafana Dashboards
└── docs/                 # 文档
```

## 🚀 快速开始

### 方式一：Docker Compose（本地开发）

```bash
cd docker
docker-compose up -d
```

### 方式二：Helm（K8s 部署）

```bash
# 添加 Helm 仓库
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# 部署依赖组件
helm install redis ./helm/redis -n api-gateway --create-namespace
helm install postgresql ./helm/postgresql -n api-gateway
helm install nacos ./helm/nacos -n api-gateway

# 部署 APISIX
helm install apisix ./helm/apisix -n api-gateway

# 部署可观测性栈
helm install observability ./helm/observability -n api-gateway
```

## 📊 核心架构

```
【用户流量】→ 高防IP → SLB → 数据面(APISIX) → 上游API
                              ↓
                        控制面 + 依赖组件(Redis/PG/Nacos)
                              ↓
                        可观测性平台(Prometheus/Grafana/Loki/SkyWalking)
```

## 📖 文档

- [部署指南](docs/deployment.md)
- [架构设计](docs/architecture.md)
- [运维手册](docs/operations.md)
- [API 文档](docs/api.md)

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 许可证

MIT License
