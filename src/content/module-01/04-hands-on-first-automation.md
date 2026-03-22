# 실습: 첫 자동화 스크립트 만들기

## 학습 목표

이 실습을 완료하면 다음을 수행할 수 있습니다:

- Claude Code를 활용하여 실무용 자동화 스크립트를 작성하기
- 프롬프트를 단계적으로 개선하며 원하는 결과를 얻는 방법 익히기
- 생성된 코드를 검증하고 개선하는 워크플로우 체험하기

## 실습 개요

> [!INFO] 실습 시나리오
> Spring Boot 프로젝트에서 반복적으로 수행하는 **헬스체크 및 로그 분석 자동화 스크립트**를 Claude Code와 함께 만들어봅니다. 실제 삼성 개발 환경에서 자주 필요한 운영 자동화 시나리오입니다.

### 완성 목표

- 여러 서비스의 헬스체크를 자동으로 수행
- 에러 로그를 파싱하여 요약 리포트 생성
- 결과를 터미널에 깔끔하게 출력

## Step 1: 프로젝트 준비

먼저 실습 디렉토리를 만들고 Claude Code를 시작합니다.

```bash
# 실습 디렉토리 생성
mkdir -p ~/hands-on/auto-monitor
cd ~/hands-on/auto-monitor

# Git 초기화 (Claude Code가 변경 추적에 활용)
git init

# Claude Code 시작
claude
```

> [!TIP] Git 초기화를 권장하는 이유
> Claude Code는 Git 저장소에서 파일 변경 사항을 추적합니다. 실습 중 실수가 생기면 `git diff`로 변경 내역을 확인하고, `git checkout -- .`으로 손쉽게 되돌릴 수 있습니다.

## Step 2: 첫 번째 프롬프트 - 기본 구조 생성

Claude Code 대화형 모드에서 다음과 같이 요청합니다:

```
> health-check.sh 스크립트를 만들어줘.
> 다음 기능이 필요해:
> 1. 서비스 URL 목록을 배열로 관리
> 2. 각 URL에 curl로 헬스체크 요청
> 3. HTTP 상태 코드에 따라 성공/실패 판별
> 4. 결과를 컬러 출력 (성공=녹색, 실패=빨간색)
```

Claude Code가 생성하는 스크립트 예시:

```bash
#!/bin/bash
# health-check.sh - 서비스 헬스체크 자동화

# 서비스 URL 목록
SERVICES=(
    "http://localhost:8080/actuator/health|user-service"
    "http://localhost:8081/actuator/health|order-service"
    "http://localhost:8082/actuator/health|payment-service"
)

# 컬러 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=============================="
echo " Service Health Check Report"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "=============================="

FAIL_COUNT=0

for service in "${SERVICES[@]}"; do
    IFS='|' read -r url name <<< "$service"

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        --connect-timeout 5 "$url" 2>/dev/null)

    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "  ${GREEN}[OK]${NC}  $name ($url)"
    else
        echo -e "  ${RED}[FAIL]${NC} $name ($url) - HTTP $HTTP_CODE"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
done

echo "=============================="
if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "  Status: ${GREEN}All services healthy${NC}"
else
    echo -e "  Status: ${RED}$FAIL_COUNT service(s) down${NC}"
    exit 1
fi
```

Claude Code가 파일 생성을 제안하면 `y`를 입력하여 승인합니다.

## Step 3: 두 번째 프롬프트 - 기능 확장

이제 로그 분석 기능을 추가합니다:

```
> 같은 디렉토리에 log-analyzer.sh를 만들어줘.
> 기능:
> 1. logs/ 디렉토리의 *.log 파일을 분석
> 2. ERROR, WARN 레벨 로그를 추출
> 3. 에러 유형별 발생 횟수를 집계
> 4. 상위 5개 에러를 요약 테이블로 출력
```

> [!WARNING] 프롬프트 작성 핵심
> "로그 분석해줘"처럼 모호하게 요청하면 원하는 결과를 얻기 어렵습니다. **입력(어떤 파일), 처리(어떤 로직), 출력(어떤 형태)**을 명확히 지정하세요.

## Step 4: 세 번째 프롬프트 - 통합 실행

두 스크립트를 하나로 묶는 메인 스크립트를 만듭니다:

```
> monitor.sh를 만들어줘. 이 스크립트는:
> 1. health-check.sh를 먼저 실행
> 2. log-analyzer.sh를 실행
> 3. 전체 결과를 reports/ 디렉토리에 타임스탬프 파일로 저장
> 4. --watch 옵션을 주면 60초마다 반복 실행
```

```bash
# 실행 권한 부여
chmod +x monitor.sh health-check.sh log-analyzer.sh

# 단일 실행
./monitor.sh

# 감시 모드 (60초 간격 반복)
./monitor.sh --watch
```

## Step 5: 코드 검증 및 개선

생성된 코드를 Claude Code에게 다시 검증받습니다:

```
> 방금 만든 3개 스크립트를 리뷰해줘.
> 다음 관점에서 개선점을 알려줘:
> - 에러 핸들링이 충분한지
> - ShellCheck 경고가 없는지
> - 보안상 문제가 없는지
```

> [!TIP] 반복 개선 패턴
> AI 도구를 활용한 개발의 핵심은 **생성 -> 검증 -> 개선**의 반복입니다. 첫 번째 결과를 그대로 사용하지 말고, 반드시 리뷰 요청을 통해 품질을 높이세요.

## 실습 체크리스트

완료 여부를 점검하세요:

- [ ] Claude Code 대화형 모드에서 스크립트 3개를 생성했다
- [ ] 각 스크립트를 실제로 실행하여 동작을 확인했다
- [ ] 프롬프트를 수정하여 코드를 개선하는 과정을 경험했다
- [ ] 생성된 코드를 리뷰 요청하여 피드백을 받았다

## 핵심 정리

| 단계 | 수행 내용 | 배운 점 |
|------|----------|--------|
| Step 1 | 프로젝트 준비 | Git 초기화로 변경 추적 |
| Step 2 | 기본 스크립트 생성 | 구체적 프롬프트의 중요성 |
| Step 3 | 기능 확장 | 입력/처리/출력 명시 |
| Step 4 | 통합 스크립트 | 점진적 빌드업 전략 |
| Step 5 | 코드 리뷰 | 생성-검증-개선 반복 패턴 |

> [!INFO] 다음 단계
> 이 실습에서 익힌 프롬프트 작성법과 반복 개선 패턴은 이후 모든 모듈에서 활용됩니다. 다음 모듈에서는 더 복잡한 프로젝트 구조에서 AI 도구를 활용하는 방법을 학습합니다.
