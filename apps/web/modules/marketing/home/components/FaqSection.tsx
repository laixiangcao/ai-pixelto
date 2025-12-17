"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@ui/components/accordion";

export interface FaqItem {
	id: string;
	question: string;
	answer: string;
}

export interface FaqSectionProps {
	title: string;
	subtitle: string;
	items: FaqItem[];
	id?: string;
}

export function FaqSection({
	title,
	subtitle,
	items,
	id = "faq",
}: FaqSectionProps) {
	return (
		<section id={id} className="container max-w-4xl mx-auto px-4 pt-16">
			<div className="text-center mb-16">
				<h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
				<p className="text-muted-foreground text-lg">{subtitle}</p>
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
