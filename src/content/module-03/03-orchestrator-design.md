# 오케스트레이터 설계와 데이터 흐름

## 학습 목표

이 챕터를 완료하면 다음을 수행할 수 있습니다:

- 마스터 오케스트레이터의 역할과 설계 원칙을 이해하기
- 순차-병렬 혼합 워크플로우를 설계하기
- 에이전트 간 데이터 전달과 에러 처리를 구현하기

## 오케스트레이터란?

오케스트레이터는 **여러 에이전트의 실행 순서를 제어하고, 데이터를 전달하며, 최종 결과를 조합하는 중앙 제어 에이전트**입니다. 오케스트라의 지휘자처럼, 개별 에이전트는 자신의 역할만 수행하고 전체 흐름은 오케스트레이터가 관리합니다.

> [!TIP] 설계 핵심
> 오케스트레이터 자체는 비즈니스 로직을 수행하지 않습니다. 오직 **"누가, 언제, 무엇을 받아 실행하는가"**만 정의합니다. 실제 작업은 하위 에이전트에게 위임하세요.

## 워크플로우 페이즈 설계

실무 프로젝트의 워크플로우는 대부분 **순차 → 병렬 → 순차** 패턴을 따릅니다:

```
Phase 1: 초기화 (Sequential)
  └→ 프로젝트 스펙 파싱 → 공통 타입 생성 → 설정 파일 생성

Phase 2: 핵심 구현 (Parallel)
  ├→ frontend-agent: UI 컴포넌트 생성
  ├→ backend-agent: API 라우트 구현
  └→ test-agent: 테스트 코드 생성

Phase 3: 통합 (Sequential)
  └→ 결과 병합 → 통합 테스트 실행 → 최종 리포트
```

> [!WARNING] 병렬 실행 전제조건
> Phase 2에서 병렬 실행이 가능하려면, Phase 1에서 **공통 타입 정의와 인터페이스 계약(Contract)**이 완료되어야 합니다. 이것이 누락되면 에이전트들이 호환되지 않는 코드를 생성합니다.

## 오케스트레이터 스킬 구현

Claude Code의 커스텀 슬래시 커맨드를 활용하여 오케스트레이터를 구현할 수 있습니다. 핵심은 **각 단계의 입출력을 명확히 정의**하는 것입니다:

```typescript
// orchestrator.ts - 워크플로우 정의
interface WorkflowStep {
  agent: string;
  phase: 'sequential' | 'parallel';
  input: Record<string, unknown>;
  dependsOn?: string[];
}

const workflow: WorkflowStep[] = [
  // Phase 1: 순차
  { agent: 'spec-parser', phase: 'sequential', input: { specFile: './project-spec.xml' } },
  { agent: 'type-generator', phase: 'sequential',
    input: { parsedSpec: '${spec-parser.output}' }, dependsOn: ['spec-parser'] },
  // Phase 2: 병렬
  { agent: 'frontend-agent', phase: 'parallel',
    input: { types: '${type-generator.output}', scope: 'ui' }, dependsOn: ['type-generator'] },
  { agent: 'backend-agent', phase: 'parallel',
    input: { types: '${type-generator.output}', scope: 'api' }, dependsOn: ['type-generator'] }
];
```

## 데이터 전달 패턴

에이전트 간 데이터 전달에는 세 가지 방식이 있습니다:

| 방식 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **인메모리 전달** | 변수로 직접 전달 | 빠르고 단순 | 대용량 부적합 |
| **파일 기반 전달** | 중간 결과를 파일로 저장 | 디버깅 용이, 재실행 가능 | I/O 오버헤드 |
| **구조화된 출력** | JSON 스키마 강제 | 타입 안전성 보장 | 스키마 정의 필요 |

실무에서는 **파일 기반 전달**을 권장합니다. 중간 결과를 파일로 남기면 디버깅이 쉽고, 특정 단계부터 재실행할 수 있습니다:

```bash
# 중간 결과 저장 디렉토리 구조
.workflow/
  step-01-parsed-spec.json      # Phase 1 결과
  step-02-shared-types.ts       # 공통 타입
  step-03a-frontend-output.json # Phase 2 병렬 결과
  step-03b-backend-output.json
  step-04-final-report.json     # Phase 3 최종 결과
```

> [!INFO] 재실행 전략
> 파일 기반 전달을 사용하면 Phase 2에서 실패한 에이전트만 재실행할 수 있습니다. `step-02` 파일이 존재하면 Phase 1을 건너뛰고 Phase 2부터 시작하는 로직을 오케스트레이터에 포함하세요.

## 에러 처리 전략

멀티 에이전트 시스템에서는 세 가지 에러 처리 전략을 조합합니다:

| 전략 | 적용 상황 | 핵심 설정 |
|------|----------|----------|
| **재시도 (Retry)** | 타임아웃, 파싱 실패 등 일시적 오류 | `maxRetries: 2`, `backoffMs: 1000` |
| **폴백 (Fallback)** | 주 에이전트 실패 시 대안으로 전환 | 느리지만 안정적인 백업 에이전트 지정 |
| **부분 성공 (Partial)** | 병렬 실행 중 일부 실패 허용 | `minSuccessCount: 2` (3개 중 2개면 진행) |

> [!WARNING] 무한 루프 방지
> 피드백 루프 + 재시도가 결합되면 무한 루프 위험이 있습니다. **글로벌 타임아웃**(예: 5분)과 **최대 총 실행 횟수**(예: 10회)를 반드시 설정하세요.

> [!INFO] 다음 챕터 미리보기
> 다음 챕터에서는 지금까지 학습한 내용을 종합하여 **2-에이전트 코드 리뷰 도구**를 직접 구현하는 실습을 진행합니다.

## 요약

- 오케스트레이터는 비즈니스 로직 없이 **흐름 제어만 담당**
- 워크플로우는 **순차 → 병렬 → 순차** 패턴이 기본
- 병렬 실행 전에 공통 타입과 인터페이스 계약이 선행되어야 함
- 데이터 전달은 **파일 기반**이 디버깅과 재실행에 유리
- 에러 처리는 재시도, 폴백, 부분 성공 세 가지를 조합
- 글로벌 타임아웃과 최대 반복 횟수로 무한 루프를 방지
