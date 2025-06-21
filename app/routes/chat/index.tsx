import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ChatList from "~/routes/chat/components/chat-list";

import { useAutoScroll } from "~/components/ui/chat/hooks/useAutoScroll";
import { useLoaderData } from "react-router";
import { ScrollArea } from "~/components/ui/scroll-area";
import Input from "~/routes/chat/components/input";
import { MessageState } from "~/common/constant";

export const loader = async () => {
	return {
		threadId: uuidv4(),
	};
};

export default function Index() {
	const { threadId } = useLoaderData<typeof loader>();
	const [inProgress, setInProgress] = useState<MessageState>(MessageState.Waiting);
	const [chat, setChat] = useState<(HumanMessage | AIMessage)[]>([]);
	useAutoScroll();

	const sendMessage = (message: string) => {
		if (!message.trim()) return;
		setInProgress(MessageState.Waiting);

		const humanMsg = new HumanMessage(message);
		const LoadingAIMsg = new AIMessage("loading");
		setChat((c) => [...c, humanMsg]);
		setChat((c) => [...c, LoadingAIMsg]);

		fetchEventSource("/api/message", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ currMessage: [...chat, humanMsg], thread_id: threadId }),

			async onopen(response) {
				setChat((c) => [...c.slice(0, -1)]);
			},
			onmessage(event) {
				const { content } = JSON.parse(event.data);
				setInProgress(MessageState.Streaming);

				setChat((c) => {
					const last = c[c.length - 1];
					// 마지막이 AIMessage라면 덧붙이고, 아니면 새로 추가
					if (last instanceof AIMessage) {
						return [...c.slice(0, -1), new AIMessage(last.text + content)];
					} else {
						return [...c, new AIMessage(content)];
					}
				});
			},
			onclose() {
				setInProgress(MessageState.Idle);
			},
			onerror() {
				setInProgress(MessageState.Idle);
			},
		});
	};

	useEffect(() => {
		sendMessage("안녕하세요!");
	}, []);

	return (
		<ScrollArea className="h-dvh ">
			<div className="max-w-3xl mx-auto max-sm:px-4">
				<ChatList chat={chat} />
				<Input inProgress={inProgress} sendMessage={sendMessage} />
			</div>
		</ScrollArea>
	);
}
