# Claude Code: 설치부터 첫 대화까지

## 학습 목표

이 챕터를 완료하면 다음을 수행할 수 있습니다:

- Claude Code를 로컬 환경에 설치하고 초기 설정하기
- 기본 CLI 명령어를 사용하여 코드 생성 및 편집하기
- 프로젝트 컨텍스트를 활용한 효과적인 대화 방법 익히기

## Claude Code 설치

### 사전 요구사항

| 항목 | 최소 요구사항 |
|------|-------------|
| Node.js | v18 이상 |
| npm | v9 이상 |
| OS | macOS, Linux, Windows (WSL2) |
| 터미널 | bash, zsh 권장 |

### 설치 명령어

```bash
# npm을 통한 전역 설치
npm install -g @anthropic-ai/claude-code

# 설치 확인
claude --version
```

> [!WARNING] 폐쇄망 환경 주의
> 삼성 사내 폐쇄망에서는 npm registry 접근이 제한될 수 있습니다. 사전에 배포된 오프라인 패키지를 사용하거나, 사내 npm mirror를 설정하세요.

### 초기 인증 설정

```bash
# Claude Code 시작 (최초 실행 시 인증 진행)
claude

# API 키를 직접 설정하는 경우
export ANTHROPIC_API_KEY="sk-ant-..."
```

## 기본 CLI 명령어

### 대화형 모드 vs 단일 명령 모드

```bash
# 대화형 모드: 지속적인 대화가 가능
claude

# 단일 명령 모드: 한 번의 요청만 처리
claude -p "이 프로젝트의 디렉토리 구조를 설명해줘"

# 파이프를 활용한 입력
cat error.log | claude -p "이 에러 로그의 원인을 분석해줘"
```

> [!TIP] 실무 활용 팁
> 단일 명령 모드(`-p`)는 CI/CD 파이프라인이나 셸 스크립트에서 자동화할 때 유용합니다. 대화형 모드는 복잡한 리팩토링 작업에 적합합니다.

### 주요 슬래시 명령어

대화형 모드에서 사용할 수 있는 핵심 명령어입니다:

| 명령어 | 설명 | 사용 예시 |
|--------|------|----------|
| `/help` | 도움말 표시 | 사용 가능한 명령어 확인 |
| `/clear` | 대화 초기화 | 컨텍스트 리셋이 필요할 때 |
| `/compact` | 대화 요약 | 토큰 절약을 위한 컨텍스트 압축 |
| `/cost` | 비용 확인 | 현재 세션의 API 사용량 확인 |
| `/model` | 모델 변경 | 다른 Claude 모델로 전환 |

## 첫 대화: 프로젝트 이해시키기

Claude Code는 실행된 디렉토리의 파일 구조를 자동으로 인식합니다. Spring Boot 프로젝트에서 시작해보겠습니다.

```bash
# 프로젝트 루트에서 Claude Code 시작
cd ~/projects/my-spring-app
claude
```

대화형 모드에서 다음과 같이 요청해봅니다:

```
> 이 프로젝트의 구조를 분석하고, 주요 엔드포인트를 정리해줘
```

Claude Code는 `pom.xml`, `build.gradle`, 소스 코드를 자동으로 읽고 분석합니다.

## 파일 편집 기능 활용

Claude Code의 핵심 강점은 **직접 파일을 생성하고 수정**할 수 있다는 점입니다.

### 예시: REST Controller 생성

```
> UserController를 만들어줘. GET /api/users로 사용자 목록을 반환하는 엔드포인트가 필요해.
> JPA Repository 패턴을 사용하고, DTO로 변환해서 응답해줘.
```

Claude Code가 생성하는 코드 예시:

```typescript
// 참고: Spring Boot(Java) 외에 TypeScript 프로젝트에서도 동일하게 동작합니다
interface UserResponse {
  id: number;
  name: string;
  email: string;
  department: string;
}

async function getUsers(): Promise<UserResponse[]> {
  const response = await fetch('/api/users');
  return response.json();
}
```

> [!INFO] 파일 변경 승인
> Claude Code가 파일을 수정할 때는 반드시 diff를 보여주고 사용자의 승인을 요청합니다. `y`(승인), `n`(거절), 또는 추가 지시를 입력할 수 있습니다. 실수로 승인한 경우 `git checkout`으로 복원 가능합니다.

## CLAUDE.md로 프로젝트 규칙 설정

프로젝트 루트에 `CLAUDE.md` 파일을 생성하면 Claude Code가 매번 해당 규칙을 따릅니다.

```markdown
# CLAUDE.md 예시

## 코딩 컨벤션
- Java 17 + Spring Boot 3.2 사용
- 클래스명은 PascalCase, 메서드명은 camelCase
- 모든 public 메서드에 Javadoc 작성

## 프로젝트 구조
- controller/ : REST API 엔드포인트
- service/ : 비즈니스 로직
- repository/ : 데이터 접근 계층

## 테스트
- 단위 테스트는 JUnit 5 + Mockito 사용
- 테스트 커버리지 80% 이상 유지
```

> [!TIP] 삼성 프로젝트 활용
> `CLAUDE.md`에 사내 코딩 표준, 보안 규칙, 네이밍 컨벤션을 명시하면 Claude Code가 처음부터 규칙을 준수하는 코드를 생성합니다. 팀 전체가 동일한 파일을 공유하면 일관성을 유지할 수 있습니다.

## 정리

| 기능 | 명령어/방법 | 핵심 포인트 |
|------|-----------|------------|
| 설치 | `npm install -g @anthropic-ai/claude-code` | Node.js 18+ 필수 |
| 대화 시작 | `claude` | 프로젝트 루트에서 실행 |
| 단일 질문 | `claude -p "질문"` | 자동화에 활용 |
| 프로젝트 규칙 | `CLAUDE.md` 파일 생성 | 팀 컨벤션 공유 |
| 파일 편집 | 대화로 요청 | diff 확인 후 승인 |
