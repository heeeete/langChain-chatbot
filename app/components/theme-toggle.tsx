import Moon from "~/components/svg/moon.svg?react";
import Sun from "~/components/svg/sun.svg?react";

import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="fixed top-4 right-4 z-50">
				<Button variant="ghost" className="w-15 h-15 ">
					<Sun className=" scale-100 rotate-0 duration-500 transition-all dark:scale-0 dark:-rotate-90 !w-15 !h-15" />
					<Moon className="absolute scale-0 rotate-90 !w-15 !h-15 transition-all dark:scale-100 dark:rotate-0 duration-500" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
