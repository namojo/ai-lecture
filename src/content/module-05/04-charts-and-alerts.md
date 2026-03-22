# 차트와 알림 시스템

## 학습 목표

- Recharts로 실시간 시계열 차트를 구현할 수 있다
- 임계값 기준선(ReferenceLine)을 차트에 표시할 수 있다
- 알림 패널의 생성/해제 UX를 설계할 수 있다

## 시계열 차트 구현

Recharts의 `AreaChart`로 5분 롤링 윈도우 차트를 만듭니다:

```tsx
<AreaChart data={chartData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#1B2838" />
  <XAxis dataKey="time" />
  <YAxis domain={[0, 100]} />
  <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="5 5" />
  <ReferenceLine y={80} stroke="#EF4444" strokeDasharray="5 5" />
  <Area
    type="monotone"
    dataKey="value"
    stroke="#00B4D8"
    fill="url(#gradient)"
    isAnimationActive={false}
  />
</AreaChart>
```

> [!WARNING] isAnimationActive={false}
> 1초마다 데이터가 갱신되므로 Recharts의 기본 애니메이션을 비활성화해야 합니다. 그렇지 않으면 애니메이션이 겹쳐 성능이 저하됩니다.

## ReferenceLine으로 임계값 표시

차트에 경고/위험 기준선을 점선으로 표시합니다:

| 기준선 | 색상 | 스타일 | 의미 |
|--------|------|--------|------|
| Warning | #F59E0B (노랑) | 점선 | 주의 필요 |
| Critical | #EF4444 (빨강) | 점선 | 즉시 대응 |

이 기준선 덕분에 운영자는 현재 값이 안전 범위에 있는지 차트를 보면서 직관적으로 판단할 수 있습니다.

## 스파크라인 미니 차트

메트릭 카드 안의 작은 차트는 추이를 빠르게 파악하게 합니다:

```tsx
<ResponsiveContainer width={80} height={40}>
  <AreaChart data={last60Points}>
    <Area
      type="monotone"
      dataKey="v"
      stroke={color}
      fill={`url(#spark-gradient)`}
      strokeWidth={1.5}
      dot={false}
      isAnimationActive={false}
    />
  </AreaChart>
</ResponsiveContainer>
```

> [!TIP] 축 숨기기
> 스파크라인에서는 XAxis, YAxis, CartesianGrid를 모두 생략합니다. 추이만 보여주는 것이 목적이므로 축 라벨은 불필요합니다.

## 알림 패널 UX

알림 패널은 실시간으로 새 알림을 수신하고, 운영자가 수동으로 해제할 수 있습니다:

```text
┌─ 알림 ──────── 활성 3건 ─┐
│ 🔴 CPU 사용률              │
│    임계값 초과: 87.3%       │
│                    [해제]   │
│ 🟡 메모리 사용률            │
│    경고: 72.1%              │
│                    [해제]   │
├─ 해제됨 ────────────────────┤
│ ✅ 네트워크 사용률 (취소선)   │
└──────────────────────────────┘
```

## 알림 중복 방지

같은 메트릭에 대해 이미 활성 알림이 있으면 새로 생성하지 않습니다:

```typescript
if (value >= critical) {
  const existing = alerts.find(
    a => a.service === metric && a.severity === "critical" && !a.resolved
  );
  if (!existing) {
    alerts.unshift({ /* new alert */ });
  }
}
```

> [!INFO] 자동 해제
> 값이 정상 범위로 돌아오면 해당 메트릭의 활성 알림을 자동 해제합니다. 운영자가 수동 해제할 수도 있습니다.

## 요약

- Recharts AreaChart로 5분 롤링 윈도우 시계열 차트
- ReferenceLine으로 경고/위험 기준선 시각화
- 스파크라인으로 메트릭 카드에 추이 표시
- 알림 패널: 중복 방지, 자동 해제, 수동 해제 지원
