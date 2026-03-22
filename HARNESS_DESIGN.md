# 하네스 아키텍처 설계서

## 개요

이 문서는 AI 강의 플랫폼 빌드를 위한 하네스 에이전트 팀 아키텍처를 정의한다.

---

## 실행 모드: Agent Team (권장)

5명의 에이전트가 직접 커뮤니케이션하며 협업하는 팀 모드를 사용한다.
교차 검증과 실시간 피드백을 통해 높은 품질의 결과물을 생산한다.

## 아키텍처 패턴: Pipeline + Fan-out/Fan-in (복합)

```
Phase 1 (순차): curriculum-designer → 모듈 구조 설계
Phase 2 (병렬): content-writer + demo-builder + ui-designer 동시 작업
  - content-writer: 한국어 강의 마크다운 작성
  - demo-builder: 2개 PoC 데모 React 컴포넌트 빌드
  - ui-designer: 웹사이트 레이아웃/네비/스타일 구축
  - 에이전트 간 SendMessage로 직접 조율
Phase 3 (수렴): reviewer → 품질 검증, FIX 피드백 (최대 2사이클)
Phase 4 (순차): orchestrator → 통합, npm run dev 검증
```

---

## 에이전트 정의

### 1. curriculum-designer
- **역할**: 커리큘럼 구조 설계, 모듈 분할, 학습 목표 정의
- **출력**: `_workspace/01_curriculum_structure.md`
- **팀 커뮤니케이션**:
  - → content-writer: 모듈/챕터 구조 전달
  - → demo-builder: 데모 요구사항 전달
  - → ui-designer: 네비게이션 구조 전달
  - ← reviewer: 범위/난이도 피드백

### 2. content-writer
- **역할**: 한국어 강의 마크다운 콘텐츠 작성
- **스킬**: module-writer
- **출력**: `src/content/module-NN/*.md` (30개 챕터)
- **팀 커뮤니케이션**:
  - ← curriculum-designer: 모듈 구조 수신
  - ↔ demo-builder: 코드 예제 조율
  - → reviewer: 콘텐츠 초안 전달
  - ← reviewer: 수정 피드백

### 3. demo-builder
- **역할**: PoC 데모 React 컴포넌트 빌드
- **스킬**: demo-scaffold
- **출력**:
  - `src/components/demos/log-analyzer/*` (5개 파일)
  - `src/components/demos/ops-dashboard/*` (6개 파일)
  - `public/sample-data/*` (6개 파일)
- **팀 커뮤니케이션**:
  - ← curriculum-designer: 데모 요구사항 수신
  - ↔ content-writer: 코드 예제 공유
  - ← ui-designer: 디자인 토큰 수신
  - → reviewer: 데모 코드 전달

### 4. ui-designer
- **역할**: 웹사이트 셸 빌드 (레이아웃, 네비게이션, 스타일링)
- **스킬**: frontend-design (기존 스킬 활용)
- **출력**:
  - `src/components/layout/*` (4개 파일)
  - `src/components/lecture/*` (8개 파일)
  - `src/components/common/*` (4개 파일)
  - Tailwind 설정, 폰트 셋업, 라우터 설정
- **팀 커뮤니케이션**:
  - ← content-writer: 필요한 컴포넌트 요청
  - → demo-builder: 디자인 토큰 전달
  - → reviewer: UI 전달

### 5. reviewer
- **역할**: 품질 검증 (한국어, 기술 정확성, 로컬 전용, 시각적 일관성)
- **스킬**: review-check
- **출력**: `_workspace/review_report.md`
- **검증 체크리스트**:
  - [ ] 한국어 문법/용어 일관성
  - [ ] 코드 예제 정확성
  - [ ] 외부 API 호출 없음 (fetch, axios, 외부 URL grep)
  - [ ] 디자인 토큰 일관성
  - [ ] 커리큘럼 난이도 진행
- **평가**: PASS / FIX (구체적 지시) / REDO

---

## 스킬 정의

