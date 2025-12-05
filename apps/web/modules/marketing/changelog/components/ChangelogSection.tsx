import { Badge } from "@ui/components/badge";
import { formatDate, formatDistance, parseISO } from "date-fns";
import type { ChangelogItem } from "../types";

export function ChangelogSection({ items }: { items: ChangelogItem[] }) {
	return (
		<section id="changelog">
			<div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-6 text-left">
				{items?.map((item, i) => (
					<div
						key={i}
						className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
					>
						<Badge
							status="info"
							className="border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
							title={formatDate(
								parseISO(item.date),
								"yyyy-MM-dd",
							)}
						>
							{formatDistance(parseISO(item.date), new Date(), {
								addSuffix: true,
							})}
						</Badge>
						<ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
							{item.changes.map((change, j) => (
								<li key={j}>{change}</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
}
