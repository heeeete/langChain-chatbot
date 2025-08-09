import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from '@langchain/langgraph';
import type { ActionFunctionArgs } from 'react-router';

import { callModel } from '~/.server/model/call';

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('model', callModel)
  .addEdge(START, 'model')
  .addEdge('model', END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function action(args: ActionFunctionArgs) {
  const { currMessage, thread_id } = await args.request.json();

  const stream = await app.stream(
    { messages: currMessage },
    { streamMode: 'messages', configurable: { thread_id } },
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
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
