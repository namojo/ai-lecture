```xml
<project_specification>

<project_name>AI Lecture Platform - 하네스 기반 AI 애플리케이션 개발 교육</project_name>

<overview>
삼성중공업, 삼성SDI 개발자를 대상으로 Claude Code와 Gemini CLI를 활용한 하네스(Harness) 기반 AI 애플리케이션 개발을 교육하는 웹 플랫폼이다. 온라인 셀프 학습과 오프라인 강의 보조 자료를 동시에 제공하며, 6개 모듈 30개 챕터로 구성된 체계적인 커리큘럼을 포함한다.

핵심 기능으로는 모듈별 강의 콘텐츠(개념 설명 + 코드 워크스루 + 실습), 2개의 인터랙티브 PoC 데모(서버 로그 분석기, 운영 대시보드), 학습 진도 추적, 코드 구문 강조, 다크 모드 지원을 제공한다. 각 모듈은 삼성 실무 시나리오와 연결되어 실질적인 업무 적용 능력을 배양한다.

CRITICAL: 폐쇄망(Air-gapped) 환경에서 동작해야 한다. 모든 의존성은 빌드 타임에 번들링되며, 런타임에 외부 API 호출이 절대 없어야 한다. `npm run dev`로 로컬에서 완전히 동작해야 하며, 폰트, 아이콘, 차트 라이브러리 모두 로컬 번들에 포함되어야 한다.
</overview>

<scope_boundaries>
  <in_scope>
    - 6개 모듈 / 30개 챕터 강의 콘텐츠 (한국어 마크다운)
    - 사이드바 네비게이션 + 콘텐츠 영역 2컬럼 레이아웃
    - 모듈/챕터 간 탐색 (이전/다음, 사이드바 트리)
    - 코드 블록 구문 강조 (TypeScript, Python, Bash, YAML, XML)
    - PoC 1: 서버 로그 분석기 (브라우저 내 파싱 + 시각화)
    - PoC 2: 운영 대시보드 (메트릭 시뮬레이터 + 실시간 차트)
    - 학습 진도 추적 (LocalStorage 기반)
    - 다크 모드 / 라이트 모드 토글
    - 반응형 디자인 (데스크톱 + 태블릿)
    - TipBox, StepByStep, CodePlayground 등 강의용 UI 컴포넌트
  </in_scope>
  <out_of_scope>
    - 사용자 인증/로그인
    - 서버 백엔드 또는 데이터베이스
    - 외부 API 호출 (LLM API 포함)
    - 퀴즈/시험 시스템
    - 수강생 관리/관리자 대시보드
    - 모바일 네이티브 앱
    - PDF/PPTX 다운로드 기능
    - 실시간 코드 실행 (코드는 읽기 전용 표시)
  </out_of_scope>
  <future_considerations>
    - PDF/PPTX 강의 자료 다운로드 (Phase 2)
    - 퀴즈/평가 시스템 (Phase 2)
    - 실시간 코드 실행 환경 연동 (Phase 3)
    - 수강생 진도 통합 관리 대시보드 (Phase 3)
  </future_considerations>
</scope_boundaries>

<technology_stack>
  <frontend_application>
    <framework>Next.js 15 (App Router) with React 19 and TypeScript 5.7</framework>
    <build_tool>Next.js built-in (Turbopack for dev, static export for production)</build_tool>
    <styling>Tailwind CSS 4</styling>
    <routing>Next.js App Router (file-based routing, static export)</routing>
    <state_management>React Context for UI state, LocalStorage for progress tracking</state_management>
  </frontend_application>
  <data_layer>
    <content>Markdown files in src/content/ rendered via react-markdown</content>
    <progress>LocalStorage key "ai-lecture-progress" (JSON)</progress>
    <demo_data>Static JSON files in public/sample-data/</demo_data>
    <note>CRITICAL: NO backend. NO fetch to external URLs. ALL data is local static files or browser storage.</note>
  </data_layer>
  <libraries>
    <markdown>react-markdown v9.0 + remark-gfm v4.0 for lecture content rendering</markdown>
    <code_highlight>prism-react-renderer v2.4 for syntax highlighting</code_highlight>
    <charts>Recharts v2.13 for PoC demo visualizations</charts>
    <icons>Lucide React v0.468 for UI icons</icons>
    <animation>Framer Motion v11.15 for page transitions and micro-interactions</animation>
    <dates>date-fns v4.1 for date formatting in demos</dates>
    <note>React Router 불필요 — Next.js App Router가 파일 기반 라우팅 제공</note>
  </libraries>
</technology_stack>

<prerequisites>
  <environment_setup>
    - Node.js v20+ and npm v10+
    - Modern browser (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+)
    - CRITICAL: 인터넷 연결 불필요 (npm install은 최초 1회만, 이후 오프라인 가능)
  </environment_setup>
  <build_configuration>
    - Next.js 15 with App Router and static export (output: 'export')
    - TypeScript strict mode enabled
    - Tailwind CSS 4 (postcss plugin)
    - Path alias: @ → src/ (tsconfig paths)
    - Pretendard 폰트: public/fonts/에 로컬 번들 (CDN 사용 불가)
    - JetBrains Mono 폰트: public/fonts/에 로컬 번들
    - CRITICAL: next.config.ts에 output: 'export' 설정 필수 (정적 HTML 생성, 서버 불필요)
  </build_configuration>
</prerequisites>

<environment_variables>
  <note>환경 변수 불필요. API 키 없음. 모든 설정은 next.config.ts에서 컴파일 타임에 처리.</note>
</environment_variables>

<file_structure>
ai-lecture/
├── .claude/
│   ├── agents/
│   │   ├── curriculum-designer.md   # 커리큘럼 설계 에이전트
│   │   ├── content-writer.md        # 한국어 콘텐츠 작성 에이전트
│   │   ├── demo-builder.md          # PoC 데모 빌드 에이전트
│   │   ├── ui-designer.md           # UI/UX 설계 에이전트
│   │   └── reviewer.md              # 품질 검증 에이전트
│   └── skills/
│       ├── lecture-orchestrator/
│       │   └── skill.md             # 팀 오케스트레이터 (마스터 스킬)
│       ├── module-writer/
│       │   ├── skill.md             # 모듈 콘텐츠 작성 스킬
│       │   └── references/
│       │       ├── chapter-template.md
│       │       └── glossary.md      # AI/개발 한국어 용어집
│       ├── demo-scaffold/
│       │   ├── skill.md             # 데모 컴포넌트 빌드 스킬
│       │   └── references/
│       │       ├── demo-patterns.md
│       │       └── sample-data-format.md
│       └── review-check/
│           └── skill.md             # 품질 검증 스킬
├── public/
│   ├── fonts/
│   │   ├── Pretendard-*.woff2       # 한국어 본문 폰트
│   │   └── JetBrainsMono-*.woff2    # 코드 폰트
│   └── sample-data/
│       ├── logs/
│       │   ├── syslog-sample.log    # 시스템 로그 샘플
│       │   ├── app-error.log        # 애플리케이션 에러 로그
│       │   └── access-log.log       # 접근 로그
│       └── metrics/
│           ├── cpu-history.json     # CPU 메트릭 히스토리
│           ├── memory-history.json  # 메모리 메트릭 히스토리
│           └── alert-history.json   # 알림 히스토리
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # 루트 레이아웃 (AppShell, 폰트, 글로벌 CSS)
│   │   ├── page.tsx                 # / → /module/module-01 리다이렉트
│   │   ├── globals.css              # Tailwind imports + 커스텀 CSS
│   │   ├── module/
│   │   │   └── [moduleId]/
│   │   │       ├── page.tsx         # 모듈 랜딩 페이지
│   │   │       └── [chapterId]/
│   │   │           └── page.tsx     # 챕터 콘텐츠 뷰
│   │   ├── demo/
│   │   │   ├── log-analyzer/
│   │   │   │   └── page.tsx         # 로그 분석기 데모
│   │   │   └── ops-dashboard/
│   │   │       └── page.tsx         # 운영 대시보드 데모
│   │   └── progress/
│   │       └── page.tsx             # 진도 현황 페이지
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx         # 전체 레이아웃 (사이드바 + 메인)
│   │   │   ├── Header.tsx           # 상단 네비게이션 바
│   │   │   ├── Sidebar.tsx          # 모듈/챕터 트리 네비게이션
│   │   │   └── Footer.tsx           # 하단 정보
│   │   ├── lecture/
│   │   │   ├── ChapterView.tsx      # 챕터 콘텐츠 렌더러
│   │   │   ├── CodeBlock.tsx        # 구문 강조 코드 블록
│   │   │   ├── CodePlayground.tsx   # 인터랙티브 코드 뷰어 (읽기 전용)
│   │   │   ├── StepByStep.tsx       # 단계별 실습 안내 컴포넌트
│   │   │   ├── TipBox.tsx           # 팁/경고/정보 콜아웃 박스
│   │   │   ├── ProgressTracker.tsx  # 학습 진도 표시
│   │   │   └── ChapterNav.tsx       # 이전/다음 챕터 네비게이션
│   │   ├── demos/
│   │   │   ├── log-analyzer/
│   │   │   │   ├── LogAnalyzer.tsx      # 메인 데모 UI
│   │   │   │   ├── LogViewer.tsx        # 원본 로그 표시
│   │   │   │   ├── AnomalyReport.tsx    # 이상 탐지 결과 리포트
│   │   │   │   ├── LogChart.tsx         # 에러 빈도 타임라인 차트
│   │   │   │   └── logParser.ts         # 로그 파싱 엔진
│   │   │   └── ops-dashboard/
│   │   │       ├── Dashboard.tsx        # 대시보드 메인 레이아웃
│   │   │       ├── MetricCard.tsx       # 개별 메트릭 카드
│   │   │       ├── AlertPanel.tsx       # 알림 목록 패널
│   │   │       ├── SystemStatus.tsx     # 서비스 헬스 상태 그리드
│   │   │       ├── TimeSeriesChart.tsx  # CPU/Memory 시계열 차트
│   │   │       └── metricsSimulator.ts  # 메트릭 시뮬레이터
│   │   └── common/
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Button.tsx
│   │       └── Tabs.tsx
│   ├── content/
│   │   ├── module-01/               # AI 기반 개발의 새로운 패러다임
│   │   │   ├── 01-what-is-ai-dev.md
│   │   │   ├── 02-claude-code-basics.md
│   │   │   ├── 03-gemini-cli-basics.md
│   │   │   └── 04-hands-on-first-automation.md
│   │   ├── module-02/               # 하네스 시스템의 이해
│   │   │   ├── 01-what-is-harness.md
│   │   │   ├── 02-agent-anatomy.md
│   │   │   ├── 03-skill-anatomy.md
│   │   │   ├── 04-architecture-patterns.md
│   │   │   └── 05-hands-on-first-skill.md
│   │   ├── module-03/               # 실전 도구 만들기
│   │   │   ├── 01-project-spec-writing.md
│   │   │   ├── 02-team-composition.md
│   │   │   ├── 03-orchestrator-design.md
│   │   │   └── 04-hands-on-code-review-tool.md
│   │   ├── module-04/               # PoC 1 - 서버 로그 분석기
│   │   │   ├── 01-requirements-analysis.md
│   │   │   ├── 02-log-parsing-engine.md
│   │   │   ├── 03-anomaly-detection.md
│   │   │   ├── 04-report-visualization.md
│   │   │   ├── 05-hands-on-extend-analyzer.md
│   │   │   └── 06-harness-pipeline-automation.md
│   │   ├── module-05/               # PoC 2 - 운영 대시보드
│   │   │   ├── 01-dashboard-design.md
│   │   │   ├── 02-gemini-cli-scaffolding.md
│   │   │   ├── 03-metrics-simulation.md
│   │   │   ├── 04-charts-and-alerts.md
│   │   │   ├── 05-hands-on-custom-panel.md
│   │   │   └── 06-claude-vs-gemini.md
│   │   └── module-06/               # 고급 패턴과 실전 적용
│   │       ├── 01-composite-patterns.md
│   │       ├── 02-error-handling-quality.md
│   │       ├── 03-airgap-strategy.md
│   │       ├── 04-workshop-samsung-scenarios.md
│   │       └── 05-roadmap-next-steps.md
│   ├── data/
│   │   ├── curriculum.ts            # 모듈/챕터 메타데이터 및 순서
│   │   └── glossary.ts              # 한국어 용어집 데이터
│   ├── hooks/
│   │   ├── useModule.ts             # 모듈/챕터 데이터 훅
│   │   ├── useProgress.ts           # LocalStorage 진도 추적 훅
│   │   ├── useTheme.ts              # 다크모드 토글 훅
│   │   └── useMetricsSimulator.ts   # 대시보드 메트릭 시뮬레이터 훅
│   ├── lib/
│   │   ├── utils.ts                 # cn() 헬퍼, 공통 유틸리티
│   │   └── constants.ts             # 색상, 사이즈 등 상수
│   └── types/
│       ├── curriculum.ts            # Module, Chapter 타입
│       ├── log.ts                   # LogEntry, Anomaly 타입
│       └── metrics.ts               # Metric, Alert 타입
├── AI_LECTURE_SPEC.md               # 이 파일 (프로젝트 스펙)
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
</file_structure>

<core_data_entities>
  <module>
    - id: string (예: "module-01")
    - title: string (한국어, 예: "AI 기반 개발의 새로운 패러다임")
    - description: string (1-2문장 요약)
    - icon: string (Lucide 아이콘 이름)
    - chapters: Chapter[] (순서대로)
    - estimatedMinutes: number (전체 모듈 예상 소요 시간)
  </module>

  <chapter>
    - id: string (예: "01-what-is-ai-dev")
    - moduleId: string (FK to module.id)
    - title: string (한국어)
    - type: enum (concept, demo, hands-on, workshop)
    - contentPath: string (마크다운 파일 경로)
    - estimatedMinutes: number
    - order: number
  </chapter>

  <progress>
    - chapterId: string
    - completed: boolean
    - completedAt: Date | null
    - lastVisitedAt: Date
    저장: LocalStorage key "ai-lecture-progress" (JSON object, chapterId → ProgressEntry)
  </progress>

  <log_entry>
    - timestamp: Date
    - severity: enum (INFO, WARN, ERROR, FATAL)
    - source: string (서비스/프로세스 이름)
    - message: string
    - rawLine: string (원본 로그 라인)
    - lineNumber: number
  </log_entry>

  <anomaly>
    - id: string
    - type: enum (spike, repeated_pattern, time_gap)
    - severity: enum (low, medium, high, critical)
    - startTime: Date
    - endTime: Date
    - description: string (한국어 설명)
    - affectedLines: number[] (관련 로그 라인 번호)
    - count: number (발생 횟수)
  </anomaly>

  <metric_point>
    - timestamp: Date
    - name: string (예: "cpu", "memory", "disk", "network")
    - value: number (0-100 for percentage, bytes for memory/disk)
    - unit: string (예: "%", "GB", "Mbps")
  </metric_point>

  <alert>
    - id: string
    - timestamp: Date
    - severity: enum (info, warning, critical)
    - service: string
    - message: string (한국어)
    - resolved: boolean
  </alert>

  <service_status>
    - name: string (서비스 이름)
    - status: enum (healthy, degraded, down)
    - uptime: number (0-100, 퍼센트)
    - lastChecked: Date
  </service_status>
</core_data_entities>

<route_definitions>
  <routes>
    <route path="/" redirect="/module/module-01" />
    <route path="/module/:moduleId" page="ModulePage" />
    <route path="/module/:moduleId/:chapterId" page="ChapterView" />
    <route path="/demo/log-analyzer" page="LogAnalyzer" />
    <route path="/demo/ops-dashboard" page="Dashboard" />
    <route path="/progress" page="ProgressOverview" />
  </routes>
  <note>Next.js App Router 파일 기반 라우팅. static export로 정적 호스팅 호환. 모든 라우트는 퍼블릭 (인증 없음).</note>
</route_definitions>

<component_hierarchy>
  <app>
    <theme_provider>  <!-- 다크/라이트 모드 Context -->
      <router>
        <app_shell>
          <header height="56px">
            <logo />                    <!-- "AI Lecture" 텍스트 + 아이콘 -->
            <module_tabs />             <!-- 모듈 1-6 탭 -->
            <theme_toggle />            <!-- 다크/라이트 토글 -->
          </header>
          <content_area>
            <sidebar width="280px">
              <module_nav>              <!-- 모듈 목록 (아코디언) -->
                <module_group>          <!-- 모듈 헤더 (접기/펼치기) -->
                  <chapter_link />      <!-- 챕터 링크 + 진도 체크마크 -->
                </module_group>
              </module_nav>
              <progress_summary />      <!-- 전체 진도 % -->
            </sidebar>
            <main_panel>
              <breadcrumb />            <!-- 모듈 > 챕터 경로 -->
              <page_content>            <!-- 스크롤 영역 -->
                <outlet />              <!-- ModulePage, ChapterView, Demo 등 -->
              </page_content>
              <chapter_nav />           <!-- 이전/다음 챕터 버튼 -->
            </main_panel>
          </content_area>
        </app_shell>
      </router>
    </theme_provider>
  </app>

  <shared>
    <code_block />                      <!-- 구문 강조 코드 블록 -->
    <code_playground />                 <!-- 인터랙티브 코드 뷰어 -->
    <step_by_step />                    <!-- 단계별 안내 -->
    <tip_box />                         <!-- 팁/경고/정보 박스 -->
    <badge />
    <card />
    <button />
    <tabs />
  </shared>
</component_hierarchy>

<pages_and_interfaces>
  <global_layout>
    <header>
      - 고정 상단, 56px 높이, full width
      - Background: #0D1B2A (dark) / #FFFFFF (light)
      - 좌측: 로고 아이콘 (Lucide BookOpen, 24px) + "AI Lecture" 텍스트 16px/600
      - 중앙: 모듈 탭 6개 (Module 1-6), 각 탭 패딩 12px 16px
      - 활성 탭: 하단 2px 보더 #00B4D8, 텍스트 #00B4D8
      - 비활성 탭: 텍스트 #778DA9 (dark) / #415A77 (light)
      - 우측: 다크모드 토글 (Sun/Moon 아이콘, 32px 터치 영역)
      - Border-bottom: 1px solid #1B2838 (dark) / #E2E8F0 (light)
    </header>

    <sidebar>
      - 고정 좌측, 280px 너비, 헤더 아래 전체 높이
      - Background: #0F1923 (dark) / #F8FAFC (light)
      - Border-right: 1px solid #1B2838 (dark) / #E2E8F0 (light)
      - 스크롤 가능 (커스텀 스크롤바, 4px 너비)
      - 모듈 그룹: 아코디언 형태
        - 모듈 헤더: 44px 높이, 패딩 12px 16px, 클릭으로 펼치기/접기
        - 모듈 아이콘 (20px) + 모듈 번호 + 제목 (14px/500)
        - 펼침 화살표: ChevronDown 12px, 180도 회전 애니메이션 200ms
      - 챕터 링크: 36px 높이, 좌측 패딩 48px (들여쓰기)
        - 텍스트: 13px/400, #94A3B8 (dark) / #64748B (light)
        - 활성: background #1B2838 (dark) / #E2E8F0 (light), 텍스트 #00B4D8
        - 완료: 좌측에 체크마크 아이콘 (CheckCircle, 14px, #22C55E)
        - Hover: background #1B2838/50 (dark) / #F1F5F9 (light), 150ms 트랜지션
      - 하단 진도 요약: 전체 % 프로그레스 바 (4px 높이, #00B4D8 채움)
    </sidebar>

    <main_panel>
      - Flex-grow, min-width 600px
      - 패딩: 40px 48px
      - 최대 콘텐츠 너비: 800px, 좌측 정렬
      - Background: #0A1628 (dark) / #FFFFFF (light)
    </main_panel>
  </global_layout>

  <module_page>
    <header>
      - 모듈 아이콘 (48px, #00B4D8)
      - 모듈 번호: "Module N" 14px/500 uppercase #00B4D8
      - 모듈 제목: 32px/700 #E0E1DD (dark) / #0D1B2A (light)
      - 모듈 설명: 16px/400 #94A3B8 (dark) / #64748B (light), 최대 2줄
      - 예상 소요 시간: Clock 아이콘 14px + "약 N분" 텍스트
      - 하단 구분선: 1px solid #1B2838 (dark) / #E2E8F0 (light), margin-top 24px
    </header>
    <chapter_list>
      - 챕터 카드 목록 (세로 배치, gap 12px)
      - 각 카드: 80px 높이, 패딩 16px 20px, border-radius 8px
        - Background: #111D2C (dark) / #F8FAFC (light)
        - 좌측: 순번 뱃지 (28px 원형, #1B2838 bg (dark) / #E2E8F0 bg (light), 13px/600)
        - 중앙: 챕터 제목 (15px/500) + 타입 뱃지 (개념/데모/실습/워크숍)
          - 개념: #3B82F6 bg, "개념"
          - 데모: #8B5CF6 bg, "데모"
          - 실습: #22C55E bg, "실습"
          - 워크숍: #F59E0B bg, "워크숍"
        - 우측: 소요 시간 "N분" + 완료 체크마크 (완료 시)
        - Hover: border 1px solid #00B4D8/30, 150ms 트랜지션
        - 클릭: 해당 챕터로 이동
    </chapter_list>
  </module_page>

  <chapter_view>
    <breadcrumb>
      - "Module N" > "챕터 제목" 형식
      - 13px, #94A3B8, 각 세그먼트 클릭 가능
      - 구분자: ChevronRight 12px
    </breadcrumb>
    <content_area>
      - 마크다운 렌더링 영역
      - h1: 28px/700, margin-top 32px, margin-bottom 16px
      - h2: 22px/600, margin-top 28px, margin-bottom 12px
      - h3: 18px/600, margin-top 24px, margin-bottom 8px
      - p: 16px/400, line-height 1.8, margin-bottom 16px
      - 코드 블록: CodeBlock 컴포넌트로 렌더링 (아래 참조)
      - 이미지: max-width 100%, border-radius 8px, margin 16px 0
      - 링크: #00B4D8, underline on hover
      - 목록: 좌측 패딩 24px, bullet #415A77
    </content_area>
    <chapter_nav>
      - 하단 고정, 패딩 24px 0, border-top 1px solid 구분선
      - 좌측: "← 이전: 챕터명" 버튼
      - 우측: "다음: 챕터명 →" 버튼
      - 버튼: 패딩 12px 20px, border-radius 8px, 15px/500
      - 다음 버튼: bg #00B4D8, 텍스트 white
      - 이전 버튼: bg transparent, border 1px #415A77, 텍스트 #94A3B8
      - "완료로 표시" 체크박스: 중앙, 체크 시 진도 업데이트
    </chapter_nav>
  </chapter_view>

  <code_block_component>
    - Background: #0C1222 (dark) / #1E293B (light 테마에서도 다크 코드 배경)
    - Border-radius: 8px
    - 상단 바: 44px, 언어 뱃지 (좌측, 12px uppercase) + 복사 버튼 (우측, Copy 아이콘)
    - 코드 영역: 패딩 16px 20px, 14px JetBrains Mono, line-height 1.6
    - 구문 강조: prism-react-renderer 테마 (vsDark 기반 커스텀)
    - 라인 넘버: 좌측 48px 영역, #415A77 색상, 14px
    - 복사 성공: 아이콘 Check로 변경, 2초 후 복귀
    - 하이라이트 라인: bg #1B2838/80, 좌측 3px 보더 #00B4D8
    - 최대 높이: 500px, 오버플로우 시 스크롤
  </code_block_component>

  <tip_box_component>
    - Border-radius: 8px, 패딩 16px 20px
    - 좌측 보더: 4px solid
    - 타입별 색상:
      - info: 보더 #3B82F6, bg #3B82F6/10, 아이콘 Info
      - tip: 보더 #22C55E, bg #22C55E/10, 아이콘 Lightbulb
      - warning: 보더 #F59E0B, bg #F59E0B/10, 아이콘 AlertTriangle
      - danger: 보더 #EF4444, bg #EF4444/10, 아이콘 AlertCircle
    - 제목: 15px/600, 아이콘 색상과 동일
    - 본문: 14px/400, 일반 텍스트 색상
  </tip_box_component>

  <step_by_step_component>
    - 번호 매기기 스텝 목록
    - 각 스텝: 좌측 번호 원형 (32px, #00B4D8 bg, white 텍스트)
    - 스텝 간 연결선: 2px solid #1B2838 (dark) / #E2E8F0 (light)
    - 스텝 콘텐츠: 15px/400, 마크다운 렌더링 가능
    - 완료 스텝: 번호 → 체크마크, 원형 #22C55E
    - 현재 스텝: 원형 pulse 애니메이션 (2s 주기)
  </step_by_step_component>

  <log_analyzer_demo>
    <header>
      - 제목: "서버 로그 분석기" 24px/700
      - 부제: "PoC Demo — 브라우저에서 동작하는 로그 분석 도구" 14px #94A3B8
    </header>
    <controls>
      - 파일 선택 드롭다운: 3개 샘플 로그 (syslog, app-error, access-log)
      - 또는 파일 업로드 버튼 (드래그 앤 드롭 지원, .log/.txt)
      - "분석 시작" 버튼: bg #00B4D8, 패딩 12px 24px
      - 분석 중: 버튼 로딩 스피너, 프로그레스 바 표시
    </controls>
    <results_tabs>
      - 3개 탭: 요약 | 타임라인 | 원본 로그
      - 요약 탭:
        - 통계 카드 4개 (총 라인 수, 에러 수, 이상 탐지 수, 분석 시간)
        - 심각도 분포 파이 차트 (Recharts PieChart)
        - Top 10 에러 패턴 테이블
        - 이상 탐지 결과 목록 (AnomalyReport)
      - 타임라인 탭:
        - 에러 빈도 시계열 차트 (Recharts AreaChart, 1분 단위 집계)
        - 이상 구간 하이라이트 (빨간 배경 영역)
        - 마우스 오버 시 해당 시간대 로그 툴팁
      - 원본 로그 탭:
        - 가상 스크롤 로그 뷰어 (10,000줄+ 대응)
        - 라인 번호 + 심각도 색상 코딩
        - 검색 필터: 텍스트 검색, 심각도 필터
        - 이상 라인 하이라이트 (좌측 3px 보더 #EF4444)
    </results_tabs>
  </log_analyzer_demo>

  <ops_dashboard_demo>
    <header>
      - 제목: "운영 대시보드" 24px/700
      - 부제: "PoC Demo — 실시간 시스템 모니터링 대시보드" 14px #94A3B8
      - 우측: 시뮬레이션 컨트롤 (재생/일시정지 버튼, 속도 조절 1x/2x/5x)
    </header>
    <metric_cards>
      - 4개 카드 가로 배치 (grid 4열), gap 16px
      - 각 카드: 120px 높이, border-radius 12px, 패딩 20px
        - Background: #111D2C (dark) / #F8FAFC (light)
        - 상단: 메트릭 이름 (13px/500 #94A3B8) + 아이콘 (20px)
        - 중앙: 현재 값 (32px/700) + 단위 (16px/400)
        - 하단: 미니 스파크라인 (40px 높이, Recharts LineChart)
        - 값 색상: 정상 #22C55E, 경고 #F59E0B, 위험 #EF4444
          - CPU: >80% 위험, >60% 경고
          - Memory: >85% 위험, >70% 경고
          - Disk: >90% 위험, >80% 경고
          - Network: >80% 위험, >60% 경고
    </metric_cards>
    <time_series_section>
      - 2열 그리드: CPU+Memory (좌), Disk+Network (우)
      - 각 차트: Recharts AreaChart, 5분 롤링 윈도우
      - 높이: 200px, 배경 투명
      - X축: 시간 (HH:mm:ss), Y축: % (0-100)
      - 그래디언트 채움: #00B4D8 → transparent (20% 투명도)
      - 경고/위험 임계선: 점선 (warning: #F59E0B, critical: #EF4444)
      - 1초 간격 업데이트 (requestAnimationFrame)
    </time_series_section>
    <alert_panel>
      - 우측 패널 또는 하단 영역, 최대 높이 300px 스크롤
      - 제목: "알림" + 미해결 건수 뱃지
      - 각 알림: 패딩 12px 16px
        - 좌측: 심각도 아이콘+색상 (info #3B82F6, warning #F59E0B, critical #EF4444)
        - 중앙: 서비스명 (13px/600) + 메시지 (14px/400) + 시간 (12px #94A3B8)
        - 우측: 해결 버튼 (CheckCircle 아이콘)
      - 새 알림: 슬라이드인 애니메이션 300ms ease-out
    </alert_panel>
    <service_status_grid>
      - 하단 영역, 4열 그리드
      - 각 서비스: 카드 형태, 60px 높이
        - 좌측: 상태 원형 (12px, healthy #22C55E / degraded #F59E0B / down #EF4444)
        - 중앙: 서비스명 (14px/500) + 업타임 (12px #94A3B8)
        - pulse 애니메이션: degraded/down 상태일 때 원형이 깜빡임
    </service_status_grid>
  </ops_dashboard_demo>
</pages_and_interfaces>

<core_functionality>
  <curriculum_navigation>
    - 6개 모듈, 30개 챕터 순차 탐색
    - 사이드바 아코디언으로 모듈 펼치기/접기
    - 이전/다음 챕터 버튼으로 순차 이동
    - 챕터 간 자유 이동 (사이드바 또는 모듈 페이지에서)
    - URL 기반 딥링킹 (#/module/module-04/03-anomaly-detection)
  </curriculum_navigation>

  <content_rendering>
    - 마크다운 콘텐츠를 React 컴포넌트로 렌더링
    - 커스텀 마크다운 컴포넌트 매핑:
      - ``` 코드 블록 → CodeBlock 컴포넌트 (구문 강조)
      - > [!TIP] → TipBox type="tip"
      - > [!WARNING] → TipBox type="warning"
      - > [!INFO] → TipBox type="info"
      - > [!DANGER] → TipBox type="danger"
      - 커스텀 태그 <!-- STEP_START --> ~ <!-- STEP_END --> → StepByStep
      - 커스텀 태그 <!-- DEMO:log-analyzer --> → LogAnalyzer 임베드
      - 커스텀 태그 <!-- DEMO:ops-dashboard --> → Dashboard 임베드
  </content_rendering>

  <progress_tracking>
    - LocalStorage 기반 챕터별 완료 상태 저장
    - 챕터 하단 "완료로 표시" 체크박스
    - 사이드바에 완료 챕터 체크마크 표시
    - 진도 요약: 전체 완료 %, 모듈별 완료 %
    - 브라우저 새로고침 후에도 상태 유지
  </progress_tracking>

  <log_analyzer_engine>
    - 다중 로그 포맷 파싱:
      - syslog: "MMM DD HH:MM:SS hostname service[pid]: message"
      - app log: "YYYY-MM-DD HH:MM:SS.mmm [LEVEL] [class] message"
      - access log: 'IP - - [DD/MMM/YYYY:HH:MM:SS +0000] "METHOD PATH" STATUS SIZE'
    - 정규식 기반 타임스탬프/심각도 추출
    - 이상 탐지 알고리즘:
      - Spike detection: 1분 단위 에러 카운트, 롤링 평균 대비 2-sigma 초과 시 이상
      - Pattern clustering: 에러 메시지 유사도 기반 그룹핑 (Levenshtein distance)
      - Time gap detection: 로그 공백 구간 탐지 (서비스 다운 의심)
    - 결과 생성: 통계 요약, 이상 목록, 시계열 데이터
  </log_analyzer_engine>

  <metrics_simulator>
    - 결정론적 시드 기반 난수 생성 (재현 가능)
    - 현실적 패턴 시뮬레이션:
      - CPU: 기본 20-40%, 주기적 배치 작업 스파이크 (70-95%), 가비지 컬렉션 드롭
      - Memory: 점진적 증가 패턴 (메모리 릭 시뮬레이션), 주기적 GC 드롭
      - Disk: 느린 증가, 로그 로테이션 시 급감
      - Network: 랜덤 버스트 패턴, 트래픽 피크 시간대 시뮬레이션
    - 알림 자동 생성: 임계값 초과 시 alert_history에 추가
    - setInterval 1초 간격 업데이트
    - 시뮬레이션 컨트롤: 재생/일시정지, 속도 조절 (1x/2x/5x)
  </metrics_simulator>

  <theme_switching>
    - 다크 모드 / 라이트 모드 토글
    - 최초 방문: prefers-color-scheme 미디어 쿼리로 시스템 설정 따름
    - 사용자 선택 LocalStorage 저장 (key: "ai-lecture-theme")
    - 전환 애니메이션: 200ms cross-fade
  </theme_switching>
