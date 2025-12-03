"use client";

import { LoginForm } from "@saas/auth/components/LoginForm";
import { SignupForm } from "@saas/auth/components/SignupForm";
import { Dialog, DialogContent, DialogTitle } from "@ui/components/dialog";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type AuthDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultTab?: "login" | "signup";
};

export function AuthDialog({
	open,
	onOpenChange,
	defaultTab = "login",
}: AuthDialogProps) {
	const t = useTranslations();
	const pathname = usePathname();
	const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);

	useEffect(() => {
		if (open) {
			setActiveTab(defaultTab);
		}
	}, [open, defaultTab]);

	const redirectPath = useMemo(() => {
		if (typeof window === "undefined") {
			return pathname ?? "/";
		}
		return `${window.location.pathname}${window.location.search}`;
	}, [pathname]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-full max-w-md overflow-hidden border-0 p-0 shadow-2xl">
				<DialogTitle className="sr-only">
					{activeTab === "login"
						? t("auth.login.title")
						: t("auth.signup.title")}
				</DialogTitle>
				<div className="p-6 md:p-8">
					{activeTab === "login" ? (
						<LoginForm
							redirectPathOverride={redirectPath}
							onSuccess={() => onOpenChange(false)}
							onSwitchToSignup={() => setActiveTab("signup")}
						/>
					) : (
						<SignupForm
							redirectPathOverride={redirectPath}
							onSuccess={() => onOpenChange(false)}
							onSwitchToLogin={() => setActiveTab("login")}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
