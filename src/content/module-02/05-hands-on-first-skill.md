# 실습: 첫 커스텀 스킬 만들기

## 학습 목표

이 실습을 완료하면 다음을 할 수 있습니다:

- 코드 리뷰용 커스텀 스킬을 처음부터 작성
- 참조 파일을 활용한 스킬 컨텍스트 확장
- 작성한 스킬을 실제로 호출하여 동작 확인

## Step 1: 디렉토리 구조 생성

```bash
mkdir -p ~/harness-lab && cd ~/harness-lab && git init
mkdir -p .claude/skills/review-code/references
```

## Step 2: 참조 파일 작성

`.claude/skills/review-code/references/checklist.md`:

```markdown
# 삼성 코드 리뷰 체크리스트 v1.0

## 보안 (Critical)
- [ ] 하드코딩된 비밀번호, API 키, 토큰이 없는가
- [ ] SQL 쿼리에 파라미터 바인딩을 사용하는가
- [ ] 사용자 입력에 대한 유효성 검증이 있는가

## 성능 (Warning)
- [ ] N+1 쿼리 패턴이 없는가
- [ ] 루프 내부에서 I/O 호출을 하지 않는가
- [ ] 대용량 리스트를 메모리에 전부 로드하지 않는가

## 가독성 (Info)
- [ ] 함수가 30줄을 초과하지 않는가
- [ ] 매직 넘버 대신 명명된 상수를 사용하는가
```

> [!TIP] 참조 파일 우선 작성
> 스킬 본문(프롬프트)은 짧게, 구체적 규칙은 references에 분리하세요. 토큰 효율성과 유지보수성이 모두 향상됩니다.

## Step 3: 스킬 정의 파일 작성

`.claude/skills/review-code/skill.md`:

```markdown
---
name: "코드 리뷰"
description: "변경된 코드의 보안, 성능, 가독성을 검사하고 개선 사항을 제안합니다"
trigger: "/review"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

## 역할
삼성 백엔드 팀의 시니어 코드 리뷰어로서, references의 체크리스트를 기준으로 검사합니다.

## 실행 절차
1. `git diff --name-only`로 변경된 파일 목록 확인
2. `.ts`, `.tsx`, `.js`, `.jsx` 파일만 필터링
3. 각 파일을 읽고 체크리스트 항목별로 검사
4. 결과를 심각도별로 분류하여 보고

## 출력 형식
| 심각도 | 라인 | 이슈 | 제안 |
|--------|------|------|------|

- 전체 판정: Critical 1건 이상이면 FAIL
```

> [!WARNING] Write/Edit 미포함 의도
> 리뷰 스킬은 `Write`와 `Edit`을 허용하지 않았습니다. 리뷰 에이전트가 코드를 직접 수정하면 변경 추적이 어려워집니다. 리뷰는 **읽기 전용**으로 유지하세요.

## Step 4: 테스트용 코드 작성

의도적으로 문제를 포함한 샘플 코드를 작성합니다.

```typescript
// src/user-service.ts
import { db } from './database';

const DB_PASSWORD = "samsung1234!";  // 보안: 하드코딩된 비밀번호

export async function getUsers() {
  const users = await db.query("SELECT * FROM users");
  const result = [];
  for (const user of users) {
    // 성능: N+1 쿼리
    const orders = await db.query(
      `SELECT * FROM orders WHERE user_id = '${user.id}'`  // 보안: SQL 인젝션
    );
    result.push({ ...user, orders });
  }
  return result;
}
```

이 코드의 의도된 문제점:
- **보안**: 하드코딩된 비밀번호, SQL 인젝션 취약점
- **성능**: N+1 쿼리 패턴 (루프 내 DB 호출)

## Step 5: 스킬 실행

```bash
# 초기 커밋 생성
git add -A && git commit -m "initial"

# 코드 수정 후 스킬 호출
claude "/review"
```

> [!INFO] 예상 결과
> 체크리스트 기반으로 하드코딩된 비밀번호(Critical), SQL 인젝션(Critical), N+1 쿼리(Warning)를 탐지하고, 각각에 대한 수정 제안을 출력합니다. Critical이 있으므로 판정은 FAIL입니다.

## Step 6: 스킬 개선하기

스킬은 마크다운 파일이므로 수정 후 즉시 반영됩니다. `references/checklist.md`에 규칙을 추가하거나, 파일 필터/출력 형식을 조정하며 반복 개선하세요.

## 요약

- 스킬 구조: `skill.md` + `references/` 폴더로 구성
- 참조 파일에 상세 규칙을 분리하여 유지보수성 확보
- `allowed-tools`로 리뷰 스킬을 읽기 전용으로 제한
- 테스트용 코드로 스킬 동작을 검증한 후 반복 개선
- `/review` 트리거로 팀원 누구나 동일한 리뷰 기준 적용 가능
