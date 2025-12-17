import { Img } from "@react-email/components";

function cn(...classes: Array<string | undefined | null | false>) {
	return classes.filter(Boolean).join(" ");
}

function getBaseUrl() {
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return process.env.NEXT_PUBLIC_SITE_URL;
	}
	if (process.env.NEXT_PUBLIC_VERCEL_URL) {
		return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
	}
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function Logo({
	className,
	iconClassName: _iconClassName,
	withText,
	withLabel,
}: {
	className?: string;
	iconClassName?: string;
	withText?: boolean;
	withLabel?: boolean;
}) {
	const resolvedWithText = withText ?? withLabel ?? true;
	const logoUrl = new URL("/images/logo-light.webp", getBaseUrl()).toString();

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<div
				className="shrink-0"
				style={{
					overflow: "hidden",
					borderRadius: "12px",
					border: "1px solid #e3ebf6",
					backgroundColor: "#ffffff",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.12)",
				}}
			>
				<Img
					src={logoUrl}
					alt="Pixelto"
					width={40}
					height={40}
					className="block"
				/>
			</div>
			{resolvedWithText && (
				<div className="flex flex-col justify-center">
					<span className="mb-0.5 mt-0.5 whitespace-nowrap text-xl font-bold leading-none tracking-tight text-slate-900">
						Pixelto{" "}
						<span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
							AI
						</span>
					</span>
					<span className="whitespace-nowrap text-[0.65rem] font-bold uppercase leading-none tracking-[0.2em] text-slate-500">
						Pixels to Everything
					</span>
				</div>
			)}
		</div>
	);
}
