"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [animationClass, setAnimationClass] = useState("");

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		// Start exit animation
		setAnimationClass("exiting");

		// After exit animation, switch theme and start enter animation
		setTimeout(() => {
			setTheme(resolvedTheme === "light" ? "dark" : "light");
			setAnimationClass("entering");

			// Clear animation class after enter animation completes
			setTimeout(() => setAnimationClass(""), 350);
		}, 120);
	};

	if (!mounted) {
		return (
			<button
				type="button"
				className="inline-flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground"
				aria-label="Toggle theme"
			>
				<div className="w-[18px] h-[18px]" />
			</button>
		);
	}

	const isDark = resolvedTheme === "dark";

	// Animation styles
	const getAnimationStyle = () => {
		if (animationClass === "exiting") {
			return {
				animation:
					"theme-spin-out 0.12s cubic-bezier(0.4, 0, 1, 1) forwards",
			};
		}
		if (animationClass === "entering") {
			return {
				animation:
					"theme-spin-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
			};
		}
		return {};
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="inline-flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-150 cursor-pointer"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			data-test="theme-toggle"
		>
			<div className="relative w-[18px] h-[18px] flex items-center justify-center">
				{isDark ? (
					<MoonIcon
						key="moon"
						className="h-[18px] w-[18px]"
						style={getAnimationStyle()}
					/>
				) : (
					<SunIcon
						key="sun"
						className="h-[18px] w-[18px]"
						style={getAnimationStyle()}
					/>
				)}
			</div>
		</button>
	);
}
