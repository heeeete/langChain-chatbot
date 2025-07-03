import { useNavigate } from "react-router";
import { BorderBeam } from "components/magicui/border-beam";
import { InteractiveHoverButton } from "components/magicui/interactive-hover-button";
import LogoSVG from "~/components/svg/logo.svg?react";
import ChatSVG from "~/components/svg/chat.svg?react";
import GithubSVG from "~/components/svg/github.svg?react";
import TistorySVG from "~/components/svg/tistory.svg?react";

export default function Home() {
	const navigate = useNavigate();
	return (
		<div className="w-vw h-dvh flex flex-col items-center justify-center">
			<div className="translate-y-20 flex flex-col items-center">
				<div className="relative rounded-2xl mb-[42px] ">
					<LogoSVG className="text-primary/20" />
					<BorderBeam
						duration={6}
						size={260}
						className="from-transparent via-primary to-transparent"
						borderWidth={3}
					/>
					<BorderBeam
						duration={6}
						delay={3}
						size={260}
						borderWidth={3}
						className="from-transparent via-primary to-transparent"
					/>
				</div>
				<div className="flex flex-col gap-5">
					<InteractiveHoverButton
						onClick={() => navigate("/chat")}
						className=" px-10 py-5 border-[6px]"
					>
						<span className="flex items-center gap-2 text-4xl font-extrabold ">
							<ChatSVG />
							ASKME
						</span>
					</InteractiveHoverButton>
					<InteractiveHoverButton
						onClick={() => window.open("https://github.com/heeeete", "_blank")}
						className=" px-10 py-5 border-[6px]"
					>
						<span className="flex items-center gap-2 text-4xl font-extrabold ">
							<GithubSVG />
							GITHUB
						</span>
					</InteractiveHoverButton>
					<InteractiveHoverButton
						onClick={() => window.open("https://gaebarsaebal.tistory.com/", "_blank")}
						className=" px-10 py-5 border-[6px]"
					>
						<span className="flex items-center gap-2 text-4xl font-extrabold ">
							<TistorySVG />
							TISTORY
						</span>
					</InteractiveHoverButton>
				</div>
			</div>
		</div>
	);
}
