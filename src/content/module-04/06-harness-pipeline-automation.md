# 하네스 파이프라인 자동화

## 학습 목표

- 로그 분석기 전체를 하네스로 자동 빌드하는 파이프라인을 설계할 수 있다
- 에이전트 간 작업 분배와 순차/병렬 실행 패턴을 적용할 수 있다
- 실제 프로젝트에 하네스 파이프라인을 도입하는 방법을 이해한다

## 파이프라인 개요

로그 분석기를 처음부터 만든다고 가정하고, 하네스 파이프라인을 설계합니다:

```text
[spec-writer] → [parser-dev] → [ui-dev] → [reviewer]
    (순차)         (병렬 가능)              (순차)
```

## 에이전트 역할 정의

| 에이전트 | 역할 | 산출물 |
|---------|------|--------|
| spec-writer | 요구사항 분석 + 타입 정의 | types/log.ts |
| parser-dev | 파싱 엔진 + 이상 탐지 | logParser.ts |
| ui-dev | React UI 컴포넌트 | LogAnalyzer.tsx 등 |
| reviewer | 코드 품질 + 기능 검증 | 리뷰 코멘트 |

## 오케스트레이터 스킬

```markdown
---
name: log-analyzer-pipeline
description: 로그 분석기 자동 빌드 파이프라인
allowed-tools:
  - Task
  - Read
  - Edit
  - Write
  - Bash
---

## 실행 순서

1. spec-writer에게 요구사항 분석 요청
2. spec-writer 완료 후, parser-dev와 ui-dev에게 **병렬** 요청
3. 둘 다 완료 후 reviewer에게 통합 검증 요청
4. reviewer 피드백이 있으면 해당 에이전트에 수정 요청
5. 최종 검증: `npm run build` 성공 확인
```

> [!TIP] 병렬 실행의 이점
> parser-dev와 ui-dev가 독립적이므로 병렬 실행이 가능합니다. 타입 정의(spec-writer의 산출물)가 인터페이스 역할을 하여 두 에이전트가 서로의 완료를 기다릴 필요가 없습니다.

## 에이전트 정의 예시

```markdown
# .claude/agents/parser-dev.md
---
name: parser-dev
description: 로그 파싱 엔진 개발 에이전트
model: sonnet
tools:
  - Read
  - Write
  - Edit
  - Bash
---

당신은 TypeScript 로그 파싱 엔진 개발자입니다.
types/log.ts의 타입 정의를 참조하여 logParser.ts를 구현합니다.

## 구현 원칙
- 3종 로그 포맷 지원 (syslog, app, access)
- 정규식은 모듈 레벨 상수로 정의
- 이상 탐지: spike, repeated_pattern, time_gap
- 모든 함수에 JSDoc 주석 작성
```

## 데이터 흐름

```text
spec-writer
  └─ types/log.ts (타입 정의)
      ├─ parser-dev → logParser.ts (파싱 + 이상탐지)
      └─ ui-dev → LogAnalyzer.tsx, LogViewer.tsx, LogChart.tsx
                    └─ import { analyzeLog } from "./logParser"
```

> [!WARNING] 의존성 순서
> spec-writer가 완료되기 전에 parser-dev와 ui-dev를 시작하면 안 됩니다. 타입 정의가 인터페이스 계약(contract)이므로, 이것이 확정된 후에 구현을 시작해야 합니다.

## 리뷰어 검증 항목

```markdown
# .claude/agents/reviewer.md 발췌

## 검증 체크리스트
1. TypeScript strict 에러 없음
2. 3종 로그 포맷 모두 파싱 성공
3. 이상 탐지 알고리즘 3가지 동작
4. 가상 스크롤 성능 (1만줄 기준)
5. 외부 네트워크 요청 없음 (폐쇄망 호환)
6. npm run build 성공
```

## 실전 적용 시 고려사항

1. **점진적 도입**: 전체를 한번에 자동화하지 말고, 가장 반복적인 작업부터 시작
2. **인간 검증 포인트**: 자동화 파이프라인에도 반드시 사람이 확인하는 단계 포함
3. **에이전트 범위 제한**: 하나의 에이전트가 너무 많은 일을 하면 품질 저하

> [!INFO] 다음 모듈 미리보기
> Module 5에서는 같은 파이프라인 패턴을 운영 대시보드에 적용합니다. Gemini CLI와 Claude Code를 비교하며 각 도구의 장단점을 분석합니다.

## 요약

- 하네스 파이프라인으로 로그 분석기를 자동 빌드하는 프로세스 설계
- spec-writer → (parser-dev ∥ ui-dev) → reviewer 순서
- 타입 정의가 에이전트 간 인터페이스 계약 역할
- 리뷰어 에이전트가 품질 게이트 역할 수행
