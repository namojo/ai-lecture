# 워크숍: 삼성 시나리오 적용 설계

## 학습 목표

- 실제 삼성 업무 시나리오에 하네스 패턴을 적용하는 설계 능력을 키운다
- 팀 토론을 통해 다양한 접근 방식의 장단점을 비교할 수 있다
- 자신의 업무에 즉시 적용 가능한 하네스를 설계할 수 있다

## 워크숍 진행 방식

1. 시나리오 읽기 (5분)
2. 개인 설계 (15분)
3. 팀 토론 (10분)
4. 발표 및 피드백 (10분)

## 시나리오 1: 배포 전 자동 점검

**상황**: 매주 금요일 배포 전에 코드 리뷰, 보안 점검, 성능 테스트를 수행합니다. 현재 3명이 각각 수동으로 진행하고 있어 4시간이 소요됩니다.

**설계 과제**: 이 과정을 하네스로 자동화하세요.

```mermaid
graph TD
  Input["📥 Git PR URL"] --> Review["🔍 코드 리뷰"]
  Input --> Security["🔒 보안 점검"]
  Input --> Perf["⚡ 성능 테스트"]
  Review --> Merge["📊 결과 종합"]
  Security --> Merge
  Perf --> Merge
  Merge --> Check{"전체 통과?"}
  Check -->|Yes| Approve["✅ 배포 승인"]
  Check -->|No| Reject["❌ 배포 반려"]

  style Input fill:#0a1628,stroke:#00b4d8,color:#00b4d8
  style Review fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Security fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Perf fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Merge fill:#1B2838,stroke:#F59E0B,color:#F59E0B
  style Check fill:#111d2c,stroke:#22d3ee,color:#22d3ee
  style Approve fill:#0a1628,stroke:#22c55e,color:#22c55e
  style Reject fill:#0a1628,stroke:#EF4444,color:#EF4444
```

> [!TIP] 설계 힌트
> 팬아웃 패턴이 적합합니다. 3개 에이전트가 병렬로 점검하고, 통합 에이전트가 결과를 종합합니다.

## 시나리오 2: 신규 API 엔드포인트 생성

**상황**: 신규 기능 요청이 들어오면 API 설계 → 구현 → 테스트 → 문서화를 순차적으로 진행합니다.

**설계 과제**: 요구사항 문서 하나로 전체 파이프라인을 자동화하세요.

```mermaid
graph TD
  Input["📥 요구사항 문서\n(마크다운)"] --> Designer["📋 api-designer\nOpenAPI 스펙 생성"]
  Designer --> Impl["⚙️ implementer\n컨트롤러/서비스 구현"]
  Designer --> TW["🧪 test-writer\n단위/통합 테스트"]
  Impl --> Doc["📝 doc-generator\nSwagger 문서 생성"]
  TW --> Doc
  Doc --> Output["📤 API 엔드포인트\n+ 테스트 + 문서"]

  style Input fill:#0a1628,stroke:#F59E0B,color:#F59E0B
  style Designer fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Impl fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style TW fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Doc fill:#1B2838,stroke:#22d3ee,color:#22d3ee
  style Output fill:#0a1628,stroke:#22c55e,color:#22c55e
```

## 시나리오 3: 레거시 코드 마이그레이션

**상황**: Java 8로 작성된 유틸리티 모듈을 Kotlin으로 마이그레이션해야 합니다. 50개 클래스, 약 1만 줄입니다.

**설계 과제**: 점진적 마이그레이션 하네스를 설계하세요.

```mermaid
graph TD
  Analyze["🔍 의존성 분석"] --> Order["📋 변환 순서 결정"]
  Order --> Convert["♻️ 리프 클래스부터\n순차 변환"]
  Convert --> Test{"🧪 테스트\n통과?"}
  Test -->|Yes| Next{"다음\n클래스?"}
  Next -->|Yes| Convert
  Next -->|No| Done["✅ 마이그레이션 완료"]
  Test -->|No| Rollback["⏪ 롤백"]
  Rollback --> Fix["🔧 수동 수정"]
  Fix --> Convert

  style Analyze fill:#1B2838,stroke:#F59E0B,color:#F59E0B
  style Order fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Convert fill:#1B2838,stroke:#00b4d8,color:#e0e1dd
  style Test fill:#111d2c,stroke:#22d3ee,color:#22d3ee
  style Next fill:#111d2c,stroke:#22d3ee,color:#22d3ee
  style Done fill:#0a1628,stroke:#22c55e,color:#22c55e
  style Rollback fill:#1B2838,stroke:#EF4444,color:#EF4444
  style Fix fill:#1B2838,stroke:#F59E0B,color:#F59E0B
```

> [!WARNING] 전체 변환 금지
> 1만 줄을 한번에 AI에게 변환 요청하면 높은 확률로 실패합니다. **파일 단위로, 의존성 순서대로** 점진적으로 진행해야 합니다.

## 설계 템플릿

각 시나리오의 설계서를 다음 형식으로 작성하세요:

```markdown
## 하네스 설계서

### 에이전트 목록
| 이름 | 역할 | 입력 | 출력 |
|------|------|------|------|

### 실행 흐름
1. (순차/병렬 표시)
2. ...

### 품질 게이트
- [ ] 게이트 조건 1
- [ ] 게이트 조건 2

### 실패 대응
- 실패 시나리오 A → 대응 전략
- 실패 시나리오 B → 대응 전략
```

> [!INFO] 정답은 없다
> 같은 시나리오에도 여러 설계가 가능합니다. 중요한 것은 **왜 이 구조를 선택했는지** 설명할 수 있는 것입니다.

## 요약

- 실제 삼성 업무 시나리오에 하네스 패턴을 적용하는 실전 워크숍
- 배포 점검, API 생성, 레거시 마이그레이션 3가지 시나리오
- 설계 → 토론 → 피드백의 반복 학습
- "왜 이 구조인가"를 설명할 수 있는 것이 핵심
