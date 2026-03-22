# 실시간 메트릭 시뮬레이션

## 학습 목표

- 시드 기반 결정론적 난수 생성기(PRNG)를 구현할 수 있다
- 현실적인 서버 메트릭 패턴을 시뮬레이션할 수 있다
- `useEffect`와 `setInterval`로 실시간 업데이트를 구현할 수 있다

## 시드 기반 PRNG

재현 가능한 시뮬레이션을 위해 시드 기반 난수 생성기를 사용합니다:

```typescript
class SeededRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    // Lehmer RNG (Park-Miller)
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}
```

> [!TIP] 왜 Math.random()을 안 쓰나?
> `Math.random()`은 호출할 때마다 다른 값을 반환하므로 데모가 매번 달라집니다. 시드 기반 PRNG를 쓰면 같은 시드로 **항상 같은 시뮬레이션**이 재현됩니다.

## CPU 패턴 시뮬레이션

실제 서버의 CPU 사용 패턴을 모방합니다:

```typescript
function generateCPU(tick: number, rng: SeededRNG): number {
  let value = 30; // 기본 사용률

  // 주기적 배치 스파이크 (30초 주기)
  const batchPhase = Math.sin((tick / 30) * Math.PI * 2);
  if (batchPhase > 0.8) value += rng.range(30, 55);

  // 랜덤 노이즈
  value += rng.range(-5, 8);

  // 간헐적 GC (2% 확률)
  if (rng.next() < 0.02) value = rng.range(10, 20);

  return Math.max(0, Math.min(100, value));
}
```

## 메모리 패턴: 메모리 릭 시뮬레이션

```typescript
function generateMemory(tick: number, rng: SeededRNG): number {
  let value = 55; // 기본값

  // 점진적 증가 (120초 주기로 리셋 = GC)
  value += (tick % 120) * 0.15;

  // GC 발생 시 급감
  if (tick % 120 < 3) value = 55 - rng.range(5, 15);

  return Math.max(0, Math.min(100, value));
}
```

> [!WARNING] 0-100 클램핑
> 시뮬레이션 값은 반드시 `Math.max(0, Math.min(100, value))`로 범위를 제한해야 합니다. 음수 퍼센트나 100% 초과는 차트를 깨뜨립니다.

## React Hook으로 실시간 업데이트

```typescript
export function useMetricsSimulator() {
  const simRef = useRef(createSimulator(42));
  const [state, setState] = useState<DashboardState | null>(null);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<SimSpeed>(1);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      const next = simRef.current.step();
      setState({ ...next });
    }, 1000 / speed);
    return () => clearInterval(interval);
  }, [playing, speed]);

  return { state, playing, speed, togglePlay, setSpeed };
}
```

## 시뮬레이션 속도 제어

| 속도 | 업데이트 간격 | 용도 |
|------|-------------|------|
| 1x | 1000ms | 실시간 모니터링 체감 |
| 2x | 500ms | 패턴 빠르게 확인 |
| 5x | 200ms | 장시간 추이 관찰 |

> [!INFO] requestAnimationFrame vs setInterval
> 차트 렌더링은 `setInterval` 1초 간격이면 충분합니다. 60fps가 필요한 것은 UI 애니메이션뿐이고, 메트릭 데이터 자체는 1초 주기로 충분합니다.

## 알림 자동 생성

메트릭 값이 임계값을 넘으면 자동으로 알림을 생성합니다:

```typescript
function checkAlerts(name: MetricName, value: number) {
  if (value >= critical) {
    // 같은 메트릭의 활성 critical 알림이 없을 때만 생성
    alerts.push({ severity: "critical", ... });
  } else if (value < warning) {
    // 값이 정상으로 돌아오면 자동 해제
    alerts.filter(a => a.service === name).forEach(a => a.resolved = true);
  }
}
```

## 요약

- 시드 기반 PRNG로 재현 가능한 시뮬레이션
- 4종 메트릭 각각 현실적 패턴 구현 (스파이크, 릭, 로테이션, 버스트)
- React Hook + setInterval로 실시간 업데이트
- 임계값 기반 알림 자동 생성/해제
