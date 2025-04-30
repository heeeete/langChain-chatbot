import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation, MemorySaver, START, END } from "@langchain/langgraph";

// LangGraph setup (서버 사이드에서만)
const llm = new ChatOpenAI({
	model: "gpt-4",
	temperature: 0,
	apiKey: process.env.OPENAI_API_KEY,
});
console.log(llm);

const callModel = async (state: typeof MessagesAnnotation.State) => {
	const response = await llm.invoke(state.messages);
	return { messages: response };
};

const workflow = new StateGraph(MessagesAnnotation)
	.addNode("model", callModel)
	.addEdge(START, "model")
	.addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

export const action = async ({ request }: { request: Request }) => {
	const { currMessage, thread_id } = await request.json();
	const config = { configurable: { thread_id } };

	const result = await app.invoke({ messages: currMessage }, config);
	console.log(result.messages);

	return { messages: result.messages };
};
