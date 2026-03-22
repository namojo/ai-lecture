# Gemini CLI 스캐폴딩

## 학습 목표

- Gemini CLI를 사용해 React 컴포넌트를 스캐폴딩할 수 있다
- Claude Code와 Gemini CLI의 접근 방식 차이를 이해한다
- 도구별 강점을 활용한 효율적인 개발 전략을 수립할 수 있다

## Gemini CLI로 컴포넌트 생성

Gemini CLI에 대시보드 컴포넌트 생성을 요청합니다:

```bash
gemini "React + TypeScript로 운영 대시보드 MetricCard 컴포넌트를 만들어줘.
props: name(cpu|memory|disk|network), value(number), history(배열)
Recharts의 AreaChart로 미니 스파크라인을 포함해줘.
Tailwind CSS를 사용하고, 다크 테마 기준으로 스타일링."
```

> [!TIP] 프롬프트 구조화
> Gemini CLI에도 구조화된 프롬프트가 효과적입니다. **무엇을**(MetricCard), **어떤 기술로**(React + TypeScript + Recharts), **어떤 스타일로**(Tailwind, 다크 테마) 명확히 지정합니다.

## Gemini CLI의 코드 생성 특징

| 측면 | Gemini CLI | Claude Code |
|------|-----------|-------------|
| 파일 접근 | 제한적 (수동 붙여넣기) | 프로젝트 전체 자동 탐색 |
| 컨텍스트 | 대화 기반 | 파일 시스템 기반 |
| 코드 실행 | 불가 | 터미널 명령 실행 가능 |
| 강점 | 빠른 코드 생성, 설명 풍부 | 기존 코드 맥락 이해 |

## 스캐폴딩 결과물 검증

Gemini CLI가 생성한 코드를 프로젝트에 적용할 때:

```bash
# 1. Gemini 출력을 파일로 저장
# 2. 기존 프로젝트 패턴에 맞게 조정
# 3. import 경로 수정
# 4. 타입 호환성 확인
```

> [!WARNING] 직접 붙여넣기 주의
> Gemini CLI는 프로젝트의 기존 코드를 모르므로, 생성된 코드의 import 경로와 타입이 프로젝트와 맞지 않을 수 있습니다. 반드시 조정이 필요합니다.

## 하이브리드 접근법

실전에서는 두 도구를 함께 사용합니다:

1. **Gemini CLI**: 새 컴포넌트의 초기 구조 빠르게 생성
2. **Claude Code**: 프로젝트에 통합, 기존 패턴에 맞게 수정
3. **Gemini CLI**: 알고리즘이나 로직 질문/탐구
4. **Claude Code**: 최종 테스트 및 빌드 검증

> [!INFO] 도구는 수단
> 어떤 AI 도구를 사용하느냐보다 **어떻게 요청하느냐**가 더 중요합니다. 좋은 프롬프트는 어떤 도구에서든 좋은 결과를 만듭니다.

## 요약

- Gemini CLI는 빠른 코드 생성과 풍부한 설명이 강점
- Claude Code는 프로젝트 컨텍스트 이해와 직접 수정이 강점
- 실전에서는 두 도구의 장점을 조합하는 하이브리드 접근이 효과적
