// ChatList.tsx
import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { motion } from "motion/react";

import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { cn } from "~/lib/utils";
import MessageLoading from "~/components/ui/chat/message-loading";

interface Props {
	chat: (HumanMessage | AIMessage)[];
}

const ChatList: React.FC<Props> = React.memo(({ chat }) => {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chat]);

	return (
		<div className="overflow-y-auto prose-base-custom max-w-none flex flex-col py-26 overflow-x-hidden">
			{chat.map((msg, i) => {
				if (i === 0) return null;
				return msg instanceof HumanMessage ? (
					<motion.div
						key={i}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className={cn("text-right bg-accent max-w-1/2 self-end rounded-2xl px-5 py-1 w-fit")}
					>
						{msg.text}
					</motion.div>
				) : msg.text === "loading" ? (
					<MessageLoading />
				) : (
					<ReactMarkdown key={i} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
						{msg.text}
					</ReactMarkdown>
				);
			})}
			<div ref={bottomRef} />
		</div>
	);
});

export default ChatList;
