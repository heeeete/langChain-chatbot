// file: /pages/api/message.ts   (Next.js 예시)
import { StateGraph, MessagesAnnotation, MemorySaver, START, END } from "@langchain/langgraph";
import type { ActionFunctionArgs } from "react-router";
import { callModel } from "~/.server/model/call";

const workflow = new StateGraph(MessagesAnnotation)
	.addNode("model", callModel)
	.addEdge(START, "model")
	.addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

export const config = {
	api: {
		// Vercel 등에서 바디 리더블스트림으로 변환 방지
		bodyParser: false,
	},
};

export async function action(args: ActionFunctionArgs) {
	const { currMessage, thread_id } = await args.request.json();

	// 스트리밍 호출 (message 단위)
	const stream = await app.stream(
		{ messages: currMessage },
		{ streamMode: "messages", configurable: { thread_id } }
	);

	const encoder = new TextEncoder();
	const body = new ReadableStream({
		async start(controller) {
			for await (const [message, _] of stream) {
				const chunk = `data: ${JSON.stringify({ content: message.content })}\n\n`;
				controller.enqueue(encoder.encode(chunk));
			}
			controller.close();
		},
	});

	return new Response(body, {
		status: 200,
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
		},
	});
}
