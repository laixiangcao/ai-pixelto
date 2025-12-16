"use client";

import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import { Skeleton } from "@ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { cn } from "@ui/lib";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	CalendarIcon,
	CoinsIcon,
	TrendingDownIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

const CREDIT_TYPE_LABELS: Record<string, string> = {
	DAILY_FREE: "creditUsage.type.dailyFree",
	PURCHASED: "creditUsage.type.purchased",
	SUBSCRIPTION: "creditUsage.type.subscription",
	PROMOTIONAL: "creditUsage.type.promotional",
};

const CREDIT_TYPE_COLORS: Record<string, string> = {
	DAILY_FREE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
	PURCHASED:
		"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
	SUBSCRIPTION:
		"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
	PROMOTIONAL:
		"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export function CreditUsage({ organizationId }: { organizationId?: string }) {
	const t = useTranslations();
	const format = useFormatter();
	const [activeTab, setActiveTab] = useState<"summary" | "spends" | "grants">(
		"summary",
	);
	const [spendsOffset, setSpendsOffset] = useState(0);
	const [grantsOffset, setGrantsOffset] = useState(0);

	const { data: summaryData, isLoading: summaryLoading } = useQuery({
		...orpc.payments.getCreditUsage.queryOptions({
			input: {
				organizationId,
				type: "summary",
				days: 30,
			},
		}),
		enabled: activeTab === "summary",
	});

	const { data: spendsData, isLoading: spendsLoading } = useQuery({
		...orpc.payments.getCreditUsage.queryOptions({
			input: {
				organizationId,
				type: "spends",
				limit: 20,
				offset: spendsOffset,
			},
		}),
		enabled: activeTab === "spends",
	});

	const { data: grantsData, isLoading: grantsLoading } = useQuery({
		...orpc.payments.getCreditUsage.queryOptions({
			input: {
				organizationId,
				type: "grants",
				limit: 20,
				offset: grantsOffset,
			},
		}),
		enabled: activeTab === "grants",
	});

	const summary = summaryData?.summary;
	const dailyUsage = summary?.dailyUsage ?? [];
	const maxDailyUsageAmount =
		dailyUsage.length > 0
			? Math.max(...dailyUsage.map((d) => d.amount))
			: 0;

	const formatDate = (dateString: string) => {
		return format.dateTime(new Date(dateString), {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatShortDate = (dateString: string) => {
		return format.dateTime(new Date(dateString), {
			month: "short",
			day: "numeric",
		});
	};

	return (
		<SettingsItem
			title={t("creditUsage.title")}
			description={t("creditUsage.description")}
		>
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as typeof activeTab)}
			>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="summary">
						{t("creditUsage.tabs.summary")}
					</TabsTrigger>
					<TabsTrigger value="spends">
						{t("creditUsage.tabs.spends")}
					</TabsTrigger>
					<TabsTrigger value="grants">
						{t("creditUsage.tabs.grants")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="summary" className="mt-4">
					{summaryLoading ? (
						<div className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<Skeleton className="h-32" />
								<Skeleton className="h-32" />
							</div>
							<Skeleton className="h-48" />
						</div>
					) : summary ? (
						<div className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											{t(
												"creditUsage.summary.totalSpent",
											)}
										</CardTitle>
										<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{format.number(summary.totalSpent)}
										</div>
										<p className="text-xs text-muted-foreground">
											{t(
												"creditUsage.summary.last30Days",
											)}
										</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											{t(
												"creditUsage.summary.totalGranted",
											)}
										</CardTitle>
										<CoinsIcon className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{format.number(
												summary.totalGranted,
											)}
										</div>
										<p className="text-xs text-muted-foreground">
											{t(
												"creditUsage.summary.last30Days",
											)}
										</p>
									</CardContent>
								</Card>
							</div>

							{dailyUsage.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="text-sm font-medium">
											{t(
												"creditUsage.summary.dailyUsage",
											)}
										</CardTitle>
										<CardDescription>
											{t(
												"creditUsage.summary.dailyUsageDescription",
											)}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex items-end gap-1 h-32">
											{dailyUsage.map((day) => {
												const height =
													maxDailyUsageAmount > 0
														? (day.amount /
																maxDailyUsageAmount) *
															100
														: 0;
												return (
													<div
														key={day.date}
														className="flex-1 flex flex-col items-center gap-1"
														title={`${formatShortDate(day.date)}: ${day.amount}`}
													>
														<div
															className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
															style={{
																height: `${Math.max(height, 4)}%`,
															}}
														/>
														<span className="text-[10px] text-muted-foreground rotate-45 origin-left">
															{formatShortDate(
																day.date,
															)}
														</span>
													</div>
												);
											})}
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					) : (
						<div className="text-center py-8 text-muted-foreground">
							{t("creditUsage.noData")}
						</div>
					)}
				</TabsContent>

				<TabsContent value="spends" className="mt-4">
					{spendsLoading ? (
						<Skeleton className="h-64" />
					) : spendsData?.spends?.items.length ? (
						<div className="space-y-4">
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>
												{t("creditUsage.table.date")}
											</TableHead>
											<TableHead>
												{t("creditUsage.table.amount")}
											</TableHead>
											<TableHead>
												{t("creditUsage.table.type")}
											</TableHead>
											<TableHead>
												{t("creditUsage.table.reason")}
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{spendsData.spends.items.map(
											(spend) => (
												<TableRow key={spend.id}>
													<TableCell className="text-sm">
														<div className="flex items-center gap-2">
															<CalendarIcon className="h-4 w-4 text-muted-foreground" />
															{formatDate(
																spend.createdAt,
															)}
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
															<ArrowDownIcon className="h-4 w-4" />
															{format.number(
																spend.amount,
															)}
														</div>
													</TableCell>
													<TableCell>
														<Badge
															className={cn(
																"text-xs",
																CREDIT_TYPE_COLORS[
																	spend
																		.grantType
																],
															)}
														>
															{t(
																CREDIT_TYPE_LABELS[
																	spend
																		.grantType
																],
															)}
														</Badge>
													</TableCell>
													<TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
														{spend.reason || "-"}
													</TableCell>
												</TableRow>
											),
										)}
									</TableBody>
								</Table>
							</div>

							<div className="flex justify-between items-center">
								<p className="text-sm text-muted-foreground">
									{t("creditUsage.pagination.showing", {
										from: spendsOffset + 1,
										to:
											spendsOffset +
											spendsData.spends.items.length,
										total: spendsData.spends.total,
									})}
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										disabled={spendsOffset === 0}
										onClick={() =>
											setSpendsOffset(
												Math.max(0, spendsOffset - 20),
											)
										}
									>
										{t("creditUsage.pagination.previous")}
									</Button>
									<Button
										variant="outline"
										size="sm"
										disabled={!spendsData.spends.hasMore}
										onClick={() =>
											setSpendsOffset(spendsOffset + 20)
										}
									>
										{t("creditUsage.pagination.next")}
									</Button>
								</div>
							</div>
						</div>
					) : (
						<div className="text-center py-8 text-muted-foreground">
							{t("creditUsage.noSpends")}
						</div>
					)}
				</TabsContent>

				<TabsContent value="grants" className="mt-4">
					{grantsLoading ? (
						<Skeleton className="h-64" />
					) : grantsData?.grants?.items.length ? (
						<div className="space-y-4">
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>
												{t("creditUsage.table.date")}
											</TableHead>
											<TableHead>
												{t("creditUsage.table.amount")}
											</TableHead>
											<TableHead>
												{t(
													"creditUsage.table.remaining",
												)}
											</TableHead>
											<TableHead>
												{t("creditUsage.table.type")}
											</TableHead>
											<TableHead>
												{t("creditUsage.table.expires")}
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{grantsData.grants.items.map(
											(grant) => (
												<TableRow key={grant.id}>
													<TableCell className="text-sm">
														<div className="flex items-center gap-2">
															<CalendarIcon className="h-4 w-4 text-muted-foreground" />
															{formatDate(
																grant.createdAt,
															)}
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
															<ArrowUpIcon className="h-4 w-4" />
															{format.number(
																grant.amount,
															)}
														</div>
													</TableCell>
													<TableCell className="font-medium">
														{format.number(
															grant.remainingAmount,
														)}
													</TableCell>
													<TableCell>
														<Badge
															className={cn(
																"text-xs",
																CREDIT_TYPE_COLORS[
																	grant.type
																],
															)}
														>
															{t(
																CREDIT_TYPE_LABELS[
																	grant.type
																],
															)}
														</Badge>
													</TableCell>
													<TableCell className="text-sm text-muted-foreground">
														{grant.expiresAt
															? formatDate(
																	grant.expiresAt,
																)
															: t(
																	"creditUsage.noExpiry",
																)}
													</TableCell>
												</TableRow>
											),
										)}
									</TableBody>
								</Table>
							</div>

							<div className="flex justify-between items-center">
								<p className="text-sm text-muted-foreground">
									{t("creditUsage.pagination.showing", {
										from: grantsOffset + 1,
										to:
											grantsOffset +
											grantsData.grants.items.length,
										total: grantsData.grants.total,
									})}
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										disabled={grantsOffset === 0}
										onClick={() =>
											setGrantsOffset(
												Math.max(0, grantsOffset - 20),
											)
										}
									>
										{t("creditUsage.pagination.previous")}
									</Button>
									<Button
										variant="outline"
										size="sm"
										disabled={!grantsData.grants.hasMore}
										onClick={() =>
											setGrantsOffset(grantsOffset + 20)
										}
									>
										{t("creditUsage.pagination.next")}
									</Button>
								</div>
							</div>
						</div>
					) : (
						<div className="text-center py-8 text-muted-foreground">
							{t("creditUsage.noGrants")}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</SettingsItem>
	);
}
