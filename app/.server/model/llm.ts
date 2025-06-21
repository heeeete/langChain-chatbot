import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0.7,
	maxTokens: 2048,
	apiKey: process.env.OPENAI_API_KEY,
});

export default llm;
