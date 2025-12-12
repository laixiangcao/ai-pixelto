import { config } from "@repo/config";
import { getPublicUrl } from "@repo/storage";
import { NextResponse } from "next/server";

export const GET = async (
	_req: Request,
	{ params }: { params: Promise<{ path: string[] }> },
) => {
	const { path } = await params;

	if (path.length < 2) {
		return new Response("Invalid path", { status: 400 });
	}

	// 第一段是 bucket，剩余部分是文件路径
	const [bucket, ...rest] = path;
	const filePath = rest.join("/");

	if (bucket === config.storage.bucketNames.avatars) {
		// 直接使用公开 URL，无需预签名
		const publicUrl = getPublicUrl(filePath, bucket);

		return NextResponse.redirect(publicUrl, {
			headers: { "Cache-Control": "max-age=86400" },
		});
	}

	return new Response("Not found", {
		status: 404,
	});
};
