import { LocaleLink } from "@i18n/routing";
import type { ContentStructureItem } from "@shared/lib/content";

function ContentMenuItem({
	label,
	path,
	isPage,
	children,
	activePath,
}: ContentStructureItem & { activePath: string }) {
	return (
		<>
			{isPage ? (
				<LocaleLink
					key={path}
					className={`block rounded-lg px-4 py-1.5 text-sm transition-colors ${
						path === activePath
							? "bg-primary/10 text-primary font-medium"
							: "text-muted-foreground hover:text-foreground hover:bg-muted/50"
					}`}
					href={`/docs/${path}`}
				>
					{label}
				</LocaleLink>
			) : (
				<span key={path} className="block px-4 py-1">
					{label}
				</span>
			)}

			{children && (
				<div className="-mr-4 pl-4">
					{children.map((subItem) => (
						<ContentMenuItem
							key={subItem.path}
							{...subItem}
							activePath={activePath}
						/>
					))}
				</div>
			)}
		</>
	);
}

export function ContentMenu({
	items,
	activePath,
}: {
	items: ContentStructureItem[];
	activePath: string;
}) {
	return (
		<ul className="-mx-4 list-none space-y-2 pr-4">
			{items.map((item) => (
				<ContentMenuItem
					key={item.path}
					{...item}
					activePath={activePath}
				/>
			))}
		</ul>
	);
}
