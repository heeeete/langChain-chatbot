import { InteractiveHoverButton } from 'components/magicui/interactive-hover-button';
import { useNavigate } from 'react-router';

import ChatSVG from '~/components/svg/chat.svg?react';
import GithubSVG from '~/components/svg/github.svg?react';
import LightLogoSVG from '~/components/svg/light-logo.svg?react';
import LogoSVG from '~/components/svg/logo.svg?react';
import TistorySVG from '~/components/svg/tistory.svg?react';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-col items-center md:translate-y-20">
        <div className="relative mb-[42px] rounded-2xl">
          <LogoSVG className="hidden text-primary/20 dark:block" />
          <LightLogoSVG className="dark:hidden" />
        </div>
        <div className="flex flex-col gap-5">
          <InteractiveHoverButton
            onClick={() => navigate('/chat')}
            className="flex h-[83px] items-center border-[6px] px-10 py-5 text-black/5 dark:text-white/5"
          >
            <span className="flex items-center gap-2 text-4xl font-extrabold max-md:text-2xl">
              <ChatSVG className="max-md:w-7" />
              ASKME
            </span>
          </InteractiveHoverButton>
          <InteractiveHoverButton
            onClick={() => window.open('https://github.com/heeeete', '_blank')}
            className="flex h-[83px] items-center border-[6px] px-10 py-5 text-black/5 dark:text-white/5"
          >
            <span className="flex items-center gap-2 text-4xl font-extrabold max-md:text-2xl">
              <GithubSVG className="max-md:w-7" />
              GITHUB
            </span>
          </InteractiveHoverButton>
          <InteractiveHoverButton
            onClick={() => window.open('https://gaebarsaebal.tistory.com/', '_blank')}
            className="flex h-[83px] items-center border-[6px] px-10 py-5 text-black/5 dark:text-white/5"
          >
            <span className="flex items-center gap-2 text-4xl font-extrabold max-md:text-2xl">
              <TistorySVG className="max-md:w-7" />
              TISTORY
            </span>
          </InteractiveHoverButton>
        </div>
      </div>
    </div>
  );
}
