import { config } from "@repo/config";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import type React from "react";
import { forwardRef, useMemo } from "react";

const avatars = [
	"/images/avatar/avatar_1.png",
	"/images/avatar/avatar_2.png",
	"/images/avatar/avatar_3.png",
	"/images/avatar/avatar_4.png",
	"/images/avatar/avatar_5.png",
];

type UserAvatarProps = React.ComponentPropsWithoutRef<typeof Avatar> & {
	name: string;
	avatarUrl?: string | null;
};

export const UserAvatar = forwardRef<React.ElementRef<typeof Avatar>, UserAvatarProps>(
	({ name, avatarUrl, className, ...rest }, ref) => {
		const initials = useMemo(
			() =>
				name
					.split(" ")
					.slice(0, 2)
					.map((n) => n[0])
					.join(""),
			[name],
		);

		const avatarSrc = useMemo(() => {
			if (avatarUrl) {
				return avatarUrl.startsWith("http")
					? avatarUrl
					: `/image-proxy/${config.storage.bucketNames.avatars}/${avatarUrl}`;
			}
			// Fallback to deterministic random avatar
			const hash = Math.abs(
				name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0),
			);
			return avatars[hash % avatars.length];
		}, [avatarUrl, name]);

		return (
			<Avatar ref={ref} className={className} {...rest}>
				<AvatarImage src={avatarSrc} alt={name} />
				<AvatarFallback className="bg-secondary/10 text-secondary">
					{initials}
				</AvatarFallback>
			</Avatar>
		);
	},
);

UserAvatar.displayName = "UserAvatar";
