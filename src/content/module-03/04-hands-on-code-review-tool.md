# 실습: 2-에이전트 코드 리뷰 도구

## 학습 목표

이 실습을 완료하면 다음을 직접 구현할 수 있습니다:

- 분석 에이전트와 리뷰 에이전트의 역할을 정의하기
- 순차 파이프라인으로 두 에이전트를 연결하기
- 오케스트레이터 스킬로 전체 흐름을 제어하기

## 실습 개요

PR 코드를 자동으로 리뷰하는 도구를 만듭니다. **code-analyzer**가 코드를 구조적으로 분석하고, **security-reviewer**가 보안 관점에서 검토합니다.

```
입력: 리뷰 대상 코드 파일 경로
  └→ [code-analyzer] 코드 분석 (복잡도, 패턴, 구조)
       └→ [security-reviewer] 보안 검토 (취약점, 민감 데이터)
            └→ 최종 리뷰 리포트 출력
```

> [!TIP] 프로젝트 구조
> 이 실습의 모든 파일은 `.claude/` 디렉토리 안에 생성됩니다. Claude Code의 커스텀 슬래시 커맨드 구조를 그대로 활용합니다.

## Step 1: 분석 에이전트 정의

`.claude/agents/code-analyzer.md` -- 코드의 구조, 복잡도, 패턴을 분석합니다:

```markdown
# Code Analyzer Agent

## Role
대상 코드 파일을 읽고 구조적 분석 리포트를 생성한다.

## Instructions
1. 대상 파일을 읽고 전체 구조를 파악하라
2. 함수/클래스 수, 순환 복잡도, 에러 처리 패턴, 외부 의존성을 분석하라
3. 분석 결과를 아래 JSON 형식으로 출력하라

## Output Format
\```json
{ "filePath": "...", "summary": "한 줄 요약",
  "metrics": { "totalLines": 0, "functionCount": 0, "maxNestingDepth": 0 },
  "dependencies": ["패키지명"], "concerns": ["구조적 문제점"] }
\```

## Constraints
- 코드를 수정하지 마라 (읽기 전용)
- 보안 관련 판단은 하지 마라 (security-reviewer 담당)
```

## Step 2: 보안 리뷰 에이전트 정의

`.claude/agents/security-reviewer.md` -- code-analyzer 출력을 참고하여 보안 검토합니다:

```markdown
# Security Reviewer Agent

## Role
code-analyzer의 분석 결과와 원본 코드를 기반으로 보안 리뷰를 수행한다.

## Instructions
1. code-analyzer의 분석 결과 JSON을 수신한다
2. 원본 코드에서 입력 검증 취약점, 하드코딩된 시크릿, 안전하지 않은 암호화,
   민감 데이터 로깅, 권한 검증 누락을 검토한다
3. 각 발견 사항에 심각도(HIGH/MEDIUM/LOW)를 부여하고 아래 형식으로 출력한다

## Output Format
\```json
{ "filePath": "...", "findings": [
    { "severity": "HIGH", "line": 42, "description": "...", "recommendation": "..." }
  ], "overallRisk": "HIGH|MEDIUM|LOW", "approvalStatus": "APPROVE|REQUEST_CHANGES" }
\```

## Constraints
- 구조적 품질은 판단하지 마라 (code-analyzer 담당)
- 발견 사항이 없으면 빈 배열로 APPROVE를 반환하라
```

> [!WARNING] 역할 경계 준수
> 각 에이전트의 Constraints 섹션이 핵심입니다. **"하지 말 것"을 명확히 정의**해야 에이전트가 다른 에이전트의 영역을 침범하지 않습니다.

## Step 3: 오케스트레이터 스킬

`.claude/commands/review.md` -- `/review` 커맨드의 진입점입니다:

```markdown
# Code Review Orchestrator

대상 파일에 대해 2단계 코드 리뷰를 수행합니다. 사용법: `/review [파일 경로]`

## 워크플로우
### Phase 1: 구조 분석
1. $ARGUMENTS 파일 경로를 확인하고 code-analyzer 역할로 분석한다
2. 분석 결과를 JSON으로 정리한다

### Phase 2: 보안 리뷰
3. Phase 1 결과를 참고하여 security-reviewer 역할로 보안 검토한다
4. 보안 리뷰 결과를 JSON으로 정리한다

### Phase 3: 최종 리포트
5. 두 결과를 통합하여 파일 요약, 구조적 우려사항, 보안 발견사항,
   종합 판정(APPROVE / REQUEST_CHANGES)을 포함한 리포트를 생성한다
```

## Step 4: 실행

```bash
claude "/review src/api/auth-handler.ts"
# Phase 1(구조 분석) → Phase 2(보안 리뷰) → Phase 3(종합 리포트) 순차 수행
```

> [!TIP] 확장 아이디어
> 이 2-에이전트 구조에 **performance-reviewer**(성능 병목 분석)나 **test-suggester**(누락 테스트 제안)를 추가하거나, REQUEST_CHANGES 시 자동 수정 에이전트를 연결하는 피드백 루프로 확장할 수 있습니다.

## 요약

- 2-에이전트 리뷰 도구: **code-analyzer**(구조 분석) + **security-reviewer**(보안 검토)
- 각 에이전트에 Role, Instructions, Output Format, Constraints를 명확히 정의
- 오케스트레이터는 `.claude/commands/review.md`의 3-Phase 워크플로우로 구현
- **Constraints로 역할 침범을 방지**하는 것이 안정적 멀티 에이전트 운영의 핵심