### 1. lecture-orchestrator (마스터 오케스트레이터)
- **위치**: `.claude/skills/lecture-orchestrator/skill.md`
- **역할**: 전체 팀 조율
- **워크플로우**:
  1. 프로젝트 초기화 (Next.js + React + Tailwind)
  2. TeamCreate("lecture-team", 5명)
  3. curriculum-designer에 커리큘럼 설계 태스크
  4. 커리큘럼 확정 후 3명에게 병렬 태스크 분배
  5. reviewer에 품질 검증 태스크
  6. FIX 피드백 반영 (최대 2사이클)
  7. 통합 검증 (npm run dev)

### 2. module-writer (콘텐츠 작성 스킬)
- **위치**: `.claude/skills/module-writer/skill.md`
- **참조 파일**:
  - `references/chapter-template.md` - 챕터 마크다운 템플릿
  - `references/glossary.md` - AI/개발 한국어 용어집
- **워크플로우**:
  1. 모듈 아웃라인 읽기
  2. 챕터별: 개념 설명 → 코드 워크스루 → 실습 작성
  3. 커스텀 컴포넌트 마커 삽입 (TipBox, StepByStep, DEMO)
  4. 용어집 기반 한국어 기술 용어 일관성 확보

### 3. demo-scaffold (데모 빌드 스킬)
- **위치**: `.claude/skills/demo-scaffold/skill.md`
- **참조 파일**:
  - `references/demo-patterns.md` - React 데모 컴포넌트 패턴
  - `references/sample-data-format.md` - 샘플 데이터 JSON 스키마
- **워크플로우**:
  1. 데모 사양 읽기
  2. 데이터 레이어 빌드 (파서/시뮬레이터)
  3. 디스플레이 컴포넌트 빌드
  4. 인터랙티브 컨트롤 빌드
  5. 샘플 데이터 파일 생성
  6. 외부 API 호출 없음 검증

### 4. review-check (품질 검증 스킬)
- **위치**: `.claude/skills/review-check/skill.md`
- **워크플로우**:
  1. 모든 출력물 검토
  2. 5가지 기준 체크 (한국어, 기술, 로컬전용, 시각, 커리큘럼)
  3. PASS/FIX/REDO 평가
  4. 리뷰 리포트 출력

---

## 데이터 흐름

```
[Orchestrator/Leader]
    │
    ├── Phase 1: curriculum-designer
    │       ├──→ content-writer  (모듈 구조)
    │       ├──→ demo-builder    (데모 요구사항)
    │       └──→ ui-designer     (네비게이션 구조)
    │
    ├── Phase 2: 병렬 작업
    │       content-writer ←→ demo-builder   (코드 예제)
    │       ui-designer ←→ demo-builder      (디자인 토큰)
    │       content-writer ←→ ui-designer    (컴포넌트 필요)
    │
    ├── Phase 3: reviewer
    │       ├──→ content-writer  (FIX 항목)
    │       ├──→ demo-builder    (FIX 항목)
    │       └──→ ui-designer     (FIX 항목)
    │
    └── Phase 4: 통합 → npm run dev → 최종 리포트
```

---

## 실행 방법

```bash
# 1. 프로젝트 디렉토리에서
cd /Users/andy/Work/claude/ai-lecture

# 2. /harness 스킬 호출하여 에이전트/스킬 생성
#    (Claude Code에서 /harness 실행)

# 3. 오케스트레이터 실행
#    (Claude Code에서 /lecture-orchestrator 실행)
```

---

## 참조 파일

| 파일 | 용도 |
|------|------|
| `/Users/andy/Work/claude/harness/SKILL.md` | 하네스 메타 스킬 정의 |
| `/Users/andy/Work/claude/harness/references/orchestrator-template.md` | 오케스트레이터 템플릿 |
| `/Users/andy/Work/claude/harness/references/team-examples.md` | 팀 구성 예시 |
| `/Users/andy/Work/claude/harness/references/agent-design-patterns.md` | 아키텍처 패턴 |
