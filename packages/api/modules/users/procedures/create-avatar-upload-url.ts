import { getPublicUrl, getSignedUploadUrl } from "@repo/storage";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const createAvatarUploadUrl = protectedProcedure
	.route({
		method: "POST",
		path: "/users/avatar-upload-url",
		tags: ["Users"],
		summary: "Create avatar upload URL",
		description:
			"Create a signed upload URL to upload an avatar image to the storage bucket",
	})
	.input(
		z.object({
			path: z.string(),
			bucket: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		const { path, bucket } = input;

		const signedUploadUrl = await getSignedUploadUrl(path, { bucket });
		const publicUrl = getPublicUrl(path, bucket);

		return { signedUploadUrl, publicUrl };
	});