</core_functionality>

<error_handling>
  <user_facing>
    <form_validation>
      - 로그 파일 업로드: 최대 10MB, .log/.txt만 허용
      - 잘못된 파일: "지원하지 않는 파일 형식입니다" 토스트
      - 빈 로그 파일: "로그 데이터가 없습니다" 안내 메시지
    </form_validation>
    <error_states>
      - 존재하지 않는 라우트: 404 페이지 ("페이지를 찾을 수 없습니다" + 홈으로 돌아가기)
      - 마크다운 로드 실패: "콘텐츠를 불러올 수 없습니다" 메시지 + 재시도 버튼
      - 로그 파싱 실패: "로그 형식을 인식할 수 없습니다" + 지원 형식 안내
    </error_states>
  </user_facing>
  <note>네트워크 에러 핸들링 불필요 — 100% 로컬 앱. 모든 콘텐츠는 번들에 포함.</note>
</error_handling>

<aesthetic_guidelines>
  <design_philosophy>
    산업-프로페셔널 테크 에디토리얼 디자인. 삼성 기업 환경에 어울리는 절제된 톤, 깊은 네이비 기반 컬러, 넉넉한 여백. 강의 콘텐츠 가독성을 최우선으로 하며, 데모 영역은 대시보드 특유의 데이터 밀도를 유지한다. "기술 서적을 읽는 듯한" 인쇄물 품질의 타이포그래피.
  </design_philosophy>

  <color_palette>
    <dark_theme>
      - Background Primary: #0A1628
      - Background Secondary: #0F1923
      - Surface: #111D2C
      - Surface Elevated: #1B2838
      - Border: #1B2838
      - Text Primary: #E0E1DD
      - Text Secondary: #94A3B8
      - Text Muted: #64748B
      - Accent: #00B4D8
      - Accent Hover: #22D3EE
      - Success: #22C55E
      - Warning: #F59E0B
      - Danger: #EF4444
      - Info: #3B82F6
      - Code Background: #0C1222
    </dark_theme>
    <light_theme>
      - Background Primary: #FFFFFF
      - Background Secondary: #F8FAFC
      - Surface: #F1F5F9
      - Surface Elevated: #E2E8F0
      - Border: #E2E8F0
      - Text Primary: #0D1B2A
      - Text Secondary: #415A77
      - Text Muted: #778DA9
      - Accent: #0284C7
      - Accent Hover: #0369A1
      - Success: #16A34A
      - Warning: #D97706
      - Danger: #DC2626
      - Info: #2563EB
      - Code Background: #1E293B
    </light_theme>
    <chapter_type_colors>
      - 개념(Concept): #3B82F6
      - 데모(Demo): #8B5CF6
      - 실습(Hands-on): #22C55E
      - 워크숍(Workshop): #F59E0B
    </chapter_type_colors>
  </color_palette>

  <typography>
    <font_families>
      - Primary: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
      - Monospace: "JetBrains Mono", "Fira Code", "Consolas", monospace
      - CRITICAL: 폰트 파일은 public/fonts/에 로컬 번들. CDN 사용 금지.
    </font_families>
    <font_sizes>
      - 페이지 제목: 32px / 700
      - 모듈 제목: 28px / 700
      - 섹션 제목 (h2): 22px / 600
      - 서브 제목 (h3): 18px / 600
      - 본문: 16px / 400, line-height 1.8
      - 코드: 14px / 400, line-height 1.6
      - 캡션/뱃지: 12px / 500
      - 사이드바 네비: 13px / 400-500
      - 버튼: 15px / 500
    </font_sizes>
  </typography>

  <spacing>
    - Base unit: 4px
    - Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
    - 섹션 간 간격: 48px
    - 컴포넌트 간 간격: 16-24px
    - 인라인 간격: 8-12px
  </spacing>

  <borders_and_shadows>
    <borders>
      - Default: 1px solid border color
      - Card: border-radius 8px
      - Button: border-radius 8px
      - Input: border-radius 6px
      - 코드 블록: border-radius 8px
      - 뱃지: border-radius 4px (사각) or 9999px (둥근)
    </borders>
    <shadows>
      - Card: 0 1px 3px rgba(0,0,0,0.1) (light only)
      - Dropdown: 0 4px 12px rgba(0,0,0,0.15)
      - Modal: 0 8px 32px rgba(0,0,0,0.3)
      - CRITICAL: 다크 테마에서는 그림자 대신 보더로 깊이 표현
    </shadows>
  </borders_and_shadows>

  <animations>
    - 페이지 전환: fade-in 200ms ease-out
    - 사이드바 아코디언: height 200ms ease-in-out
    - 탭 전환: slide + fade 150ms
    - 호버 효과: background 150ms ease
    - 프로그레스 바 채움: width 300ms ease-out
    - 대시보드 메트릭 업데이트: 숫자 카운트업 300ms
    - 알림 슬라이드인: translateY 300ms ease-out
    - 코드 복사 피드백: opacity 150ms
    - 차트 데이터 업데이트: 애니메이션 비활성화 (성능 우선)
  </animations>

  <responsive_design>
    <breakpoints>
      - tablet: 768-1023px (사이드바 접기 가능, 오버레이 모드)
      - desktop: 1024px+ (전체 레이아웃: 사이드바 + 메인)
    </breakpoints>
    <tablet_adaptations>
      - 사이드바: 기본 숨김, 햄버거 메뉴로 오버레이 표시 (280px, backdrop 포함)
      - 대시보드 메트릭 카드: 2열 그리드 → 2x2
      - 시계열 차트: 2열 → 1열 스택
      - 메인 패딩: 24px
    </tablet_adaptations>
  </responsive_design>

  <icons>
    - Library: Lucide React v0.468
    - Default size: 20px
    - Stroke width: 1.5px
    - 모듈 아이콘:
      - Module 1: Zap (AI 패러다임)
      - Module 2: Puzzle (하네스 이해)
      - Module 3: Wrench (도구 제작)
      - Module 4: FileSearch (로그 분석기)
      - Module 5: LayoutDashboard (대시보드)
      - Module 6: Rocket (고급 패턴)
  </icons>

  <accessibility>
    - 모든 인터랙티브 요소에 포커스 표시 (outline 2px solid #00B4D8, offset 2px)
    - 색상 대비 WCAG AA 준수 (최소 4.5:1 텍스트, 3:1 UI)
    - 코드 블록: aria-label="코드 블록: [언어]"
    - 사이드바 아코디언: aria-expanded 속성
    - 키보드 네비게이션: Tab으로 모든 요소 접근 가능
  </accessibility>
</aesthetic_guidelines>

<security_considerations>
  <data_protection>
    - 모든 데이터 로컬 저장 (LocalStorage). 서버 전송 없음
    - 분석, 트래킹, 외부 요청 없음
    - 업로드된 로그 파일: 브라우저 메모리에서만 처리, 저장 안 함
    - CRITICAL: fetch(), XMLHttpRequest, WebSocket 등 외부 통신 코드 절대 금지
  </data_protection>
  <input_validation>
    - 로그 파일 업로드: 최대 10MB, .log/.txt 확장자만 허용
    - 파일 내용: 텍스트 인코딩 검증 (UTF-8)
    - XSS 방지: 마크다운 렌더링 시 HTML 태그 스트립
  </input_validation>
</security_considerations>

<advanced_functionality>
  <offline_capability>
    - 최초 npm install + npm run dev 후 완전 오프라인 동작
    - 모든 폰트, 아이콘, 콘텐츠 로컬 번들
    - Service Worker 불필요 (dev server가 로컬이므로)
  </offline_capability>

  <print_friendly>
    - Ctrl+P로 인쇄 시 깨끗한 레이아웃
    - @media print: 사이드바 숨김, 헤더 간소화, 코드 블록 배경 유지
    - 오프라인 강의 시 챕터별 인쇄 가능
  </print_friendly>
</advanced_functionality>

<final_integration_test>
  <test_scenario_1>
    <description>커리큘럼 탐색 및 진도 추적</description>
    <steps>
      1. npm run dev 실행 → 브라우저에서 localhost 접속
      2. 첫 화면: Module 1 랜딩 페이지 로드 확인
      3. 사이드바에서 Module 1 펼치기 → 4개 챕터 표시 확인
      4. "1.1 AI가 바꾸는 개발자의 일상" 클릭 → 마크다운 콘텐츠 렌더링 확인
      5. 코드 블록 구문 강조 확인, 복사 버튼 동작 확인
      6. "완료로 표시" 체크 → 사이드바 체크마크 표시 확인
      7. "다음: Claude Code 기초" 버튼 클릭 → 1.2 챕터 이동 확인
      8. 브라우저 새로고침 → 1.1 완료 상태 유지 확인
      9. 사이드바 하단 진도 바 업데이트 확인
      10. Module 4 클릭 → 모듈 랜딩 페이지에서 6개 챕터 카드 확인
    </steps>
  </test_scenario_1>

  <test_scenario_2>
    <description>서버 로그 분석기 PoC 데모</description>
    <steps>
      1. Module 4 > "4.2 로그 파싱 엔진 설계" 챕터 이동
      2. 콘텐츠 내 임베드된 LogAnalyzer 데모 표시 확인
      3. 드롭다운에서 "syslog-sample.log" 선택
      4. "분석 시작" 클릭 → 프로그레스 바 표시
      5. 요약 탭: 통계 카드 4개 + 심각도 파이 차트 + Top 10 에러 패턴 확인
      6. 타임라인 탭: 시계열 차트에 에러 빈도 표시 + 이상 구간 하이라이트 확인
      7. 원본 로그 탭: 라인 번호 + 심각도 색상 코딩 확인
      8. 검색 필터에 "ERROR" 입력 → 필터링 동작 확인
      9. 별도 라우트 /demo/log-analyzer에서도 풀 페이지 데모 동작 확인
      10. 네트워크 탭 확인: localhost 외 외부 요청 없음
    </steps>
  </test_scenario_2>

  <test_scenario_3>
    <description>운영 대시보드 PoC 데모</description>
    <steps>
      1. /demo/ops-dashboard 라우트 접속
      2. 4개 메트릭 카드 표시 확인 (CPU, Memory, Disk, Network)
      3. 1초 간격으로 메트릭 값 업데이트 확인 (숫자 변동)
      4. 시계열 차트 실시간 업데이트 확인
      5. CPU 80% 초과 시 메트릭 카드 색상 변경 (경고/위험) 확인
      6. 알림 패널에 새 알림 슬라이드인 확인
      7. 알림 "해결" 버튼 클릭 → 알림 resolved 상태 변경 확인
      8. 서비스 상태 그리드: 상태 원형 색상 확인
      9. 시뮬레이션 일시정지 → 모든 업데이트 중지 확인
      10. 속도 5x로 변경 → 빠른 업데이트 확인
    </steps>
  </test_scenario_3>

  <test_scenario_4>
    <description>다크 모드 및 반응형</description>
    <steps>
      1. 라이트 모드에서 전체 페이지 색상 확인
      2. 다크 모드 토글 → 배경, 텍스트, 코드 블록 색상 전환 확인
      3. 코드 블록: 다크/라이트 모두에서 가독성 확인
      4. 대시보드 차트: 다크 모드에서 레이블/축 가독성 확인
      5. 브라우저 새로고침 → 테마 설정 유지 확인
      6. 브라우저 너비 768px으로 줄임 → 사이드바 자동 숨김 확인
      7. 햄버거 메뉴 클릭 → 사이드바 오버레이 표시 확인
      8. 대시보드 메트릭 카드: 2x2 그리드로 변경 확인
    </steps>
  </test_scenario_4>
</final_integration_test>

<success_criteria>
  <functionality>
    - 6개 모듈 30개 챕터 모든 콘텐츠 정상 렌더링
    - 사이드바 네비게이션, 이전/다음 버튼, URL 딥링킹 모두 동작
    - 코드 블록 구문 강조 (TypeScript, Python, Bash, YAML, XML)
    - 로그 분석기: 3종 로그 파싱, 이상 탐지, 시각화 모두 동작
    - 운영 대시보드: 실시간 메트릭, 차트, 알림 모두 동작
    - 진도 추적: 완료 표시, 진도 %, 새로고침 후 유지
    - 다크/라이트 모드 토글 및 설정 유지
  </functionality>
  <user_experience>
    - 초기 로드: 3초 이내 (로컬 dev server 기준)
    - 챕터 전환: 200ms 이내
    - 대시보드 메트릭 업데이트: 60fps 유지
    - 로그 분석 (1만 줄 기준): 2초 이내
    - 모든 텍스트 한국어, 전문 용어 일관성 유지
  </user_experience>
  <technical_quality>
    - TypeScript strict mode 에러 0건
    - 브라우저 콘솔 에러/경고 0건
    - 외부 네트워크 요청 0건 (100% 로컬)
    - 반응형: 768px+ 정상 동작
  </technical_quality>
  <build>
    - npm run dev: 정상 실행
    - npm run build: dist/ 정적 파일 생성
    - Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ 호환
  </build>
</success_criteria>

<build_output>
  <build_command>npm run build</build_command>
  <output_directory>out/</output_directory>
  <contents>정적 HTML 파일 (라우트별) + JS/CSS 번들 + fonts/ + sample-data/, 모든 로컬 정적 파일 포함</contents>
  <note>out/ 폴더를 임의의 HTTP 서버에서 서빙 가능 (python -m http.server, nginx 등). Next.js static export (output: 'export') 사용.</note>
</build_output>

<key_implementation_notes>
  <critical_paths>
    1. 마크다운 콘텐츠 렌더링 + 커스텀 컴포넌트 매핑 — 전체 강의 플랫폼의 기반
    2. 로그 파싱 엔진 — PoC 1의 핵심, 다양한 로그 포맷 대응 필요
    3. 메트릭 시뮬레이터 — PoC 2의 핵심, 현실적 패턴 생성이 데모 품질 좌우
    4. 사이드바 네비게이션 + 라우팅 — 학습 경험의 근간
  </critical_paths>

  <recommended_implementation_order>
    1. 프로젝트 셋업 (Next.js + React + TypeScript + Tailwind)
    2. 로컬 폰트 번들링 (Pretendard + JetBrains Mono)
    3. AppShell 레이아웃 (Header + Sidebar + Main Panel)
    4. 라우팅 설정 (Next.js App Router, 파일 기반)
    5. 커리큘럼 데이터 구조 (curriculum.ts)
    6. 마크다운 렌더링 (react-markdown + 커스텀 컴포넌트)
    7. CodeBlock 컴포넌트 (prism-react-renderer)
    8. TipBox, StepByStep 강의용 컴포넌트
    9. 사이드바 아코디언 네비게이션
    10. 챕터 뷰 + 이전/다음 네비게이션
    11. 진도 추적 (LocalStorage)
    12. 다크 모드 토글
    13. PoC 1: 로그 파싱 엔진 + 샘플 데이터
    14. PoC 1: LogAnalyzer UI (뷰어, 차트, 리포트)
    15. PoC 2: 메트릭 시뮬레이터
    16. PoC 2: Dashboard UI (카드, 차트, 알림, 상태)
    17. 마크다운 콘텐츠 작성 (Module 1-6)
    18. 반응형 디자인 (태블릿 적응)
    19. 인쇄 스타일
    20. 최종 테스트 및 폴리싱
  </recommended_implementation_order>

  <content_authoring_guide>
    - 마크다운 파일은 src/content/module-NN/ 디렉토리에 저장
    - 파일명: 순번-kebab-case.md (예: 01-what-is-ai-dev.md)
    - 커스텀 컴포넌트 삽입 마크다운 문법:
      - TipBox: > [!TIP] / > [!WARNING] / > [!INFO] / > [!DANGER]
      - 데모 삽입: &lt;!-- DEMO:log-analyzer --&gt; 또는 &lt;!-- DEMO:ops-dashboard --&gt;
      - StepByStep: &lt;!-- STEP_START --&gt; ~ &lt;!-- STEP_END --&gt;
    - 코드 블록: ```typescript / ```python / ```bash / ```yaml 등 언어 지정 필수
    - 이미지: public/ 디렉토리에 저장, 마크다운에서 상대 경로 참조
  </content_authoring_guide>

  <harness_integration>
    - 하네스 에이전트/스킬은 .claude/ 디렉토리에 정의
    - lecture-orchestrator 스킬이 전체 빌드 프로세스 조율
    - 에이전트 5명: curriculum-designer, content-writer, demo-builder, ui-designer, reviewer
    - 스킬 4개: lecture-orchestrator, module-writer, demo-scaffold, review-check
    - Agent Team 모드, Pipeline + Fan-out/Fan-in 복합 패턴
  </harness_integration>
</key_implementation_notes>

</project_specification>
```
