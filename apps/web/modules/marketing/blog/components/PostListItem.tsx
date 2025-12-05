"use client";

import { LocaleLink } from "@i18n/routing";
import type { Post } from "@marketing/blog/types";
import { Badge } from "@ui/components/badge";
import Image from "next/image";

export function PostListItem({ post }: { post: Post }) {
	const { title, excerpt, authorName, image, date, path, authorImage, tags } =
		post;

	return (
		<div className="group flex flex-col rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20">
			{image && (
				<div className="-mx-4 -mt-4 relative mb-6 aspect-16/9 overflow-hidden rounded-xl">
					<Image
						src={image}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
					/>
					<LocaleLink
						href={`/blog/${path}`}
						className="absolute inset-0 z-10"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>
			)}

			<div className="flex-1 space-y-4">
				{tags && tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<Badge
								key={tag}
								status="info"
								className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent"
							>
								#{tag}
							</Badge>
						))}
					</div>
				)}

				<div className="space-y-2">
					<LocaleLink
						href={`/blog/${path}`}
						className="block font-bold text-2xl tracking-tight hover:text-primary transition-colors line-clamp-2"
					>
						{title}
					</LocaleLink>
					{excerpt && (
						<p className="text-muted-foreground leading-relaxed line-clamp-3">
							{excerpt}
						</p>
					)}
				</div>
			</div>

			<div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
				{authorName && (
					<div className="flex items-center gap-3">
						{authorImage && (
							<div className="relative size-8 overflow-hidden rounded-full ring-2 ring-background">
								<Image
									src={authorImage}
									alt={authorName}
									fill
									sizes="32px"
									className="object-cover object-center"
								/>
							</div>
						)}
						<span className="text-sm font-medium text-muted-foreground">
							{authorName}
						</span>
					</div>
				)}

				<time
					dateTime={date}
					className="text-sm text-muted-foreground/60 font-medium"
				>
					{Intl.DateTimeFormat("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					}).format(new Date(date))}
				</time>
			</div>
		</div>
	);
}
