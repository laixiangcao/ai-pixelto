"use client";

import { authClient } from "@repo/auth/client";
import { config } from "@repo/config";
import { Button } from "@ui/components/button";
import { cn } from "@ui/lib";
import { parseAsString, useQueryState } from "nuqs";
import { oAuthProviders } from "../constants/oauth-providers";

export function SocialSigninButton({
	provider,
	className,
}: {
	provider: keyof typeof oAuthProviders;
	className?: string;
}) {
	const [invitationId] = useQueryState("invitationId", parseAsString);
	const providerData = oAuthProviders[provider];

	const redirectPath = invitationId
		? `/organization-invitation/${invitationId}`
		: config.auth.redirectAfterSignIn;

	const onSignin = () => {
		const callbackURL = new URL(redirectPath, window.location.origin);
		authClient.signIn.social({
			provider,
			callbackURL: callbackURL.toString(),
		});
	};

	return (
		<Button
			onClick={() => onSignin()}
			variant="outline"
			type="button"
			className={cn(
				"transition-all duration-200",
				// Light Mode
				"bg-slate-50/50 border border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm text-slate-600 hover:text-slate-900 shadow-none",
				// Dark Mode
				"dark:bg-card/50 dark:border-border/50 dark:hover:bg-card/80 dark:text-foreground dark:shadow-none",
				className,
			)}
		>
			{providerData.icon && (
				<i className="mr-2 text-primary">
					<providerData.icon className="size-4" />
				</i>
			)}
			{providerData.name}
		</Button>
	);
}
