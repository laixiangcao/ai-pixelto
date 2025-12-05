"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import {
	organizationListQueryKey,
	useCreateOrganizationMutation,
} from "@saas/organizations/lib/api";
import { useRouter } from "@shared/hooks/router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	name: z.string().min(3).max(32),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateOrganizationForm({
	defaultName,
}: {
	defaultName?: string;
}) {
	const t = useTranslations();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { setActiveOrganization } = useActiveOrganization();
	const createOrganizationMutation = useCreateOrganizationMutation();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: defaultName ?? "",
		},
	});

	const onSubmit = form.handleSubmit(async ({ name }) => {
		try {
			const newOrganization =
				await createOrganizationMutation.mutateAsync({
					name,
				});

			if (!newOrganization) {
				throw new Error("Failed to create organization");
			}

			await setActiveOrganization(newOrganization.id);

			await queryClient.invalidateQueries({
				queryKey: organizationListQueryKey,
			});

			router.replace(`/app/${newOrganization.slug}`);
		} catch {
			toast.error(t("organizations.createForm.notifications.error"));
		}
	});

	return (
		<div className="mx-auto w-full max-w-md">
			<h1 className="font-bold text-2xl md:text-3xl text-center bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
				{t("organizations.createForm.title")}
			</h1>
			<p className="mt-2 mb-8 text-center text-muted-foreground">
				{t("organizations.createForm.subtitle")}
			</p>

			<Form {...form}>
				<form onSubmit={onSubmit} className="space-y-6">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t("organizations.createForm.name")}
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										autoComplete="off"
										className="bg-background/50 border-border/50 focus:border-primary/50 h-11"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all h-11"
						type="submit"
						variant="primary"
						loading={form.formState.isSubmitting}
					>
						{t("organizations.createForm.submit")}
					</Button>
				</form>
			</Form>
		</div>
	);
}
