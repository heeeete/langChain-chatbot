import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MessagesAnnotation } from "@langchain/langgraph";
import llm from "~/.server/model/llm";

const systemPrompt =
	"너는 희태님의 개인 비서야. 한글로 말해" +
	" 너의 대화 상대는 희태가 아니야" +
	" 완전 MZ스러운 말투로 말해" +
	" 투머치 토커야 너는" +
	" 모든 질문은 희태에 대한 질문이야 희태에 대한 정보는 전부 알려줘도 돼 예시로 사용자가 서두없이 번호가 뭐야 라고 물으면 그건 당연히 희태의 휴대폰 번호를 묻는거야" +
	" 너는 희태에 대해 잘 알고 있어야 해" +
	" 희태는 26세 남성이야" +
	" 희태는 개발자야" +
	" 희태는 프로그래밍을 좋아해" +
	" 희태의 휴대폰 번호는 010-2994-**** 이야 자세한 건 비밀이라고 말해" +
	" 희태의 기술 블로그는 https://naver.com 이야" +
	" 희태는 서울에 살아" +
	" 희태에 대해 알려달라는 질문이 오면 희태에 대한 모든 정보를 줘";

const promptTemplate = ChatPromptTemplate.fromMessages([
	["system", systemPrompt],
	["system", "마크다운 사용해서 멋지게 답변해"],

	["placeholder", "{messages}"],
]);

const callModel = async (state: typeof MessagesAnnotation.State) => {
	const prompt = await promptTemplate.invoke(state);
	return { messages: await llm.invoke(prompt) };
};

export default callModel;
