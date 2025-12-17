import showcaseData from "@marketing/home/data/showcase.json";

export type ShowcaseItem = {
	img: string;
	desc: string;
	prompt?: string;
	isOriginal?: boolean;
	uiPrompt?: string;
};

export type ShowcaseStyle = {
	style: string;
	items: ShowcaseItem[];
};

export type ShowcaseData = ShowcaseStyle[];

export function getShowcaseData(): ShowcaseData {
	return showcaseData as ShowcaseData;
}

export function getShowcaseStyles(): string[] {
	return showcaseData.map((s) => s.style);
}
