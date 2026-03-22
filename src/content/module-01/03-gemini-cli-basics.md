# Gemini CLI: 설치부터 첫 대화까지

## 학습 목표

이 챕터를 완료하면 다음을 수행할 수 있습니다:

- Gemini CLI를 설치하고 기본 환경을 구성하기
- 주요 CLI 명령어로 코드 생성 및 분석하기
- Claude Code와의 차이점을 이해하고 상황에 맞게 선택하기

## Gemini CLI 설치

### 사전 요구사항

| 항목 | 최소 요구사항 |
|------|-------------|
| Node.js | v18 이상 |
| npm | v9 이상 |
| OS | macOS, Linux, Windows |
| Google 계정 | Gemini API 접근용 |

### 설치 명령어

```bash
# npm을 통한 전역 설치
npm install -g @anthropic-ai/gemini-cli

# 설치 확인
gemini --version

# 또는 npx로 설치 없이 바로 실행
npx @anthropic-ai/gemini-cli
```

> [!WARNING] API 키 관리
> Google AI Studio에서 API 키를 발급받아야 합니다. 키는 환경 변수로 관리하고, 절대 소스 코드에 하드코딩하지 마세요. 폐쇄망에서는 사전 배포된 키 설정을 따릅니다.

### 인증 설정

```bash
# 환경 변수로 API 키 설정
export GEMINI_API_KEY="your-api-key-here"

# 또는 Google Cloud 인증 사용
gcloud auth application-default login
```

## 기본 명령어 사용법

### 대화형 모드

```bash
# Gemini CLI 대화형 모드 시작
gemini

# 프로젝트 디렉토리에서 시작 (컨텍스트 자동 인식)
cd ~/projects/my-spring-app
gemini
```

### 단일 명령 모드

```bash
# 한 번의 질문으로 빠르게 답변 받기
gemini -p "Java에서 Optional을 활용한 null-safe 패턴을 보여줘"

# 파일을 컨텍스트로 전달
gemini -p "이 코드를 리뷰해줘" < src/main/java/UserService.java

# 여러 파일을 한꺼번에 분석
cat src/**/*.java | gemini -p "이 프로젝트에서 N+1 쿼리 문제가 있는지 확인해줘"
```

> [!TIP] 대용량 컨텍스트 활용
> Gemini는 긴 컨텍스트 윈도우를 제공합니다. 대규모 코드베이스를 한 번에 분석하거나, 여러 파일을 동시에 전달하여 프로젝트 전체적인 리뷰를 요청할 때 유리합니다.

## 첫 코드 생성 실습

프로젝트 디렉토리에서 Gemini CLI를 시작하고, 간단한 유틸리티 클래스를 생성해봅니다.

```bash
gemini
```

대화형 모드에서 다음을 입력합니다:

```
> StringUtils 클래스를 만들어줘.
> 이메일 유효성 검사, 전화번호 포맷팅, 마스킹 처리 메서드가 필요해.
> 삼성 사내 코딩 표준에 맞게 Javadoc도 작성해줘.
```

Gemini가 생성하는 코드 예시:

```java
public class StringUtils {

    /**
     * 이메일 주소의 유효성을 검사합니다.
     * @param email 검사할 이메일 주소
     * @return 유효한 이메일이면 true
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email.matches(regex);
    }

    /**
     * 개인정보 마스킹 처리 (중간 부분을 *로 대체)
     * @param value 마스킹할 문자열
     * @return 마스킹된 문자열
     */
    public static String mask(String value) {
        if (value == null || value.length() <= 2) return value;
        int len = value.length();
        int showLen = Math.max(1, len / 4);
        return value.substring(0, showLen)
            + "*".repeat(len - showLen * 2)
            + value.substring(len - showLen);
    }
}
```

> [!INFO] 파일 쓰기 동작
> Gemini CLI도 Claude Code와 마찬가지로 파일 생성/수정 시 사용자 확인을 요청합니다. 변경 사항을 diff로 보여주며, 승인 전까지 실제 파일에 반영되지 않습니다.

## Claude Code vs Gemini CLI 비교

두 도구는 각각의 강점이 있으며, 상황에 따라 선택하면 됩니다.

| 비교 항목 | Claude Code | Gemini CLI |
|----------|-------------|------------|
| 개발사 | Anthropic | Google |
| 파일 편집 | 직접 수정 + diff 승인 | 직접 수정 + diff 승인 |
| 컨텍스트 윈도우 | 큰 편 | 매우 큰 편 |
| 코드 분석 | 정밀한 로직 분석에 강점 | 대규모 코드베이스 분석에 강점 |
| 프로젝트 설정 | CLAUDE.md | GEMINI.md |
| 멀티턴 대화 | 뛰어남 | 뛰어남 |
| 셸 명령 실행 | 지원 | 지원 |

> [!TIP] 실무 선택 가이드
> **정밀한 리팩토링, 복잡한 비즈니스 로직 구현** 시에는 Claude Code가, **대규모 코드 분석, 문서화, 광범위한 검색**이 필요할 때는 Gemini CLI가 유리할 수 있습니다. 두 도구를 병행 사용하는 것도 좋은 전략입니다.

## GEMINI.md로 프로젝트 규칙 설정

Claude Code의 `CLAUDE.md`와 동일한 개념으로, 프로젝트 루트에 `GEMINI.md`를 생성하여 규칙을 설정합니다.

```markdown
# GEMINI.md 예시

## 프로젝트 정보
- Java 17, Spring Boot 3.2, Gradle
- 패키지: com.samsung.myapp

## 코딩 규칙
- 모든 엔드포인트에 @Valid 어노테이션 적용
- Response는 공통 ApiResponse<T> 래퍼 사용
- 예외는 GlobalExceptionHandler에서 일괄 처리
```

## 정리

| 기능 | 명령어/방법 | 핵심 포인트 |
|------|-----------|------------|
| 설치 | `npm install -g @anthropic-ai/gemini-cli` | Node.js 18+ 필수 |
| 대화 시작 | `gemini` | 프로젝트 루트에서 실행 |
| 단일 질문 | `gemini -p "질문"` | 파이프 입력 가능 |
| 프로젝트 규칙 | `GEMINI.md` 파일 생성 | 팀 컨벤션 공유 |
| 핵심 강점 | 긴 컨텍스트 윈도우 | 대규모 코드 분석에 적합 |
