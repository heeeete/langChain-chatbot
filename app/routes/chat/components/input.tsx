import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { MessageState } from '~/common/constant';
import { Textarea } from '~/components/ui/textarea';

export default function Input({
  inProgress,
  sendMessage,
}: {
  inProgress: MessageState;
  sendMessage: (message: string) => void;
}) {
  const [input, setInput] = useState('');
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
      transition={{ duration: 0.2, ease: 'linear' }}
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 bg-background py-8 max-sm:px-4"
    >
      <Textarea
        ref={textareaRef}
        placeholder="희태에 대해 궁금한 점을 물어보세요!"
        disabled={inProgress !== MessageState.Idle}
        className="max-h-[144px] min-h-4 resize-none !text-[16px]"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (isComposing) return;

          if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            setInput((prev) => prev + '\n');
          } else if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage(input);
            setInput('');
          }
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
      />
    </motion.div>
  );
}
