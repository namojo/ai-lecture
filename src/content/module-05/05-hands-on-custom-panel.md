# 실습: 커스텀 메트릭 패널

## 학습 목표

- 기존 대시보드에 새로운 메트릭 패널을 추가할 수 있다
- AI 도구를 활용해 기존 패턴을 확장하는 방법을 체험한다
- 시뮬레이터에 새 메트릭을 추가하는 전체 과정을 이해한다

## 실습 과제

대시보드에 **응답 시간(Response Time)** 메트릭 패널을 추가합니다.

## Step 1: 타입 확장

```typescript
// types/metrics.ts에 추가
type MetricName = "cpu" | "memory" | "disk" | "network" | "responseTime";
```

Claude Code에 요청:

```bash
claude "types/metrics.ts의 MetricName에 'responseTime'을 추가하고,
metricsSimulator.ts에 응답시간 시뮬레이션을 추가해줘.
기본 50ms, 간헐적 스파이크 200-500ms, 가끔 타임아웃 1000ms+.
단위는 'ms'로 설정."
```

## Step 2: 시뮬레이터 확장

응답 시간 패턴 생성 로직:

```typescript
case "responseTime": {
  value = 50; // 기본 50ms
  // 랜덤 변동
  value += rng.range(-10, 20);
  // 간헐적 느린 응답 (10% 확률)
  if (rng.next() < 0.1) value += rng.range(100, 400);
  // 가끔 타임아웃 (1% 확률)
  if (rng.next() < 0.01) value = rng.range(1000, 3000);
  break;
}
```

> [!TIP] 기존 패턴 따라하기
> AI에게 "기존 CPU 패턴과 같은 구조로"라고 지시하면, 기존 코드 스타일에 맞는 일관된 구현을 받을 수 있습니다.

## Step 3: 임계값 설정

```typescript
const THRESHOLDS = {
  // ... 기존 메트릭
  responseTime: { warning: 200, critical: 500 },
};
```

| 범위 | 상태 | 의미 |
|------|------|------|
| < 200ms | 정상 (초록) | 양호한 응답 |
| 200-500ms | 경고 (노랑) | 느린 응답 |
| > 500ms | 위험 (빨강) | 타임아웃 위험 |

## Step 4: UI 컴포넌트 연결

MetricCard와 TimeSeriesChart에 새 메트릭이 자동으로 표시되도록 합니다:

```typescript
// Dashboard.tsx의 METRIC_NAMES 배열에 추가
const METRIC_NAMES: MetricName[] = [
  "cpu", "memory", "disk", "network", "responseTime"
];
```

> [!WARNING] 그리드 레이아웃 조정
> 5개 메트릭 카드는 `grid-cols-4`에 맞지 않습니다. `grid-cols-5`로 변경하거나, 2행으로 나누는 레이아웃 조정이 필요합니다.

## Step 5: 단위 처리

응답 시간은 `%`가 아니라 `ms`를 사용합니다:

```typescript
// MetricCard에서 단위 분기
const unit = name === "responseTime" ? "ms" : "%";
const displayValue = name === "responseTime"
  ? value.toFixed(0)
  : value.toFixed(1);
```

## 실습 평가 기준

- [ ] 응답 시간 메트릭 카드가 정상 표시되는가?
- [ ] 스파크라인이 추이를 정확히 보여주는가?
- [ ] 시계열 차트에 경고/위험 기준선이 표시되는가?
- [ ] 500ms 초과 시 빨간색 알림이 생성되는가?
- [ ] 기존 4개 메트릭에 영향이 없는가?

> [!INFO] 확장 용이성
> 이 실습을 통해 알 수 있듯이, 잘 설계된 구조에서는 새 메트릭 추가가 타입 확장 → 시뮬레이터 추가 → UI 배열 추가 3단계로 끝납니다.

## 요약

- 기존 타입과 시뮬레이터를 확장하여 새 메트릭 추가
- AI에게 "기존 패턴과 같은 구조로"라고 지시하면 일관된 코드 생성
- 임계값, 단위, 레이아웃 등 세부 조정 필요
