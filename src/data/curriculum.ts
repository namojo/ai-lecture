import type { Module } from "@/types/curriculum";

export const modules: Module[] = [
  {
    id: "module-01",
    title: "AI 기반 개발의 새로운 패러다임",
    description: "AI가 개발자의 일상을 어떻게 바꾸는지, Claude Code와 Gemini CLI의 기본 사용법을 학습합니다.",
    icon: "Sparkles",
    estimatedMinutes: 85,
    chapters: [
      { id: "01-what-is-ai-dev", moduleId: "module-01", title: "AI가 바꾸는 개발자의 일상", type: "concept", contentPath: "module-01/01-what-is-ai-dev.md", estimatedMinutes: 15, order: 1 },
      { id: "02-claude-code-basics", moduleId: "module-01", title: "Claude Code: 설치부터 첫 대화까지", type: "concept", contentPath: "module-01/02-claude-code-basics.md", estimatedMinutes: 20, order: 2 },
      { id: "03-gemini-cli-basics", moduleId: "module-01", title: "Gemini CLI: 설치부터 첫 대화까지", type: "concept", contentPath: "module-01/03-gemini-cli-basics.md", estimatedMinutes: 20, order: 3 },
      { id: "04-hands-on-first-automation", moduleId: "module-01", title: "실습: 첫 자동화 스크립트 만들기", type: "hands-on", contentPath: "module-01/04-hands-on-first-automation.md", estimatedMinutes: 30, order: 4 },
    ],
  },
  {
    id: "module-02",
    title: "하네스 시스템의 이해",
    description: "에이전트, 스킬, 오케스트레이터의 개념과 아키텍처 패턴을 학습합니다.",
    icon: "Cpu",
    estimatedMinutes: 125,
    chapters: [
      { id: "01-what-is-harness", moduleId: "module-02", title: "하네스란 무엇인가: 에이전트, 스킬, 오케스트레이터", type: "concept", contentPath: "module-02/01-what-is-harness.md", estimatedMinutes: 20, order: 1 },
      { id: "02-agent-anatomy", moduleId: "module-02", title: "에이전트 정의 파일 해부", type: "concept", contentPath: "module-02/02-agent-anatomy.md", estimatedMinutes: 20, order: 2 },
      { id: "03-skill-anatomy", moduleId: "module-02", title: "스킬 파일 해부", type: "concept", contentPath: "module-02/03-skill-anatomy.md", estimatedMinutes: 20, order: 3 },
      { id: "04-architecture-patterns", moduleId: "module-02", title: "아키텍처 패턴: 파이프라인에서 계층 위임까지", type: "concept", contentPath: "module-02/04-architecture-patterns.md", estimatedMinutes: 25, order: 4 },
      { id: "05-hands-on-first-skill", moduleId: "module-02", title: "실습: 첫 커스텀 스킬 만들기", type: "hands-on", contentPath: "module-02/05-hands-on-first-skill.md", estimatedMinutes: 40, order: 5 },
    ],
  },
  {
    id: "module-03",
    title: "실전 도구 만들기",
    description: "프로젝트 스펙 작성, 팀 구성, 오케스트레이터 설계 방법을 학습합니다.",
    icon: "Wrench",
    estimatedMinutes: 115,
    chapters: [
      { id: "01-project-spec-writing", moduleId: "module-03", title: "프로젝트 스펙 작성 방법론", type: "concept", contentPath: "module-03/01-project-spec-writing.md", estimatedMinutes: 25, order: 1 },
      { id: "02-team-composition", moduleId: "module-03", title: "에이전트 팀 구성 전략", type: "concept", contentPath: "module-03/02-team-composition.md", estimatedMinutes: 20, order: 2 },
      { id: "03-orchestrator-design", moduleId: "module-03", title: "오케스트레이터 설계와 데이터 흐름", type: "concept", contentPath: "module-03/03-orchestrator-design.md", estimatedMinutes: 25, order: 3 },
      { id: "04-hands-on-code-review-tool", moduleId: "module-03", title: "실습: 2-에이전트 코드 리뷰 도구", type: "hands-on", contentPath: "module-03/04-hands-on-code-review-tool.md", estimatedMinutes: 45, order: 4 },
    ],
  },
  {
    id: "module-04",
    title: "PoC 1 - 서버 로그 분석기",
    description: "로그 파싱, 이상 탐지, 시각화까지 AI 도구로 분석 파이프라인을 구축합니다.",
    icon: "FileSearch",
    estimatedMinutes: 180,
    chapters: [
      { id: "01-requirements-analysis", moduleId: "module-04", title: "요구사항 분석", type: "concept", contentPath: "module-04/01-requirements-analysis.md", estimatedMinutes: 15, order: 1 },
      { id: "02-log-parsing-engine", moduleId: "module-04", title: "로그 파싱 엔진 설계", type: "demo", contentPath: "module-04/02-log-parsing-engine.md", estimatedMinutes: 25, order: 2 },
      { id: "03-anomaly-detection", moduleId: "module-04", title: "이상 탐지 알고리즘", type: "demo", contentPath: "module-04/03-anomaly-detection.md", estimatedMinutes: 30, order: 3 },
      { id: "04-report-visualization", moduleId: "module-04", title: "리포트 생성과 시각화", type: "demo", contentPath: "module-04/04-report-visualization.md", estimatedMinutes: 25, order: 4 },
      { id: "05-hands-on-extend-analyzer", moduleId: "module-04", title: "실습: 분석기 확장하기", type: "hands-on", contentPath: "module-04/05-hands-on-extend-analyzer.md", estimatedMinutes: 45, order: 5 },
      { id: "06-harness-pipeline-automation", moduleId: "module-04", title: "하네스 파이프라인 자동화", type: "demo", contentPath: "module-04/06-harness-pipeline-automation.md", estimatedMinutes: 40, order: 6 },
    ],
  },
  {
    id: "module-05",
    title: "PoC 2 - 운영 대시보드",
    description: "실시간 메트릭 시뮬레이션, 차트, 알림 시스템을 갖춘 대시보드를 구축합니다.",
    icon: "LayoutDashboard",
    estimatedMinutes: 155,
    chapters: [
      { id: "01-dashboard-design", moduleId: "module-05", title: "대시보드 설계", type: "concept", contentPath: "module-05/01-dashboard-design.md", estimatedMinutes: 15, order: 1 },
      { id: "02-gemini-cli-scaffolding", moduleId: "module-05", title: "Gemini CLI 스캐폴딩", type: "demo", contentPath: "module-05/02-gemini-cli-scaffolding.md", estimatedMinutes: 25, order: 2 },
      { id: "03-metrics-simulation", moduleId: "module-05", title: "실시간 메트릭 시뮬레이션", type: "demo", contentPath: "module-05/03-metrics-simulation.md", estimatedMinutes: 25, order: 3 },
      { id: "04-charts-and-alerts", moduleId: "module-05", title: "차트와 알림 시스템", type: "demo", contentPath: "module-05/04-charts-and-alerts.md", estimatedMinutes: 30, order: 4 },
      { id: "05-hands-on-custom-panel", moduleId: "module-05", title: "실습: 커스텀 메트릭 패널", type: "hands-on", contentPath: "module-05/05-hands-on-custom-panel.md", estimatedMinutes: 40, order: 5 },
      { id: "06-claude-vs-gemini", moduleId: "module-05", title: "Claude Code vs Gemini CLI 비교", type: "concept", contentPath: "module-05/06-claude-vs-gemini.md", estimatedMinutes: 20, order: 6 },
    ],
  },
  {
    id: "module-06",
    title: "고급 패턴과 실전 적용",
    description: "복합 패턴, 에러 처리, 폐쇄망 전략 등 실전에서 필요한 고급 기법을 학습합니다.",
    icon: "GraduationCap",
    estimatedMinutes: 120,
    chapters: [
      { id: "01-composite-patterns", moduleId: "module-06", title: "복합 패턴: 실전 하네스 조합", type: "concept", contentPath: "module-06/01-composite-patterns.md", estimatedMinutes: 20, order: 1 },
      { id: "02-error-handling-quality", moduleId: "module-06", title: "에러 처리와 품질 보증 패턴", type: "concept", contentPath: "module-06/02-error-handling-quality.md", estimatedMinutes: 25, order: 2 },
      { id: "03-airgap-strategy", moduleId: "module-06", title: "폐쇄망 환경 전략", type: "concept", contentPath: "module-06/03-airgap-strategy.md", estimatedMinutes: 20, order: 3 },
      { id: "04-workshop-samsung-scenarios", moduleId: "module-06", title: "워크숍: 삼성 시나리오 적용 설계", type: "workshop", contentPath: "module-06/04-workshop-samsung-scenarios.md", estimatedMinutes: 40, order: 4 },
      { id: "05-roadmap-next-steps", moduleId: "module-06", title: "다음 단계: 하네스 에코시스템 로드맵", type: "concept", contentPath: "module-06/05-roadmap-next-steps.md", estimatedMinutes: 15, order: 5 },
    ],
  },
];

export function getModule(moduleId: string): Module | undefined {
  return modules.find((m) => m.id === moduleId);
}

export function getChapter(moduleId: string, chapterId: string) {
  const mod = getModule(moduleId);
  return mod?.chapters.find((c) => c.id === chapterId);
}

export function getAdjacentChapters(moduleId: string, chapterId: string) {
  const allChapters = modules.flatMap((m) =>
    m.chapters.map((c) => ({ ...c, moduleId: m.id }))
  );
  const idx = allChapters.findIndex(
    (c) => c.moduleId === moduleId && c.id === chapterId
  );
  return {
    prev: idx > 0 ? allChapters[idx - 1] : null,
    next: idx < allChapters.length - 1 ? allChapters[idx + 1] : null,
  };
}
