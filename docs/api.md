# API 文档

## REST API

### 认证方式

#### API Key 认证
```bash
curl 'http://apisix-gateway/apisix/admin/routes' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1'
```

#### JWT 认证
```bash
# 创建消费者和 JWT secret
curl -X PUT 'http://apisix-gateway/apisix/admin/consumers/john' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \
-H 'Content-Type: application/json' \
-d '{
    "username": "john"
}'

curl -X PUT 'http://apisix-gateway/apisix/admin/consumers/john/jwt-auth' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \
-H 'Content-Type: application/json' \
-d '{
    "key": "user-key",
    "secret": "my-jwt-secret"
}'

# 使用 Token 访问
curl 'http://apisix-gateway/api/secure' \
-H 'Authorization: Bearer <jwt-token>'
```

### 路由管理

#### 创建路由
```bash
curl -X PUT 'http://apisix-gateway/apisix/admin/routes/1' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \
-H 'Content-Type: application/json' \
-d '{
    "uri": "/api/*",
    "upstream": {
        "type": "roundrobin",
        "nodes": {
            "backend-service:80": 100
        }
    }
}'
```

#### 获取路由
```bash
curl 'http://apisix-gateway/apisix/admin/routes/1' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1'
```

#### 列出所有路由
```bash
curl 'http://apisix-gateway/apisix/admin/routes' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1'
```

#### 删除路由
```bash
curl -X DELETE 'http://apisix-gateway/apisix/admin/routes/1' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1'
```

### 上游服务管理

#### 创建上游
```bash
curl -X PUT 'http://apisix-gateway/apisix/admin/upstreams/1' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \
-H 'Content-Type: application/json' \
-d '{
    "type": "roundrobin",
    "nodes": {
        "node1:80": 30,
        "node2:80": 70
    },
    "timeout": {
        "connect": 5,
        "send": 10,
        "read": 10
    },
    "keepalive_pool": {
        "size": 320,
        "idle_timeout": 60,
        "requests": 100
    }
}'
```

#### 健康检查配置
```bash
curl -X PUT 'http://apisix-gateway/apisix/admin/upstreams/1' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \
-H 'Content-Type: application/json' \
-d '{
    "type": "roundrobin",
    "nodes": {
        "node1:80": 100
    },
    "checks": {
        "active": {
            "type": "http",
            "http_path": "/health",
            "host": "example.com",
            "timeout": 3,
            "concurrency": 10,
            "healthy": {
                "interval": 10,
                "http_statuses": [200, 201, 204],
                "successes": 2
            },
            "unhealthy": {
                "interval": 5,
                "http_statuses": [429, 500, 502, 503, 504],
                "timeouts": 3,
                "http_failures": 3
            }
        },
        "passive": {
            "type": "http",
            "healthy": {
                "http_statuses": [200, 201, 204, 206, 301, 302, 304, 307, 308],
                "successes": 5
            },
            "unhealthy": {
                "http_statuses": [429, 500, 502, 503, 504],
                "timeouts": 3,
                "http_failures": 3
            }
        }
    }
}'
```

### 插件管理

#### 启用限流插件
```bash
curl -X PATCH 'http://apisix-gateway/apisix/admin/routes/1' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \
-H 'Content-Type: application/json' \
-d '{
    "plugins": {
        "limit-req": {
            "rate": 100,
            "burst": 50,
            "key_type": "var",
            "key": "remote_addr",
            "rejected_code": 429,
            "rejected_msg": "Too Many Requests"
        }
    }
}'
```

#### 启用 Prometheus 监控
```bash
curl -X PUT 'http://apisix-gateway/apisix/admin/global_rules/1' \
-H 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \
-H 'Content-Type: application/json' \
-d '{
    "plugins": {
        "prometheus": {
            "export_addr": {
                "ip": "0.0.0.0",
                "port": 9091
            },
            "export_uri": "/apisix/prometheus/metrics",
            "metrics": [
                {
                    "name": "apisix_http_status",
                    "stat_labels": ["code"]
                },
                {
                    "name": "apisix_http_latency",
                    "stat_labels": ["type"]
                }
            ]
        }
    }
}'
```

## 指标 API

### Prometheus 指标
```bash
# 访问指标端点
curl 'http://apisix-gateway:9091/apisix/prometheus/metrics'
```

### 关键指标
- `apisix_http_status`: HTTP 状态码分布
- `apisix_http_latency`: 请求延迟分布
- `apisix_bandwidth`: 带宽使用量
- `apisix_http_requests_total`: 请求总数
- `apisix_upstream_status`: 上游状态
- `apisix_node_info`: 节点信息

## 常见场景

### 场景 1: 网站 API 网关
- 所有 /api/* 路径通过网关转发
- 限流：100 QPS/IP
- JWT 认证
- 请求 ID 追踪

### 场景 2: 微服务网关
- 路径重写
- 服务发现集成
- 熔断器
- 重试机制

### 场景 3: 多租户 SaaS
- 租户级隔离
- 独立的限流策略
- 独立的监控和计费
