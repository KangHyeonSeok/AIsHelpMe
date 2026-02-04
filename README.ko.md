# AIsHelpMe 🤖✨

> **Gemini와 ChatGPT 사이의 무료 합의 브릿지로 다중 LLM 시너지 구현**

ChatGPT, Gemini에게 의견을 물어보고 취합한 답변을 받자.

## 📖 개요

AIsHelpMe는 Google Gemini와 ChatGPT 사이의 원활하고 무료인 합의 브릿지를 만드는 Tampermonkey UserScript입니다. 두 AI 모델이 상호 검토와 종합을 통해 더 나은 답변을 생성하도록 협업하는 3단계 워크플로우를 조율합니다.

### ✨ 주요 기능

- **🔄 자동화된 워크플로우**: 3단계 프로세스(초안 → 비평 → 최종안)가 자동으로 실행됩니다
- **💾 크로스 탭 동기화**: `GM_storage`를 사용하여 포커스 전환 없이 원활하게 통신합니다
- **🎨 시각적 피드백**: 내장된 UI 표시기가 워크플로우 상태를 실시간으로 보여줍니다
- **🔒 프라이버시 우선**: 모든 처리는 브라우저 내에서 로컬로 수행됩니다 - 외부 서버 없음
- **⚡ 무료**: API 키가 필요 없으며 무료 웹 인터페이스에서 작동합니다

## 🚀 설치 방법

### 사전 준비사항

