// ChatList.tsx
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { motion } from 'motion/react';
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import MessageLoading from '~/components/ui/chat/message-loading';
import { cn } from '~/lib/utils';

interface Props {
  chat: (HumanMessage | AIMessage)[];
}

const ChatList: React.FC<Props> = React.memo(({ chat }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div className="prose-base-custom relative z-10 flex max-w-none flex-col overflow-x-hidden overflow-y-auto py-26">
      {chat.map((msg, i) => {
        if (i === 0) return null;
        return msg instanceof HumanMessage ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              'max-w-1/2 self-end rounded-2xl bg-black/12 px-5 py-1 break-words dark:bg-white/12',
            )}
          >
            {msg.text}
          </motion.div>
        ) : msg.text === 'loading' ? (
          <MessageLoading />
        ) : (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {msg.text}
          </ReactMarkdown>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
});

ChatList.displayName = 'ChatList';

export default ChatList;
