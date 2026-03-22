# 이상 탐지 알고리즘

## 학습 목표

- 통계 기반 이상 탐지 기법을 이해하고 구현할 수 있다
- 로그 데이터에서 의미 있는 패턴을 추출하는 방법을 익힌다
- AI가 생성한 알고리즘을 검증하고 개선하는 과정을 체험한다

## 이상 탐지 3가지 전략

로그 분석기에서 사용하는 이상 탐지 전략:

| 전략 | 대상 | 방법 | 임계값 |
|------|------|------|--------|
| 에러 급증(Spike) | 분 단위 에러 수 | 평균 + 2σ | 통계적 |
| 반복 패턴 | 에러 메시지 내용 | 정규화 후 카운팅 | 3회 이상 |
| 시간 공백 | 로그 타임스탬프 | 연속 간격 계산 | 2분 이상 |

## 전략 1: 에러 급증 탐지

분 단위로 에러를 그룹핑하고, 통계적으로 비정상적인 구간을 찾습니다:

```typescript
function detectSpikes(entries: LogEntry[]): Anomaly[] {
  // 1. 분 단위 에러 그룹핑
  const errorsByMinute = new Map<string, LogEntry[]>();
  for (const e of entries) {
    if (e.severity === "ERROR" || e.severity === "FATAL") {
      const key = `${e.timestamp.getHours()}:${String(e.timestamp.getMinutes()).padStart(2, "0")}`;
      if (!errorsByMinute.has(key)) errorsByMinute.set(key, []);
      errorsByMinute.get(key)!.push(e);
    }
  }

  // 2. 평균과 표준편차 계산
  const counts = [...errorsByMinute.values()].map(v => v.length);
  const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
  const stddev = Math.sqrt(
    counts.reduce((sum, c) => sum + (c - avg) ** 2, 0) / counts.length
  );

  // 3. 임계값 초과 구간 = 이상
  const threshold = avg + 2 * stddev;
  // ... spike 생성
}
```

> [!TIP] 2-시그마 규칙
> 정규분포에서 평균 ± 2σ 범위에 약 95%의 데이터가 포함됩니다. 이 범위를 벗어나면 통계적으로 "비정상"으로 판단합니다.

## 전략 2: 반복 패턴 감지

같은 에러가 반복적으로 발생하면 시스템적 문제를 나타냅니다:

```typescript
function detectRepeatedPatterns(entries: LogEntry[]): Anomaly[] {
  const errorMessages = new Map<string, LogEntry[]>();

  for (const e of entries) {
    if (e.severity === "ERROR" || e.severity === "FATAL") {
      // 숫자와 ID를 정규화하여 패턴 추출
      const normalized = e.message
        .replace(/\d+/g, "N")
        .replace(/#\w+/g, "#ID");
      if (!errorMessages.has(normalized)) errorMessages.set(normalized, []);
      errorMessages.get(normalized)!.push(e);
    }
  }

  // 3회 이상 반복된 패턴만 이상으로 판정
  return [...errorMessages.entries()]
    .filter(([_, errs]) => errs.length >= 3)
    .map(([pattern, errs]) => ({
      type: "repeated_pattern",
      severity: errs.length >= 5 ? "high" : "medium",
      // ...
    }));
}
```

> [!WARNING] 정규화의 한계
> 단순 숫자 치환은 완벽하지 않습니다. "Connection to port 5432 failed"와 "Connection to port 6379 failed"가 같은 패턴으로 묶일 수 있습니다. 실전에서는 Levenshtein 거리 기반 클러스터링을 고려하세요.

## 전략 3: 시간 공백 탐지

로그가 갑자기 멈추면 서비스 중단을 의심합니다:

```typescript
function detectTimeGaps(entries: LogEntry[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  for (let i = 1; i < entries.length; i++) {
    const gap = entries[i].timestamp.getTime()
              - entries[i - 1].timestamp.getTime();

    if (gap > 2 * 60 * 1000) { // 2분 이상 공백
      anomalies.push({
        type: "time_gap",
        severity: gap > 5 * 60 * 1000 ? "high" : "low",
        description: `${Math.round(gap / 1000)}초간 로그 공백`,
        // ...
      });
    }
  }

  return anomalies;
}
```

## 심각도 분류 기준

| 등급 | 조건 | 대응 |
|------|------|------|
| critical | 에러 급증이 3σ 초과 | 즉시 확인 필요 |
| high | 에러 급증 2σ 초과 또는 5회+ 반복 | 빠른 확인 권장 |
| medium | 3~4회 반복 에러 | 모니터링 |
| low | 2분~5분 로그 공백 | 참고 사항 |

> [!INFO] 실전 확장
> 실제 운영 환경에서는 시계열 데이터베이스(InfluxDB, Prometheus)와 연동하여 더 정교한 이상 탐지(이동 평균, EWMA 등)를 적용합니다.

## 요약

- 에러 급증: 통계적 2-시그마 기반 탐지
- 반복 패턴: 메시지 정규화 후 카운팅
- 시간 공백: 연속 타임스탬프 간격 계산
- 심각도는 4단계로 분류하여 대응 우선순위 제공
