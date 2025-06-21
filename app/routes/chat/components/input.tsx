import { useEffect, useRef, useState } from "react";

import { Textarea } from "~/components/ui/textarea";

import { useLoaderData } from "react-router";

import { motion } from "motion/react";
import { type loader } from "~/routes/chat";
import { MessageState } from "~/common/constant";

export default function Input({
	inProgress,
	sendMessage,
}: {
	inProgress: MessageState;
	sendMessage: (message: string) => void;
}) {
	const { threadId } = useLoaderData<typeof loader>();

	const [input, setInput] = useState("");
	const [isComposing, setIsComposing] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		if (inProgress === MessageState.Idle) {
			textareaRef.current?.focus();
		}
	}, [inProgress]);

	return (
		<motion.div
			initial={{ opacity: 0.5, y: 10 }}
			whileHover={{
				opacity: 1,
				y: 0,
			}}
			animate={{ opacity: isFocused ? 1 : 0.5, y: isFocused ? 0 : 10 }}
			transition={{ duration: 0.2, ease: "linear" }}
			className="py-8 bg-background fixed bottom-0  w-full left-1/2 -translate-x-1/2 max-w-3xl max-sm:px-4"
		>
			<Textarea
				ref={textareaRef}
				placeholder="희태에 대해 궁금한 점을 물어보세요!"
				disabled={inProgress !== MessageState.Idle}
				className="min-h-4  resize-none !text-[16px] "
				onFocus={() => setIsFocused(true)} // 포커스 시
				onBlur={() => setIsFocused(false)}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => {
					if (isComposing) return; // 조합 중엔 아무 키도 처리하지 않음

					if (e.key === "Enter" && e.shiftKey) {
						e.preventDefault();
						setInput((prev) => prev + "\n");
					} else if (e.key === "Enter") {
						e.preventDefault();
						sendMessage(input);
						setInput("");
					}
				}}
				onCompositionStart={() => setIsComposing(true)}
				onCompositionEnd={() => setIsComposing(false)}
			></Textarea>
		</motion.div>
	);
}
