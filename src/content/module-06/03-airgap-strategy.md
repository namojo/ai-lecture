# 폐쇄망 환경 전략

## 학습 목표

- 폐쇄망(Air-gapped) 환경에서 AI 도구를 활용하는 전략을 수립할 수 있다
- 의존성 관리와 오프라인 빌드 전략을 이해한다
- 삼성 사내망에서의 실전 적용 방안을 도출할 수 있다

## 폐쇄망이란?

인터넷과 완전히 분리된 네트워크 환경입니다. 삼성중공업과 삼성SDI의 개발 서버 중 상당수가 이 환경에서 운영됩니다.

| 제약 사항 | 영향 |
|-----------|------|
| npm install 불가 | 의존성 사전 번들링 필요 |
| CDN 폰트 불가 | 로컬 폰트 번들 필수 |
| 외부 API 불가 | 모든 데이터 로컬 처리 |
| 패키지 업데이트 불가 | 버전 고정 + 보안 패치 수동 |

## 전략 1: 의존성 사전 번들링

인터넷이 되는 환경에서 미리 모든 의존성을 설치하고, `node_modules`를 포함하여 배포합니다:

```bash
# 인터넷 환경에서
npm install
npm run build

# 빌드 결과물만 전달
tar -czf ai-lecture-dist.tar.gz out/
```

> [!TIP] Static Export의 가치
> Next.js의 `output: 'export'`는 서버 없이 정적 HTML만으로 동작합니다. `out/` 폴더를 아무 HTTP 서버에서 서빙하면 됩니다.

## 전략 2: 로컬 폰트 번들링

CDN을 사용할 수 없으므로 폰트 파일을 직접 번들에 포함합니다:

```css
/* public/fonts/에 woff2 파일 배치 */
@font-face {
  font-family: "Pretendard";
  src: url("/fonts/PretendardVariable.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
```

> [!WARNING] 외부 URL 차단
> 개발 중에 실수로 외부 URL을 참조하면 폐쇄망에서 동작하지 않습니다. 빌드 후 네트워크 탭에서 외부 요청이 0건인지 반드시 확인하세요.

## 전략 3: 제로 네트워크 검증

빌드 후 외부 요청이 없는지 확인하는 방법:

```bash
# Chrome DevTools Network 탭에서 확인
# 또는 로컬 서버를 오프라인 모드로 실행

# macOS: Wi-Fi 끄고 테스트
networksetup -setairportpower en0 off
npx serve out/
# 모든 기능이 정상 동작하는지 확인
networksetup -setairportpower en0 on
```

## 전략 4: AI 도구 사용 분리

```text
[인터넷 환경]           [폐쇄망 환경]
  ┌─────────┐            ┌──────────┐
  │ Claude  │  코드생성→  │ 코드 적용  │
  │ Code    │  ━━━━━━→   │ 빌드      │
  │ Gemini  │  USB/보안매체│ 테스트    │
  │ CLI     │            │ 배포      │
  └─────────┘            └──────────┘
```

AI 도구는 인터넷이 되는 환경에서 사용하고, 결과물만 폐쇄망으로 이전합니다.

> [!INFO] 보안 검토 프로세스
> 코드를 폐쇄망으로 이전할 때는 반드시 보안 검토를 거쳐야 합니다. 자동화된 코드 스캔 도구를 보안 매체 이전 파이프라인에 포함시키세요.

## 실전 체크리스트

배포 전 확인 항목:

- [ ] `npm run build` 성공
- [ ] `out/` 폴더에 모든 정적 파일 포함
- [ ] 폰트 파일이 `out/fonts/`에 존재
- [ ] 샘플 데이터가 `out/sample-data/`에 존재
- [ ] 브라우저 네트워크 탭에서 외부 요청 0건
- [ ] 오프라인 모드에서 모든 기능 동작
- [ ] `python -m http.server` 또는 `npx serve`로 서빙 테스트

## 요약

- 폐쇄망에서는 모든 의존성과 에셋이 로컬에 포함되어야 함
- Next.js static export로 서버 없이 정적 파일만으로 동작
- AI 도구는 인터넷 환경에서 사용하고 결과물만 이전
- 제로 네트워크 검증으로 외부 의존성 완전 차단 확인
