# 실습: 분석기 확장하기

## 학습 목표

- 기존 로그 분석기에 새로운 기능을 추가하는 방법을 체험한다
- Claude Code를 활용해 기존 코드를 분석하고 확장하는 프로세스를 익힌다
- 하네스 기반 개발의 실전적 가치를 체감한다

## 실습 과제

기존 로그 분석기에 다음 기능을 추가합니다:

1. **새로운 로그 포맷 지원**: JSON 구조화 로그
2. **키워드 하이라이트**: 검색어가 포함된 부분 강조
3. **통계 내보내기**: 분석 결과를 텍스트로 복사

## Step 1: JSON 로그 포맷 추가

현재 3종 포맷에 JSON 로그를 추가합니다:

```json
{"timestamp":"2025-03-15T08:00:01.123Z","level":"ERROR","service":"payment","message":"Transaction failed","txId":"TX-12345"}
```

Claude Code에 다음과 같이 요청합니다:

```bash
claude "logParser.ts에 JSON 로그 포맷 파싱을 추가해줘.
기존 parseLine 함수에 JSON 감지 로직을 넣고,
timestamp, level, service, message 필드를 LogEntry로 매핑해줘."
```

> [!TIP] 컨텍스트 제공
> "logParser.ts에"라고 파일을 명시하면 Claude Code가 해당 파일의 기존 코드를 읽고, 기존 패턴에 맞춰 구현합니다.

## Step 2: 구현 코드 검증

AI가 생성할 예상 코드:

```typescript
// JSON 로그 감지
function tryParseJSON(line: string, lineNumber: number): LogEntry | null {
  if (!line.startsWith("{")) return null;
  try {
    const obj = JSON.parse(line);
    return {
      timestamp: new Date(obj.timestamp),
      severity: (obj.level?.toUpperCase() as Severity) || "INFO",
      source: obj.service || obj.source || "unknown",
      message: obj.message || JSON.stringify(obj),
      rawLine: line,
      lineNumber,
    };
  } catch {
    return null;
  }
}
```

> [!WARNING] 검증 포인트
> AI가 생성한 코드에서 반드시 확인할 것:
> - `JSON.parse`의 try-catch 처리
> - 필드가 없을 때의 폴백 값
> - `level` → `Severity` 매핑의 정확성

## Step 3: 키워드 하이라이트

검색어가 포함된 텍스트를 강조하는 유틸리티:

```typescript
function highlightText(text: string, keyword: string): React.ReactNode {
  if (!keyword) return text;
  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase()
      ? <mark key={i} className="bg-yellow-500/30 px-0.5">{part}</mark>
      : part
  );
}
```

## Step 4: 분석 결과 내보내기

분석 요약을 텍스트로 복사하는 기능:

```typescript
function exportSummary(result: AnalysisResult): string {
  const lines = [
    `=== 로그 분석 리포트 ===`,
    `총 로그: ${result.summary.total}줄`,
    `INFO: ${result.summary.byLevel.INFO} | WARN: ${result.summary.byLevel.WARN}`,
    `ERROR: ${result.summary.byLevel.ERROR} | FATAL: ${result.summary.byLevel.FATAL}`,
    ``,
    `--- 이상 징후 ${result.anomalies.length}건 ---`,
    ...result.anomalies.map(a => `[${a.severity}] ${a.description}`),
  ];
  return lines.join("\n");
}
```

## 실습 평가 기준

- [ ] JSON 로그 포맷이 정상 파싱되는가?
- [ ] 검색어 하이라이트가 대소문자 무관하게 동작하는가?
- [ ] 내보내기 텍스트에 핵심 통계가 포함되는가?
- [ ] 기존 3종 포맷 파싱이 영향받지 않는가?

> [!INFO] 회고
> 이 실습에서 가장 중요한 것은 "AI에게 어떻게 요청하면 좋은 결과를 얻는가"입니다. 파일 경로, 기존 패턴, 구체적 요구사항을 명확히 전달하는 프롬프트 엔지니어링을 연습하세요.
