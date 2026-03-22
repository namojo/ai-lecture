# AI Lecture Platform

**하네스 기반 AI 애플리케이션 개발 교육 플랫폼**

> Samsung HI/SDI 개발자를 대상으로 Claude Code와 Gemini CLI를 활용한 하네스(Harness) 기반 AI 개발을 교육하는 인터랙티브 웹 플랫폼입니다.

[![Deploy to GitHub Pages](https://github.com/namojo/ai-lecture/actions/workflows/deploy.yml/badge.svg)](https://github.com/namojo/ai-lecture/actions/workflows/deploy.yml)

**[Live Demo](https://namojo.github.io/ai-lecture/)**

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **6개 모듈 / 30개 챕터** | AI 기반 개발 패러다임부터 고급 패턴까지 체계적 커리큘럼 |
| **인터랙티브 PoC 데모** | 서버 로그 분석기 + 운영 대시보드 실시간 시뮬레이션 |
| **코드 구문 강조** | TypeScript, Python, Bash, YAML, XML 등 다국어 하이라이팅 |
| **학습 진도 추적** | LocalStorage 기반 챕터별 완료 체크 + 전체 진도율 표시 |
| **다크/라이트 테마** | 시스템 설정 감지 + 수동 토글 |
| **반응형 디자인** | 데스크톱 + 태블릿 대응, 모바일 사이드바 토글 |
| **폐쇄망 지원** | 외부 네트워크 요청 0건, 정적 HTML로 완전 로컬 동작 |

---

## 커리큘럼 구성

총 학습 시간: 약 12시간 (자기 학습 기준)

### Module 1: AI 기반 개발의 새로운 패러다임
AI 기반 개발이 무엇인지 이해하고, Claude Code와 Gemini CLI를 직접 체험합니다.
- AI가 바꾸는 개발자의 일상
- Claude Code: 설치부터 첫 대화까지
- Gemini CLI: 설치부터 첫 대화까지
- 실습: 첫 번째 자동화 스크립트 만들기

### Module 2: 하네스 시스템의 이해
에이전트, 스킬, 오케스트레이터의 개념을 이해하고 하네스 설정을 해석합니다.
- 하네스란 무엇인가: 에이전트, 스킬, 오케스트레이터
- 에이전트 정의 파일 해부
- 스킬 파일 해부
- 아키텍처 패턴: 파이프라인부터 계층적 위임까지
- 실습: 나만의 첫 스킬 만들기

### Module 3: 프로젝트 설계와 팀 구성
실전 프로젝트 스펙 작성부터 에이전트 팀 구성, 오케스트레이터 설계까지 다룹니다.
- 프로젝트 스펙 작성법
- 에이전트 팀 구성 전략
- 오케스트레이터 설계
- 실습: 코드 리뷰 도구 만들기

### Module 4: PoC 1 — 서버 로그 분석기
하네스를 활용하여 로그 파싱 엔진과 이상 탐지 시스템을 구축합니다.
- 요구사항 분석과 설계
- 로그 파싱 엔진 구현
- 이상 탐지 알고리즘
- 리포트 시각화
- 실습: 분석기 확장하기
- 하네스 파이프라인 자동화

### Module 5: PoC 2 — 운영 대시보드
Gemini CLI를 활용하여 실시간 메트릭 대시보드를 구축합니다.
- 대시보드 설계 원칙
- Gemini CLI 스캐폴딩
- 메트릭 시뮬레이션 엔진
- 차트와 알림 시스템
- 실습: 커스텀 패널 추가
- Claude Code vs Gemini CLI 비교 분석

### Module 6: 고급 패턴과 실전 적용
복합 패턴, 에러 처리, 폐쇄망 전략 등 실무 적용을 위한 고급 주제를 다룹니다.
- 복합 아키텍처 패턴
- 에러 처리와 품질 보증
- 폐쇄망 운영 전략
- 워크숍: 삼성 실무 시나리오
- 로드맵과 다음 단계

---

## 인터랙티브 데모

### 서버 로그 분석기
3종 로그 포맷(syslog, application error, access log)을 브라우저에서 파싱하고 분석합니다.
- 에러 빈도 타임라인 시각화 (Recharts AreaChart)
- 3종 이상 탐지 알고리즘 (스파이크, 반복 패턴, 시간 갭)
- 1만줄+ 가상 스크롤 로그 뷰어
- 샘플 로그 또는 직접 파일 업로드

### 운영 대시보드
시드 기반 결정론적 시뮬레이터로 실시간 서버 메트릭을 모니터링합니다.
- CPU / Memory / Disk / Network 4종 메트릭 카드 + 스파크라인
- 5분 롤링 윈도우 타임시리즈 차트
- 임계값 기반 알림 자동 생성/해제
- 6개 서비스 헬스 그리드
- Play/Pause/Speed 컨트롤

---

## 기술 스택

| 카테고리 | 기술 |
|----------|------|
| **프레임워크** | Next.js 16 (App Router) + React 19 |
| **언어** | TypeScript 5.9 (strict mode) |
| **스타일링** | Tailwind CSS 4 |
| **마크다운 렌더링** | react-markdown + remark-gfm |
| **코드 하이라이팅** | prism-react-renderer |
| **차트** | Recharts 3 |
| **아이콘** | Lucide React |
| **애니메이션** | Framer Motion |
| **폰트** | Pretendard (한글) + JetBrains Mono (코드) |
| **배포** | GitHub Pages (static export) |

---

## 시작하기

### 필수 조건
- Node.js 20+
- npm 10+

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/namojo/ai-lecture.git
cd ai-lecture

# 의존성 설치
npm install

# 개발 서버 실행 (Turbopack)
npm run dev
```

브라우저에서 [http://localhost:3000/ai-lecture](http://localhost:3000/ai-lecture) 에 접속합니다.

### 프로덕션 빌드

```bash
# 정적 HTML 빌드
npm run build

# 빌드 결과물 로컬 서빙
npx serve out
```

`out/` 디렉토리에 42개 정적 HTML 페이지가 생성됩니다. 이 폴더를 그대로 웹 서버에 배포하거나 폐쇄망 환경에서 사용할 수 있습니다.

---

## 프로젝트 구조

```
ai-lecture/
├── .github/workflows/     # GitHub Actions 배포 워크플로우
├── public/
│   ├── fonts/             # Pretendard, JetBrains Mono (woff2)
│   └── sample-data/logs/  # 3종 샘플 로그 파일
├── src/
│   ├── app/               # Next.js App Router 페이지
│   │   ├── demo/          # PoC 데모 페이지
│   │   ├── module/        # 모듈/챕터 동적 라우트
│   │   └── progress/      # 학습 진도 페이지
│   ├── components/
│   │   ├── common/        # Badge, Card, Tabs
│   │   ├── demos/         # 로그 분석기, 운영 대시보드
│   │   ├── layout/        # AppShell, Header, Sidebar
│   │   └── lecture/       # ChapterView, CodeBlock, TipBox
│   ├── content/           # 30개 챕터 마크다운 (한국어)
│   │   ├── module-01/     # AI 기반 개발 패러다임
│   │   ├── module-02/     # 하네스 시스템
│   │   ├── module-03/     # 프로젝트 설계
│   │   ├── module-04/     # 로그 분석기 PoC
│   │   ├── module-05/     # 운영 대시보드 PoC
│   │   └── module-06/     # 고급 패턴
│   ├── data/              # 커리큘럼 메타데이터, 콘텐츠 로더
│   ├── hooks/             # useTheme, useProgress, useMetricsSimulator
│   ├── lib/               # 유틸리티 (cn, constants)
│   └── types/             # TypeScript 타입 정의
├── AI_LECTURE_SPEC.md     # 프로젝트 스펙 문서
├── CURRICULUM.md          # 커리큘럼 설계서
├── HARNESS_DESIGN.md      # 하네스 설계 문서
├── next.config.ts         # Next.js 설정 (static export)
└── package.json
```

---

## 폐쇄망 배포

이 플랫폼은 폐쇄망(Air-gapped) 환경을 위해 설계되었습니다.

```bash
# 빌드
npm run build

# out/ 디렉토리를 폐쇄망 서버로 복사
scp -r out/ user@internal-server:/var/www/ai-lecture/

# nginx, Apache 등 정적 파일 서버로 서빙
```

- 런타임 외부 API 호출: **0건**
- 폰트, 아이콘, 차트 라이브러리 모두 번들에 포함
- CDN 의존성 없음

---

## 라이선스

Internal use — Samsung HI/SDI
