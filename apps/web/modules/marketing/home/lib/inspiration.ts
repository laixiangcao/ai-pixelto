import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_cache } from "next/cache";

export type InspirationItem = {
	id: string;
	category: string;
	original: string;
	edited: string;
};

export type InspirationTab = {
	id: string;
	count: number;
};

 export const getInspirationData = unstable_cache(
	async () => {
		const inspirationDir = path.join(process.cwd(), "public/images/inspiration");

		try {
			const categories = await fs.readdir(inspirationDir, { withFileTypes: true });
			const categoryNames = categories
				.filter((category) => category.isDirectory())
				.map((category) => category.name)
				.sort((a, b) => a.localeCompare(b));

			const results = await Promise.all(
				categoryNames.map(async (categoryName) => {
					const categoryPath = path.join(inspirationDir, categoryName);
					const files = await fs.readdir(categoryPath);

					const imageFiles = files.filter((file) =>
						/\.(png|jpg|jpeg|webp)$/i.test(file),
					);

					const pairs = new Map<string, { original?: string; edited?: string }>();

					for (const file of imageFiles) {
						if (file.includes("-original")) {
							const id = file.replace("-original", "").split(".")[0];
							const current = pairs.get(id) || {};
							current.original = `/images/inspiration/${categoryName}/${file}`;
							pairs.set(id, current);
							continue;
						}

						if (file.includes("-edited")) {
							const id = file.replace("-edited", "").split(".")[0];
							const current = pairs.get(id) || {};
							current.edited = `/images/inspiration/${categoryName}/${file}`;
							pairs.set(id, current);
						}
					}

					const categoryItems: InspirationItem[] = [];
					for (const [id, pair] of Array.from(pairs.entries())) {
						if (!pair.original || !pair.edited) continue;
						categoryItems.push({
							id: `${categoryName}-${id}`,
							category: categoryName,
							original: pair.original,
							edited: pair.edited,
						});
					}

					if (categoryItems.length === 0) return null;
					return {
						tab: { id: categoryName, count: categoryItems.length } satisfies InspirationTab,
						items: categoryItems,
					};
				}),
			);

			const tabs: InspirationTab[] = [];
			const items: InspirationItem[] = [];

			for (const result of results) {
				if (!result) continue;
				tabs.push(result.tab);
				items.push(...result.items);
			}

			return { tabs, items };
		} catch (error) {
			console.error("读取 inspiration 素材失败", { error });
			return { tabs: [], items: [] };
		}
	},
	["marketing-home-inspiration-data"],
	{ revalidate: 60 * 60 },
 );
