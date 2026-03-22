# 리포트 생성과 시각화

## 학습 목표

- Recharts 라이브러리로 로그 분석 결과를 시각화할 수 있다
- 탭 기반 UI로 다양한 관점의 분석 결과를 제공하는 방법을 익힌다
- 가상 스크롤로 대용량 데이터를 효율적으로 렌더링할 수 있다

## 분석 결과 UI 구조

로그 분석기의 결과 화면은 3개 탭으로 구성됩니다:

| 탭 | 내용 | 주요 컴포넌트 |
|----|------|-------------|
| 요약 | 레벨별 통계 + 이상 징후 리포트 | 통계 카드, AnomalyReport |
| 타임라인 | 시간대별 에러 빈도 차트 | Recharts AreaChart |
| 원본 로그 | 전체 로그 뷰어 (검색/필터) | 가상 스크롤 LogViewer |

## 통계 카드 구현

4개의 심각도별 카드로 전체 현황을 한눈에 보여줍니다:

```typescript
const summary = {
  total: entries.length,
  byLevel: { INFO: 45, WARN: 12, ERROR: 8, FATAL: 2 },
  topErrors: [
    { message: "Database connection timeout", count: 3 },
    { message: "Redis connection lost", count: 2 },
  ],
};
```

> [!TIP] 색상 코딩
> INFO(파란색), WARN(노란색), ERROR(빨간색), FATAL(진한 빨간색)으로 직관적으로 구분합니다. 색상만으로도 시스템 상태를 즉시 파악할 수 있어야 합니다.

## Recharts로 타임라인 차트

에러 발생 빈도를 시간축으로 시각화합니다:

```tsx
<AreaChart data={errorRate}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="minute" />
  <YAxis allowDecimals={false} />
  <Tooltip />
  <Area
    type="monotone"
    dataKey="count"
    stroke="#EF4444"
    fill="url(#errorGradient)"
  />
</AreaChart>
```

> [!INFO] 그라데이션 효과
> `linearGradient`를 사용하면 차트 영역에 자연스러운 그라데이션을 적용할 수 있어 시각적 완성도가 높아집니다.

## 가상 스크롤 (Virtual Scrolling)

1만 줄 이상의 로그를 DOM에 모두 렌더링하면 브라우저가 멈춥니다. 화면에 보이는 영역만 렌더링하는 가상 스크롤을 구현합니다:

```typescript
const ITEM_HEIGHT = 28; // 각 로그 라인 높이
const BUFFER_ITEMS = 20; // 위아래 버퍼

// 현재 보이는 영역 계산
const startIdx = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_ITEMS);
const endIdx = Math.min(
  items.length,
  Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER_ITEMS
);

// startIdx ~ endIdx만 렌더링
const visibleItems = items.slice(startIdx, endIdx);
```

> [!WARNING] ResizeObserver 필요
> 컨테이너 높이가 변할 수 있으므로 `ResizeObserver`로 높이를 감시해야 합니다. 고정 높이를 하드코딩하면 반응형 디자인에서 문제가 됩니다.

## 이상 징후 강조 표시

원본 로그 탭에서 이상 라인을 시각적으로 강조합니다:

```tsx
<div className={cn(
  "flex items-center h-7",
  anomalyLines.has(entry.lineNumber) && "border-l-3 border-red-500 bg-red-500/5"
)}>
  <span className="text-muted">{entry.lineNumber}</span>
  <span className={severityColors[entry.severity]}>{entry.severity}</span>
  <span>{entry.message}</span>
</div>
```

## 요약

- 3-탭 UI로 요약/타임라인/원본 로그 제공
- Recharts AreaChart로 시간대별 에러 빈도 시각화
- 가상 스크롤로 1만줄+ 로그 렌더링 성능 확보
- 이상 라인은 빨간 왼쪽 테두리로 강조
