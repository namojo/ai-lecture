# 프로젝트 스펙 작성 방법론

## 학습 목표

이 챕터를 완료하면 다음을 수행할 수 있습니다:

- XML 구조의 프로젝트 스펙을 체계적으로 작성하기
- AI 에이전트가 정확히 이해할 수 있는 명세서 구성하기
- 좋은 스펙과 나쁜 스펙의 차이를 구별하기

## 왜 스펙이 중요한가?

AI 에이전트에게 코드를 생성시킬 때, **프롬프트의 품질이 결과물의 품질을 결정**합니다. 1~2줄의 자연어 지시는 간단한 함수에는 적합하지만, 실무 프로젝트 수준의 작업에는 구조화된 스펙 문서가 필요합니다.

> [!TIP] 핵심 원칙
> "스펙 작성에 30분을 투자하면, 에이전트와의 수정 반복을 3시간 줄일 수 있다." 선행 투자가 전체 생산성을 결정합니다.

## XML 스펙 템플릿

AI 에이전트는 XML 태그로 구조화된 입력을 자연어보다 훨씬 정확하게 파싱합니다. 다음은 프로젝트 스펙의 표준 템플릿입니다:

```xml
<project-spec>
  <overview>
    <name>MES 로그 분석 대시보드</name>
    <purpose>생산라인 로그를 실시간 집계하여 이상 패턴을 시각화</purpose>
    <target-users>생산기술팀 엔지니어</target-users>
  </overview>

  <tech-stack>
    <runtime>Node.js 20 LTS</runtime>
    <framework>Next.js 14 (App Router)</framework>
    <database>SQLite (폐쇄망 로컬 전용)</database>
    <styling>Tailwind CSS + shadcn/ui</styling>
  </tech-stack>

  <file-structure>
    src/
      app/
        page.tsx          -- 대시보드 메인
        api/logs/route.ts -- 로그 수집 API
      lib/
        parser.ts         -- 로그 파서
        anomaly.ts        -- 이상 탐지 로직
      types/
        index.ts          -- 공유 타입 정의
  </file-structure>

  <data-models>
    <model name="LogEntry">
      id: string (UUID)
      timestamp: Date
      severity: 'INFO' | 'WARN' | 'ERROR' | 'FATAL'
      source: string (설비 코드)
      message: string
    </model>
  </data-models>

  <requirements>
    <functional>
      - 최근 24시간 로그를 시간대별 그룹으로 표시
      - ERROR 이상 로그가 평균의 2배 초과 시 경고 배너 표시
      - 설비 코드별 필터링 지원
    </functional>
    <constraints>
      - 외부 네트워크 접근 불가 (폐쇄망)
      - 모든 의존성은 로컬에 사전 설치
      - 단일 서버, 동시 사용자 최대 10명
    </constraints>
  </requirements>
</project-spec>
```

## 좋은 스펙 vs 나쁜 스펙

| 항목 | 나쁜 스펙 | 좋은 스펙 |
|------|----------|----------|
| 범위 | "로그 분석 도구 만들어줘" | 위 XML처럼 목적, 사용자, 기능 요구사항 명시 |
| 기술 스택 | "적절한 기술로" | 런타임, 프레임워크, DB 버전까지 지정 |
| 데이터 모델 | 언급 없음 | 필드명, 타입, 제약조건 명시 |
| 제약사항 | 언급 없음 | 네트워크, 환경, 성능 조건 명시 |
| 파일 구조 | "알아서 구성해줘" | 디렉토리와 파일별 역할 정의 |

> [!WARNING] 흔한 실수
> 기술 스택을 지정하지 않으면 에이전트가 임의로 선택합니다. 삼성 폐쇄망 환경에서 사용할 수 없는 클라우드 서비스나 최신 패키지를 선택할 수 있으므로, **사용 가능한 기술을 반드시 명시**하세요.

## 스펙 작성 체크리스트

스펙을 에이전트에 전달하기 전에 다음 항목을 점검하세요:

1. **프로젝트 목적**이 한 문장으로 명확한가?
2. **기술 스택**의 각 항목에 버전이 포함되어 있는가?
3. **파일 구조**가 최소 2단계 깊이로 정의되어 있는가?
4. **데이터 모델**에 필드 타입과 관계가 명시되어 있는가?
5. **제약사항**(네트워크, 보안, 성능)이 빠짐없이 기술되어 있는가?
6. **기능 요구사항**이 검증 가능한 형태로 작성되어 있는가?

## 실무 팁: 점진적 스펙 확장

처음부터 완벽한 스펙을 작성할 필요는 없습니다. 다음과 같이 **3단계로 확장**하는 것이 효과적입니다:

```
1단계: overview + tech-stack     → 프로젝트 골격 생성
2단계: + file-structure + models → 상세 구조 확정
3단계: + requirements            → 기능 구현 시작
```

> [!INFO] 다음 챕터 미리보기
> 다음 챕터에서는 작성한 스펙을 기반으로 여러 에이전트에게 역할을 분배하는 **팀 구성 전략**을 학습합니다.

## 요약

- AI 에이전트에게 복잡한 작업을 맡길 때는 **XML 구조의 프로젝트 스펙**이 필수
- 스펙에는 overview, tech-stack, file-structure, data-models, requirements를 포함
- 기술 스택 버전, 폐쇄망 제약사항 등 **환경 조건을 반드시 명시**
- 점진적 확장 방식으로 스펙을 단계별로 발전시키는 것이 효율적
