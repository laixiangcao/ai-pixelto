import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { SparklesIcon } from "lucide-react";

export default function DesignSystemPage() {
	// const t = useTranslations();

	return (
		<div className="min-h-screen bg-background text-foreground pb-24">
			{/* Header */}
			<div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
				<div className="container mx-auto px-6 py-4 flex justify-between items-center">
					<h1 className="text-xl font-bold font-mono">
						Pixelto Design System
					</h1>
					<div className="text-xs font-mono text-muted-foreground">
						v2.0 • Premium Dark/Light
					</div>
				</div>
			</div>

			<div className="container mx-auto px-6 py-12 space-y-24">
				{/* 1. Colors */}
				<section className="space-y-8">
					<div className="space-y-2">
						<h2 className="text-2xl font-bold">1. Color Palette</h2>
						<p className="text-muted-foreground">
							Semantic variables for consistent theming.
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<ColorCard
							name="Background"
							variable="bg-background"
							hex="var(--background)"
						/>
						<ColorCard
							name="Foreground"
							variable="bg-foreground"
							hex="var(--foreground)"
						/>
						<ColorCard
							name="Card Surface"
							variable="bg-card"
							hex="var(--card)"
						/>
						<ColorCard
							name="Muted"
							variable="bg-muted"
							hex="var(--muted)"
						/>
						<ColorCard
							name="Primary"
							variable="bg-primary"
							hex="var(--primary)"
						/>
						<ColorCard
							name="Border"
							variable="bg-border"
							hex="var(--border)"
						/>
						<ColorCard
							name="Input"
							variable="bg-input"
							hex="var(--input)"
						/>
						<ColorCard
							name="Destructive"
							variable="bg-destructive"
							hex="var(--destructive)"
						/>
					</div>
				</section>

				{/* 2. Typography */}
				<section className="space-y-8">
					<div className="space-y-2">
						<h2 className="text-2xl font-bold">2. Typography</h2>
						<p className="text-muted-foreground">
							Inter / Geist Sans for UI, Monospace for data.
						</p>
					</div>

					<div className="space-y-6 p-8 border border-border rounded-xl bg-card/30">
						<div className="space-y-2">
							<span className="text-xs text-muted-foreground font-mono">
								Display / H1
							</span>
							<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
								Transform Pixels to Magic
							</h1>
						</div>
						<div className="space-y-2">
							<span className="text-xs text-muted-foreground font-mono">
								H2
							</span>
							<h2 className="text-3xl font-bold tracking-tight">
								The Next Generation Editor
							</h2>
						</div>
						<div className="space-y-2">
							<span className="text-xs text-muted-foreground font-mono">
								H3
							</span>
							<h3 className="text-xl font-semibold">
								AI-Powered Features
							</h3>
						</div>
						<div className="space-y-2">
							<span className="text-xs text-muted-foreground font-mono">
								Body
							</span>
							<p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
								Experience the future of image editing. Our
								advanced AI models understand context, lighting,
								and style to deliver professional results in
								seconds.
							</p>
						</div>
						<div className="space-y-2">
							<span className="text-xs text-muted-foreground font-mono">
								Monospace / Caption
							</span>
							<p className="text-sm font-mono text-primary">
								model_id: "gemini-2.0-flash" • latency: 45ms
							</p>
						</div>
					</div>
				</section>

				{/* 3. Components */}
				<section className="space-y-8">
					<div className="space-y-2">
						<h2 className="text-2xl font-bold">
							3. Core Components
						</h2>
						<p className="text-muted-foreground">
							Glassmorphism and premium interactions.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{/* Buttons */}
						<Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm">
							<h3 className="font-semibold">Buttons</h3>
							<div className="flex flex-wrap gap-4 items-center">
								<Button>Default Button</Button>
								<Button variant="secondary">Secondary</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="ghost">Ghost</Button>
								<Button variant="error">Destructive</Button>
							</div>
							<div className="pt-4 border-t border-border">
								<h4 className="text-sm font-mono text-muted-foreground mb-4">
									Premium Glow (Custom)
								</h4>
								<button
									type="button"
									className="relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-[0_0_20px_-5px_var(--primary)] hover:shadow-[0_0_25px_-5px_var(--primary)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
								>
									<SparklesIcon className="w-4 h-4" />
									Generate Magic
								</button>
							</div>
						</Card>

						{/* Inputs */}
						<Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm">
							<h3 className="font-semibold">Inputs & Forms</h3>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label>Standard Input</Label>
									<Input placeholder="Enter your prompt..." />
								</div>
								<div className="space-y-2">
									<Label>Glass Input (Custom)</Label>
									<div className="relative">
										<input
											type="text"
											placeholder="Describe your imagination..."
											className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
										/>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</section>

				{/* 4. AI Editor Concept */}
				<section className="space-y-8">
					<div className="space-y-2">
						<h2 className="text-2xl font-bold">
							4. AI Floating Island Concept
						</h2>
						<p className="text-muted-foreground">
							The proposed new layout for the editor controls.
						</p>
					</div>

					<div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-border bg-background/50 flex items-center justify-center">
						{/* Background Grid */}
						<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />

						{/* Floating Bar */}
						<div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
							<div className="relative bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-2">
								{/* Model Selector */}
								<button
									type="button"
									className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
								>
									<div className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
									<span>Gemini 2.0</span>
								</button>

								<div className="w-px h-6 bg-border mx-1" />

								{/* Input */}
								<input
									type="text"
									placeholder="Ask AI to change the background..."
									className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 placeholder:text-muted-foreground/70"
								/>

								{/* Generate Button */}
								<button
									type="button"
									className="px-4 py-2 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
								>
									<span>Generate</span>
									<kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-background/20 bg-background/10 px-1.5 font-mono text-[10px] font-medium text-background/70">
										<span className="text-xs">↵</span>
									</kbd>
								</button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

function ColorCard({
	name,
	variable,
	hex,
}: {
	name: string;
	variable: string;
	hex: string;
}) {
	return (
		<div className="p-4 rounded-xl border border-border bg-card space-y-3">
			<div
				className={`w-full h-12 rounded-lg border border-border/50 shadow-sm ${variable}`}
				style={{ backgroundColor: hex }}
			/>
			<div>
				<div className="font-medium text-sm">{name}</div>
				<div className="text-xs font-mono text-muted-foreground mt-1">
					{variable}
				</div>
			</div>
		</div>
	);
}
