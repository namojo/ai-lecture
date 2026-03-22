# 복합 패턴: 실전 하네스 조합

## 학습 목표

- 여러 하네스 패턴을 조합하여 복잡한 워크플로우를 구성할 수 있다
- 패턴 간 트레이드오프를 이해하고 적절히 선택할 수 있다
- 삼성 실무 시나리오에 맞는 복합 패턴을 설계할 수 있다

## 기본 패턴 복습

| 패턴 | 구조 | 장점 | 단점 |
|------|------|------|------|
| 파이프라인 | A → B → C | 단순, 예측 가능 | 병목 발생 |
| 팬아웃/팬인 | A → (B∥C∥D) → E | 병렬 처리 | 동기화 복잡 |
| 계층 위임 | A → B → (C∥D) | 유연함 | 오케스트레이션 비용 |
| 리뷰 루프 | A → B → R → (수정?) → B | 품질 보장 | 시간 증가 |

## 복합 패턴 1: 파이프라인 + 팬아웃

```mermaid
graph LR
  Design["📋 설계"] --> A["구현 A"]
  Design --> B["구현 B"]
  Design --> C["구현 C"]
  A --> Merge["🔗 통합"]
  B --> Merge
  C --> Merge
  Merge --> Test["✅ 테스트"]

  style Design fill:#1B2838,stroke:#F59E0B,color:#F59E0B
  style A fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style B fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style C fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Merge fill:#1B2838,stroke:#22d3ee,color:#22d3ee
  style Test fill:#0a1628,stroke:#22c55e,color:#22c55e
```

설계 결과를 기반으로 여러 구현 에이전트가 동시에 작업하고, 통합 에이전트가 합칩니다.

```markdown
# 오케스트레이터 워크플로우
1. designer에게 설계 요청 (순차)
2. frontend-dev, backend-dev, test-writer에게 병렬 요청
3. integrator에게 통합 요청 (순차)
4. npm run build && npm test 실행
```

> [!TIP] 인터페이스 계약
> 병렬 에이전트들이 서로의 코드를 모르므로, 설계 단계에서 **타입 정의와 API 인터페이스**를 확정하는 것이 핵심입니다.

## 복합 패턴 2: 계층 위임 + 리뷰 루프

```mermaid
graph TD
  Leader["🎯 리더"] --> TeamA["팀A 리더"]
  Leader --> TeamB["팀B 리더"]

  TeamA --> A1["작업자 A1"]
  TeamA --> A2["작업자 A2"]
  A1 --> RevA["🔍 리뷰어 A"]
  A2 --> RevA
  RevA -->|피드백| A1
  RevA -->|피드백| A2

  TeamB --> B1["작업자 B1"]
  TeamB --> B2["작업자 B2"]
  B1 --> RevB["🔍 리뷰어 B"]
  B2 --> RevB
  RevB -->|피드백| B1
  RevB -->|피드백| B2

  style Leader fill:#1B2838,stroke:#F59E0B,color:#F59E0B
  style TeamA fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style TeamB fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style A1 fill:#111d2c,stroke:#64748b,color:#94a3b8
  style A2 fill:#111d2c,stroke:#64748b,color:#94a3b8
  style B1 fill:#111d2c,stroke:#64748b,color:#94a3b8
  style B2 fill:#111d2c,stroke:#64748b,color:#94a3b8
  style RevA fill:#1B2838,stroke:#22d3ee,color:#22d3ee
  style RevB fill:#1B2838,stroke:#22d3ee,color:#22d3ee
```

대규모 프로젝트에서 팀별로 독립적인 리뷰 사이클을 운영합니다.

> [!WARNING] 리뷰 사이클 제한
> 리뷰 루프는 최대 2~3 사이클로 제한하세요. 무한 루프에 빠지면 AI 에이전트가 같은 문제를 반복 수정하는 비효율이 발생합니다.

## 복합 패턴 3: 조건부 분기

```typescript
// 오케스트레이터 로직
const analysisResult = await agent("analyzer").run(task);

if (analysisResult.complexity === "high") {
  // 복잡한 경우: 전문 에이전트 팀 투입
  await parallel([
    agent("senior-dev").run(coreLogic),
    agent("test-writer").run(testCases),
  ]);
} else {
  // 단순한 경우: 단일 에이전트
  await agent("junior-dev").run(fullTask);
}
```

## 삼성 시나리오: 빌드 파이프라인

```mermaid
graph TD
  Req["📋 요구사항 분석"] --> Design["📝 설계 문서 생성"]
  Design --> FE["🎨 프론트엔드"]
  Design --> BE["⚙️ 백엔드"]
  Design --> Test["🧪 테스트"]
  FE --> Review["🔍 코드 리뷰"]
  BE --> Review
  Test --> Review
  Review -->|"피드백 (최대 2회)"| FE
  Review -->|통과| Build["✅ 빌드 검증"]
  Build --> Deploy["📦 배포 문서 생성"]

  style Req fill:#1B2838,stroke:#F59E0B,color:#F59E0B
  style Design fill:#1B2838,stroke:#F59E0B,color:#F59E0B
  style FE fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style BE fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Test fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Review fill:#1B2838,stroke:#22d3ee,color:#22d3ee
  style Build fill:#0a1628,stroke:#22c55e,color:#22c55e
  style Deploy fill:#0a1628,stroke:#22c55e,color:#22c55e
```

> [!INFO] 점진적 도입
> 처음부터 복합 패턴을 적용하지 마세요. 단순 파이프라인부터 시작하여, 병목이 발생하는 지점에 병렬화를 추가하는 점진적 접근이 안전합니다.

## 요약

- 기본 패턴을 조합하여 복잡한 워크플로우 구성 가능
- 인터페이스 계약이 병렬 에이전트 간 독립성의 핵심
- 리뷰 루프는 반드시 최대 사이클 수 제한
- 점진적 도입이 안전한 전략
