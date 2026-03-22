# 로그 파싱 엔진 설계

## 학습 목표

- 정규식 기반 멀티 포맷 로그 파서를 설계할 수 있다
- TypeScript 타입 시스템으로 로그 데이터를 모델링할 수 있다
- AI 도구를 활용한 파서 구현 프로세스를 이해한다

## 데이터 모델 설계

로그 분석기의 핵심 타입을 먼저 정의합니다:

```typescript
type Severity = "INFO" | "WARN" | "ERROR" | "FATAL";

interface LogEntry {
  timestamp: Date;
  severity: Severity;
  source: string;      // 서비스명 또는 IP
  message: string;     // 로그 메시지 본문
  rawLine: string;     // 원본 라인
  lineNumber: number;  // 파일 내 라인 번호
}
```

> [!TIP] 타입 우선 설계
> AI에게 코드를 요청할 때 타입 정의를 먼저 제공하면 훨씬 정확한 구현을 받을 수 있습니다. "이 타입에 맞는 파서를 작성해줘"가 "로그 파서 만들어줘"보다 낫습니다.

## 정규식 설계

각 로그 포맷별 정규식:

```typescript
// Syslog: "Mar 15 08:00:01 hostname service[pid]: message"
const SYSLOG_RE = /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+(\S+?)(?:\[\d+\])?:\s+(.*)$/;

// App log: "2025-03-15 08:00:01.123 [LEVEL] [source] message"
const APP_LOG_RE = /^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3})\s+\[(\w+)\]\s+\[([^\]]+)\]\s+(.*)$/;

// Access log: 'IP - - [timestamp] "METHOD PATH" STATUS SIZE'
const ACCESS_RE = /^(\S+)\s+-\s+-\s+\[([^\]]+)\]\s+"(\S+)\s+(\S+)\s+\S+"\s+(\d{3})\s+(\d+)$/;
```

## 파싱 전략: 순차 시도

```typescript
function parseLine(line: string, lineNumber: number): LogEntry | null {
  // 1. App log 시도 (가장 정형화된 포맷)
  let match = APP_LOG_RE.exec(line);
  if (match) return parseAppLog(match, lineNumber);

  // 2. Syslog 시도
  match = SYSLOG_RE.exec(line);
  if (match) return parseSyslog(match, lineNumber);

  // 3. Access log 시도
  match = ACCESS_RE.exec(line);
  if (match) return parseAccessLog(match, lineNumber);

  // 4. 폴백: 알 수 없는 포맷
  return { /* ... fallback entry */ };
}
```

> [!WARNING] 날짜 파싱 주의
> Syslog 포맷에는 연도가 없습니다. `new Date("Mar 15 08:00:01")`은 브라우저마다 다르게 동작할 수 있으므로, 현재 연도를 명시적으로 붙여야 합니다.

## Access Log의 심각도 결정

Access log에는 명시적 로그 레벨이 없으므로 HTTP 상태 코드로 판단합니다:

| 상태 코드 | 심각도 | 의미 |
|-----------|--------|------|
| 2xx | INFO | 정상 응답 |
| 3xx | INFO | 리다이렉트 |
| 4xx | WARN | 클라이언트 오류 |
| 5xx | ERROR | 서버 오류 |

## 성능 고려사항

1만 줄 이상의 로그를 2초 이내에 처리해야 합니다:

- 정규식은 한 번만 컴파일 (모듈 레벨 상수)
- `split("\n")` 후 순회는 `O(n)`으로 충분
- Date 객체 생성이 가장 큰 비용 → 필요시 lazy 파싱 고려

> [!INFO] 가상 스크롤
> 1만 줄을 DOM에 모두 렌더링하면 브라우저가 느려집니다. 화면에 보이는 영역만 렌더링하는 가상 스크롤(Virtual Scrolling)이 필수입니다.

## 요약

- 3종 로그 포맷을 정규식으로 순차 시도하여 파싱
- TypeScript 타입으로 데이터 모델을 명확히 정의
- 날짜 파싱, HTTP 상태 코드 매핑 등 엣지 케이스 처리
- 성능을 위해 모듈 레벨 정규식 + 가상 스크롤 적용
