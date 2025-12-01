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
		<div className={cn("flex items-center gap-3", className)}>
			<div
				className={cn(
					"relative size-10 group/logo shrink-0 select-none",
					iconClassName,
				)}
			>
				{/* Glow Effect */}
				<div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 blur-md transition-opacity rounded-lg opacity-0 group-hover/logo:opacity-30" />

				{/* Container */}
				<div className="bg-white dark:bg-slate-900 w-full h-full rounded-lg border border-slate-200 dark:border-white/10 relative z-10 shadow-sm flex items-center justify-center overflow-hidden text-slate-900 dark:text-white transition-transform duration-300 group-hover/logo:scale-105">
					{/* Fixed Logo: Digital Decay (Variant #2 / Index 1) */}
					<div className="relative font-display font-black text-2xl leading-none flex items-center justify-center w-full h-full">
						<span className="text-slate-900 dark:text-white relative z-10">
							P
						</span>
						<div className="absolute inset-0 overflow-hidden">
							<div className="absolute top-1/2 left-1/3 w-1 h-1 bg-slate-900 dark:bg-white animate-[drop_2s_infinite]" />
							<div className="absolute top-1/2 right-1/4 w-1 h-1 bg-slate-900 dark:bg-white animate-[drop_2.5s_infinite_0.5s]" />
							<div className="absolute top-2/3 right-1/3 w-1 h-1 bg-slate-900 dark:bg-white animate-[drop_1.8s_infinite_1s]" />
						</div>
						<style>{`@keyframes drop { 0% { transform: translateY(0); opacity:1; } 100% { transform: translateY(20px); opacity:0; } }`}</style>
					</div>
				</div>
			</div>

			{withText && (
				<div className="hidden flex-col justify-center md:flex">
					<span className="font-display mb-0.5 mt-0.5 whitespace-nowrap text-xl font-bold leading-none tracking-tight text-slate-900 dark:text-white">
						Pixelto{" "}
						<span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
							AI
						</span>
					</span>
					<span className="whitespace-nowrap text-[0.65rem] font-bold uppercase leading-none tracking-[0.2em] text-slate-500 dark:text-slate-400">
						Pixels to Everything
					</span>
				</div>
			)}
		</div>
	);
}
