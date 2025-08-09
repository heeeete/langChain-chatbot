import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import { MessageState } from '~/common/constant';
import LightLogoSVG from '~/components/svg/light-logo.svg?react';
import LogoSVG from '~/components/svg/logo.svg?react';
import { useAutoScroll } from '~/components/ui/chat/hooks/useAutoScroll';
import { ScrollArea } from '~/components/ui/scroll-area';
import ChatList from '~/routes/chat/components/chat-list';
import Input from '~/routes/chat/components/input';

export const loader = async () => {
  return {
    threadId: uuidv4(),
    shouldSendInitialMessage: true,
  };
};

export default function Index() {
  const { threadId } = useLoaderData<typeof loader>();
  const [inProgress, setInProgress] = useState<MessageState>(MessageState.Waiting);
  const [chat, setChat] = useState<(HumanMessage | AIMessage)[]>([]);
  const isInitialMount = useRef(true);
  useAutoScroll();
  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    setInProgress(MessageState.Waiting);

    const humanMsg = new HumanMessage(message);
    const LoadingAIMsg = new AIMessage('loading');
    setChat((c) => [...c, humanMsg]);
    setChat((c) => [...c, LoadingAIMsg]);

    fetchEventSource('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currMessage: [...chat, humanMsg], thread_id: threadId }),

      async onopen(_) {
        setChat((c) => [...c.slice(0, -1)]);
      },
      onmessage(event) {
        const { content } = JSON.parse(event.data);
        setInProgress(MessageState.Streaming);

        setChat((c) => {
          const last = c[c.length - 1];
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
    if (isInitialMount.current) {
      isInitialMount.current = false;
      sendMessage('안녕하세요!');
    }
  }, []);

  return (
    <ScrollArea className="h-dvh">
      <div className="mx-auto max-w-3xl max-sm:px-4">
        <ChatList chat={chat} />
        <Input inProgress={inProgress} sendMessage={sendMessage} />
        <LogoSVG className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-white/7 dark:block" />
        <LightLogoSVG className="absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 opacity-30 dark:hidden" />
      </div>
    </ScrollArea>
  );
}
