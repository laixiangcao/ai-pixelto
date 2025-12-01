"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@ui/components/accordion";
import { useTranslations } from "next-intl";

export function FaqSection() {
	const t = useTranslations("home.faq");

	const items = [
		{
			id: "item-1",
			question: t("q1.question"),
			answer: t("q1.answer"),
		},
		{
			id: "item-2",
			question: t("q2.question"),
			answer: t("q2.answer"),
		},
		{
			id: "item-3",
			question: t("q3.question"),
			answer: t("q3.answer"),
		},
		{
			id: "item-4",
			question: t("q4.question"),
			answer: t("q4.answer"),
		},
	];

	return (
		<section id="faq" className="container max-w-4xl mx-auto px-4">
			<div className="text-center mb-16">
				<h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
				<p className="text-muted-foreground text-lg">{t("subtitle")}</p>
			</div>

			<Accordion type="single" collapsible className="w-full">
				{items.map((item) => (
					<AccordionItem key={item.id} value={item.id}>
						<AccordionTrigger className="text-left text-lg">
							{item.question}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground text-base leading-relaxed">
							{item.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}
