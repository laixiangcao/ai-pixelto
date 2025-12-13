import { cn } from "@ui/lib";

export function Logo({
	className,
	iconClassName,
	withText = true,
}: {
	className?: string;
	iconClassName?: string;
	withText?: boolean;
}) {
	return (
		<div className={cn("flex items-center gap-3 group/brand", className)}>
			<div
				className={cn(
					"relative size-10 group/logo shrink-0 select-none",
					iconClassName,
				)}
			>
				{/* Glow Effect */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-emerald-400/10 to-teal-500/20 blur-xl transition-opacity duration-500 rounded-xl opacity-40 dark:opacity-25 group-hover/logo:opacity-100" />

				{/* Container */}
				<div className="bg-gradient-to-b from-card to-muted dark:to-background w-full h-full rounded-xl border border-border/70 ring-1 ring-primary/10 dark:ring-primary/15 relative z-10 shadow-sm shadow-black/5 dark:shadow-black/25 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover/logo:scale-105 group-hover/logo:shadow-primary/15 group-hover/logo:border-primary/30">
					<div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/15 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent opacity-55 mix-blend-overlay pointer-events-none transition-opacity duration-300 group-hover/logo:opacity-80" />
					{/* Fixed Logo: Digital Decay */}
					<div className="relative font-display font-black text-2xl leading-none flex items-center justify-center w-full h-full">
						<span className="text-foreground relative z-10 drop-shadow-sm">
							P
						</span>
						<div className="absolute inset-0 overflow-hidden pointer-events-none">
							<div className="absolute top-1/2 left-[35%] w-1 h-1 bg-primary/80 animate-[drop_2s_infinite]" />
							<div className="absolute top-1/2 right-[30%] w-[3px] h-[3px] bg-emerald-400 animate-[drop_2.5s_infinite_0.4s]" />
							<div className="absolute top-2/3 right-[40%] w-[2px] h-[2px] bg-teal-400 animate-[drop_1.8s_infinite_0.8s]" />
						</div>
						<style>
							{
								"@keyframes drop { 0% { transform: translateY(0); opacity:1; } 60% { opacity: 1; } 100% { transform: translateY(14px); opacity:0; } }"
							}
						</style>
					</div>
				</div>
			</div>

			{withText && (
				<div className="hidden flex-col justify-center md:flex">
					<span className="font-display mb-px mt-0.5 whitespace-nowrap text-xl font-bold leading-none tracking-tight text-foreground">
						Pixelto{" "}
						<span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-500 bg-clip-text text-transparent group-hover/brand:animate-gradient-x">
							AI
						</span>
					</span>
					<span className="whitespace-nowrap text-[0.6rem] font-bold uppercase leading-none tracking-[0.24em] text-muted-foreground/80 ml-0.5">
						Pixels to Everything
					</span>
				</div>
			)}
		</div>
	);
}
