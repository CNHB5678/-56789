// 企业级 API 网关性能压测脚本
// 使用 k6 进行性能测试

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// 自定义指标
const errorRate = new Rate('errors');
const responseTimeP50 = new Trend('http_req_duration_p50');
const responseTimeP90 = new Trend('http_req_duration_p90');
const responseTimeP99 = new Trend('http_req_duration_p99');

// 测试配置
const BASE_URL = __ENV.API_GATEWAY_URL || 'http://localhost:9080';

// 测试用例
const testCases = new SharedArray('test cases', function () {
  return [
    {
      name: 'simple_api',
      endpoint: '/api/v1/test',
      method: 'GET',
      weight: 40
    },
    {
      name: 'heavy_api',
      endpoint: '/api/v1/data',
      method: 'GET',
      weight: 30
    },
    {
      name: 'create_api',
      endpoint: '/api/v1/resources',
      method: 'POST',
      weight: 20,
      data: JSON.stringify({ name: 'test', value: 123 })
    },
    {
      name: 'update_api',
      endpoint: '/api/v1/resources/1',
      method: 'PUT',
      weight: 10,
      data: JSON.stringify({ name: 'test', value: 456 })
    }
  ];
});

// 测试阶段配置
export const options = {
  stages: [
    // 1. 预热阶段
    { duration: '1m', target: 100 },
    // 2. 逐步增加负载
    { duration: '2m', target: 500 },
    // 3. 峰值负载
    { duration: '5m', target: 10000 },
    // 4. 稳定负载
    { duration: '5m', target: 5000 },
    // 5. 逐步降低
    { duration: '2m', target: 100 },
    // 6. 冷却
    { duration: '1m', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.05']
  }
};

// 请求头部
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'User-Agent': 'k6-load-tester',
    'X-Request-ID': `req-${__VU}-${__ITER}`
  };
}

// 选择测试用例
function selectTestCase() {
  const totalWeight = testCases.reduce((sum, tc) => sum + tc.weight, 0);
  let random = Math.random() * totalWeight;
  for (const tc of testCases) {
    if (random < tc.weight) {
      return tc;
    }
    random -= tc.weight;
  }
  return testCases[0];
}

// 主测试函数
export default function () {
  const testCase = selectTestCase();
  let res;
  
  // 发送请求
  if (testCase.method === 'GET' || testCase.method === 'DELETE') {
    res = http.get(`${BASE_URL}${testCase.endpoint}`, {
      headers: getHeaders()
    });
  } else if (testCase.method === 'POST' || testCase.method === 'PUT') {
    res = http.request(
      testCase.method,
      `${BASE_URL}${testCase.endpoint}`,
      testCase.data,
      { headers: getHeaders() }
    );
  }
  
  // 检查响应
  const isOK = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'response has data': (r) => r.body && r.body.length > 0
  });
  
  // 更新错误率
  errorRate.add(!isOK);
  
  // 记录自定义指标
  const duration = res.timings.duration;
  responseTimeP50.add(duration);
  responseTimeP90.add(duration);
  responseTimeP99.add(duration);
  
  // 在请求之间添加轻微延迟，更接近真实场景
  sleep(Math.random() * 0.5);
}

// 测试设置
export function setup() {
  console.log(`开始性能测试: ${BASE_URL}`);
  console.log(`目标 RPS: ${options.stages[2].target}`);
  return { startTime: new Date().toISOString() };
}

// 测试总结
export function teardown(data) {
  const endTime = new Date().toISOString();
  console.log(`测试完成: ${data.startTime} 至 ${endTime}`);
}