1. [Tampermonkey](https://www.tampermonkey.net/) 브라우저 확장 프로그램 설치
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
   - [Safari](https://apps.apple.com/app/tampermonkey/id1482490089)

### UserScript 설치

1. 브라우저에서 Tampermonkey 아이콘을 클릭합니다
2. "새 스크립트 생성..." 을 선택합니다
3. `ais-help-me.user.js`의 내용을 복사하여 에디터에 붙여넣습니다
4. 스크립트를 저장합니다 (Ctrl+S 또는 Cmd+S)

**또는** 이 저장소의 `.user.js` 파일을 직접 클릭하여 설치할 수 있습니다 - Tampermonkey가 자동으로 감지합니다.

## 📋 동작 원리

워크플로우는 세 가지 단계로 작동합니다:

### 1️⃣ **초안 단계** (Gemini)
- 사용자가 Gemini에 프롬프트를 제출합니다
- 스크립트가 자동으로 Gemini의 초기 응답을 캡처합니다
- 초안을 크로스 탭 스토리지에 저장합니다

### 2️⃣ **비평 단계** (ChatGPT)
- ChatGPT 탭으로 전환합니다
- 스크립트가 비평 요청과 함께 초안을 자동으로 붙여넣습니다
- ChatGPT가 정확성, 완전성, 명확성에 대한 구조화된 피드백을 제공합니다
- 비평이 스토리지에 저장됩니다

### 3️⃣ **최종안 단계** (Gemini)
- Gemini 탭으로 돌아갑니다
- 스크립트가 비평을 Gemini에게 다시 전송합니다
- Gemini가 두 관점을 종합하여 개선된 최종 답변을 생성합니다

## 🎯 사용 가이드

### 단계별 지침

1. **Gemini 열기** (`https://gemini.google.com`)
   - 오른쪽 하단에 "AIsHelpMe Control" 패널이 표시됩니다

2. **워크플로우 시작**
   - "Start Consensus Flow" 버튼을 클릭합니다
   - 상태 표시기가 나타납니다: "✓ Consensus flow activated!"

3. **프롬프트 제출**
   - Gemini의 입력 상자에 질문을 입력합니다
   - 정상적으로 제출합니다
   - Gemini의 응답이 완료될 때까지 기다립니다
   - 상태가 업데이트됩니다: "✓ Draft captured! Now open ChatGPT tab."

4. **ChatGPT로 전환** (`https://chatgpt.com` 또는 `https://chat.openai.com`)
   - 스크립트가 자동으로 비평 요청을 준비합니다
   - 상태 표시: "✓ Critique request ready! Click Send button."
   - 전송 버튼을 클릭하여 제출합니다
   - ChatGPT의 비평을 기다립니다
   - 상태 업데이트: "✓ Critique captured! Return to Gemini tab."

5. **Gemini로 돌아가기**
   - 스크립트가 최종 종합 프롬프트를 준비합니다
   - 상태 표시: "✓ Final synthesis request ready! Click Send."
   - 전송을 클릭하여 개선된 답변을 받습니다
   - 상태 완료: "✅ Consensus flow complete!"

### 최상의 결과를 위한 팁

- 🕐 **인내심을 가지세요**: 다음 단계로 넘어가기 전에 각 AI가 응답을 완료할 때까지 기다리세요
- 🔄 **여러 탭**: 워크플로우 전체에서 Gemini와 ChatGPT 탭을 모두 열어두세요
- 🎯 **명확한 프롬프트**: 더 나은 합의를 위해 명확하게 정의된 질문으로 시작하세요
- 🔁 **필요시 재설정**: 워크플로우가 멈추면 "Reset" 버튼을 사용하세요

## 🎨 UI 요소

### 제어 패널 (오른쪽 하단)
- **Start Consensus Flow**: 3단계 워크플로우를 시작합니다
- **Reset**: 저장된 모든 데이터를 지우고 워크플로우 상태를 재설정합니다

### 상태 표시기 (오른쪽 상단)
- 실시간 워크플로우 진행 상황을 표시합니다
- 다음 단계 지침을 제공합니다
- 사용하지 않을 때 자동으로 숨겨집니다

## 🛠️ 기술 세부사항

### 아키텍처
- **플랫폼**: Tampermonkey UserScript (JavaScript)
- **스토리지**: 크로스 탭 동기화를 위한 GM_storage API
- **호환성**: Gemini와 ChatGPT 웹 인터페이스에서 작동합니다

### 지원 사이트
- `https://gemini.google.com/*`
- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

### 상태 관리
스크립트는 네 가지 상태를 사용합니다:
- `IDLE`: 활성 워크플로우 없음
- `WAITING_FOR_DRAFT`: Gemini의 초기 응답 대기 중
- `WAITING_FOR_CRITIQUE`: ChatGPT 비평을 위해 전송 준비 완료
- `WAITING_FOR_FINAL`: Gemini의 최종 종합 준비 완료

## 🐛 문제 해결

### 워크플로우가 시작되지 않음
- "Start Consensus Flow"를 클릭할 때 Gemini 페이지에 있는지 확인하세요
- 페이지를 새로고침하고 다시 시도하세요
- Tampermonkey가 활성화되어 있는지 확인하세요

### 텍스트가 자동으로 삽입되지 않음
- 일부 사이트는 HTML 구조를 업데이트할 수 있습니다
- 상태 표시기에 표시된 프롬프트를 수동으로 복사/붙여넣기할 수 있습니다
- 자세한 로그는 브라우저 콘솔을 확인하세요 (접두사: `[AIsHelpMe]`)

### 상태가 멈춤
- 제어 패널에서 "Reset" 버튼을 클릭하세요
- Tampermonkey의 스토리지 뷰어를 통해 수동으로 스토리지를 지우세요
- 1단계부터 워크플로우를 다시 시작하세요

## 🔐 프라이버시 및 보안

- **외부 서버 없음**: 모든 처리는 브라우저에서 발생합니다
- **데이터 수집 없음**: 스크립트는 어디에도 데이터를 전송하지 않습니다
- **오픈 소스**: 전체 코드를 검토할 수 있습니다
- **로컬 스토리지만 사용**: GM_storage API를 통해 브라우저의 로컬 스토리지를 사용합니다

## 📄 라이센스

이 프로젝트는 MIT 라이센스에 따라 라이센스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여하기

기여를 환영합니다! 언제든지 Pull Request를 제출해 주세요.

## 📞 지원

문제가 발생하거나 질문이 있는 경우:
1. 위의 문제 해결 섹션을 확인하세요
2. 브라우저 콘솔 로그를 검토하세요 (`[AIsHelpMe]` 접두사 확인)
3. GitHub에서 이슈를 열어주세요

## 🎉 감사의 말

협업적 합의를 통해 더 나은 답변을 위해 여러 LLM을 활용하는 AI 커뮤니티를 위해 ❤️로 만들었습니다.
