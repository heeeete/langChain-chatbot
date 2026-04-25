# 개인 포트폴리오 AI 챗봇

> 대화 컨텍스트 유지와 SSE 스트리밍을 결합하여 실시간으로 개발자의 정보를 제공하는 서비스입니다. 시스템 프롬프트에 직접 주입된 경력 데이터와 기술 블로그 포스팅 정보를 바탕으로 답변을 생성합니다.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-7.5.3-red)](https://reactrouter.com/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3.47-green)](https://www.langchain.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.4-blue)](https://tailwindcss.com/)

🔗 **Demo**: [https://chatbot-zeta-kohl.vercel.app/](https://chatbot-zeta-kohl.vercel.app/)

## 🛠 Tech Stack

### AI & Backend

- **Framework**: LangChain, LangGraph (@langchain/langgraph)
- **Model**: OpenAI **GPT-4o-mini**
- **Streaming**: Server-Sent Events (SSE), ReadableStream

### Frontend

- **Framework**: React Router v7 (SPA)
- **Styling**: Tailwind CSS v4, Motion (Framer Motion)
- **Network**: @microsoft/fetch-event-source (Streaming Fetch)

## 💡 주요 구현 내용

### 1. LangGraph 기반 대화 상태 관리

`StateGraph`를 사용하여 기본적인 대화 흐름(`START -> model -> END`)을 정의하고, 세션별 대화 맥락을 유지합니다.

- **Memory**: `MemorySaver`를 활용하여 `thread_id` 기반의 개별 대화 이력을 관리하고 연속성 있는 응답 환경 구축.

### 2. SSE 기반 실시간 메시지 스트리밍

서버와 클라이언트 간의 효율적인 데이터 전송을 위해 스트리밍 방식을 채택했습니다.

- **통신 구조**: 서버의 `app.stream()` 응답을 `ReadableStream`으로 변환하여 전송하고, 클라이언트에서 `fetchEventSource`를 통해 실시간으로 수신하여 사용자 대기 시간을 최소화함.

### 3. 프롬프트 지시 구조화 및 데이터 주입

시스템 프롬프트 설계를 통해 답변의 일관성과 품질을 관리합니다.

- **프롬프트 구조화**: AI가 답변 전 질문 의도를 파악하고 관련 데이터를 먼저 검토하도록 단계별 지시문을 구성하여 답변의 일관성 개선.
- **데이터 활용**: 실제 실무 경력(보룸, SpaceCL)과 기술 블로그 포스팅 정보를 프롬프트에 주입하여 개인화된 정보 제공.

### 4. 채팅 UI

메시지 수신 경험을 개선하기 위한 UI 처리를 구현했습니다.

- 자동 스크롤: 새 메시지 수신 시 자동으로 하단으로 이동
- 마크다운 렌더링: react-markdown과 highlight.js를 활용한 코드 블록 및 구문 강조 지원
- 로딩 애니메이션: 응답 대기 중 애니메이션으로 사용자 피드백 제공

## 📁 프로젝트 구조

```
app/
├── .server/              # 서버 로직 (LangGraph 상태 정의 및 LLM 설정)
├── routes/
│   ├── apis/message.ts   # SSE 스트리밍 API 엔드포인트
│   ├── chat/             # 채팅 UI 및 메시지 수신 로직
│   └── home/             # 메인 페이지
├── components/           # 공통 UI 및 에셋
└── common/               # 상수 및 타입 정의
```

## 🚀 실행 방법

1. 환경 변수 설정 (`.env`)

```env
OPENAI_API_KEY=your_api_key
```

2. 의존성 설치 및 실행

```bash
pnpm install
pnpm dev
```
