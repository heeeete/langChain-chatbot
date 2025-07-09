import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
	HTMLButtonElement,
	InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
	return (
		<button
			ref={ref}
			className={cn(
				"group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold border-black/5 dark:border-white/5 ",
				className
			)}
			{...props}
		>
			<div className="flex items-center gap-2">
				<div className="absolute left-1/2 h-2 w-2 invisible rounded-full bg-black/20 dark:bg-white/70 transition-all duration-300 group-hover:visible group-hover:scale-[100.8] "></div>
				<span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 dark:text-white/15 text-black/15 ">
					{children}
				</span>
			</div>
			<div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
				<span>{children}</span>
				<ArrowRight size={40} strokeWidth={4} />
			</div>
		</button>
	);
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
