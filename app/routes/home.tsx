import { useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { SystemMessage, HumanMessage, AIMessage, trimMessages } from "@langchain/core/messages";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Index() {
	const [currMessage, setCurrMessage] = useState([]);
	const [currConfig, setCurrConfig] = useState(uuidv4());

	const [isComposing, setIsComposing] = useState(false); // 조합 상태
	const [message, setMessage] = useState("");
	const textareaRef = useRef(null);

	const sendMessage = async () => {
		if (message.trim().length === 0) return;

		const currMessage = new HumanMessage(message);

		const res = await fetch("/api/message", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				currMessage,
				thread_id: currConfig,
			}),
		});

		const a = await res.json();
		console.log(currMessage);

		setCurrMessage(a.messages);
	};

	const handleInput = () => {
		const textarea = textareaRef.current as HTMLTextAreaElement | null;
		if (!textarea) return;

		const lineHeight = 24; // 줄 높이(px), 필요에 따라 조정
		const maxRows = 5;

		textarea.style.height = "auto"; // 높이 초기화
		const newHeight = Math.min(textarea.scrollHeight, lineHeight * maxRows);
		textarea.style.height = `${newHeight}px`;
	};

	console.log(currMessage);

	return (
		<div className="">
			<div>현재 채팅방 {currConfig}</div>
			<div className=" w-full p-4 space-y-4 overflow-y-auto mb-10">
				{currMessage.map((e, idx) => {
					return (
						<>
							<div
								className={`prose prose-xl max-w-none prose-blue ${
									e.id.some((v) => v === "HumanMessage") && "text-right"
								}`}
							>
								<ReactMarkdown remarkPlugins={[remarkGfm]}>{e.kwargs.content}</ReactMarkdown>
							</div>
						</>
					);
				})}
			</div>
			<div className="bg-gray-300 flex items-center  p-2 fixed bottom-0 w-dvw">
				<textarea
					ref={textareaRef}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					rows={1}
					className="w-full p-[4px_8px] outline-none resize-none  bg-gray-200"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							console.log("HELLO");
							if (isComposing) return; // 한글 조합 중이면 Enter 무시

							e.preventDefault();
							setMessage("");
							sendMessage();
							setTimeout(() => {
								handleInput();
							}, 0);
						}
					}}
					onCompositionStart={() => setIsComposing(true)} // 한글 조합 시작
					onCompositionEnd={() => setIsComposing(false)} // 한글 조합 끝
					onInput={handleInput}
				></textarea>
			</div>
		</div>
	);
}
