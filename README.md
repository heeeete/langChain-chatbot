# LangChain Chatbot

> 희태에 대한 모든 것을 알려주는 AI 개인 비서 챗봇

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-7.5.3-red)](https://reactrouter.com/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3.47-green)](https://www.langchain.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.4-blue)](https://tailwindcss.com/)

🔗 **Demo**: [https://chatbot-keynut.vercel.app](https://chatbot-keynut.vercel.app)

## 📖 프로젝트 소개

LangChain과 GPT-4를 활용하여 정보를 제공하는 개인 포트폴리오 챗봇입니다.

### ✨ 주요 특징

- 🤖 **LangGraph 기반 대화 시스템** - 상태 관리와 메모리를 갖춘 대화형 AI
- 💬 **실시간 스트리밍 응답** - Server-Sent Events (SSE)를 통한 실시간 응답
- 🌓 **다크 모드 지원** - 라이트/다크 테마 전환 기능
- 📱 **반응형 디자인** - 모바일부터 데스크톱까지 최적화된 레이아웃

## 🛠 기술 스택

### Frontend
- **React**
- **React Router**
- **TypeScript**
- **Tailwind CSS 4**
- **Motion (Framer Motion)**
- **Shadcn**
- **React Markdown**
- **Highlight.js**

### Backend & AI
- **LangChain (@langchain/core, @langchain/langgraph)**
- **OpenAI GPT-4o-mini**

### Development Tools
- **Vite**
- **pnpm**
- **ESLint & Prettier**

## 📁 프로젝트 구조

```
langChain-chatbot/
├── app/
│   ├── . server/              # 서버 전용 코드
│   │   └── model/
│   │       ├── llm.ts        # OpenAI LLM 설정
│   │       └── call.ts       # AI 프롬프트 및 호출 로직
│   ├── routes/               # 라우트 파일
│   │   ├── home/
│   │   │   └── index.tsx     # 홈 페이지
│   │   ├── chat/
│   │   │   ├── index.tsx     # 채팅 페이지
│   │   │   └── components/   # 채팅 컴포넌트
│   │   └── apis/
│   │       └── message.ts    # 메시지 API 엔드포인트
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── ui/               # UI 컴포넌트 라이브러리
│   │   └── svg/              # SVG 아이콘
│   ├── common/
│   │   └── constant.ts       # 상수 정의
│   ├── lib/
│   │   └── utils.ts          # 유틸리티 함수
│   ├── root.tsx              # 루트 레이아웃
│   └── routes. ts             # 라우트 설정
├── components/
│   └── magicui/              # 커스텀 UI 컴포넌트
├── public/                   # 정적 파일
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 💡 핵심 기능 상세

### 1. LangGraph 기반 대화 시스템

```typescript
// app/routes/apis/message.ts
const workflow = new StateGraph(MessagesAnnotation)
  .addNode('model', callModel)
  .addEdge(START, 'model')
  .addEdge('model', END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });
```

- **상태 관리**: MessagesAnnotation을 통한 대화 상태 추적
- **메모리 저장**: MemorySaver로 대화 컨텍스트 유지
- **스레드 ID**: 각 세션마다 고유 ID로 대화 이력 관리

### 2. 실시간 스트리밍 응답

```typescript
// Server-Sent Events를 통한 스트리밍
const stream = await app.stream(
  { messages:  currMessage },
  { streamMode: 'messages', configurable: { thread_id } }
);

// 클라이언트에서 fetchEventSource로 수신
fetchEventSource('/api/message', {
  method: 'POST',
  onmessage(event) {
    const { content } = JSON.parse(event.data);
    // 실시간으로 메시지 업데이트
  }
});
```

### 3. AI 프롬프트 엔지니어링

```typescript
// app/. server/model/call.ts
const promptTemplate = ChatPromptTemplate.fromMessages([
  ['system', '마크다운 사용해서 화려하고 멋지게 답변해'],
  ['system', '첫 응답은 희태의 경력 위주로 해줘'],
  ['system', cotInstruction],  // Chain of Thought
  ['system', base],             // 기본 페르소나
  ['system', huiparkInfo],      // 희태 정보
  // ... 블로그 글 정보
  ['placeholder', '{messages}'],
]);
```

### 4. 채팅 UI 컴포넌트

- **자동 스크롤**:  새 메시지가 오면 자동으로 하단으로 스크롤
- **로딩 애니메이션**: 메시지 대기 중 애니메이션 표시
- **마크다운 렌더링**: 코드 블록, 테이블 등 마크다운 완전 지원
- **구문 강조**: highlight.js를 통한 코드 구문 강조
