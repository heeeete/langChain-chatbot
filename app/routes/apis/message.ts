import { StateGraph, MessagesAnnotation, MemorySaver, START, END } from "@langchain/langgraph";
import callModel from "~/.server/model/call";

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

	return new Response(JSON.stringify({ messages: result.messages }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
