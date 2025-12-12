import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "@repo/logs";
import type {
	GetSignedUploadUrlHandler,
	GetSignedUrlHander,
} from "../../types";

let s3Client: S3Client | null = null;

const getS3Client = () => {
	if (s3Client) {
		return s3Client;
	}

	const s3Endpoint = process.env.S3_ENDPOINT as string;
	if (!s3Endpoint) {
		throw new Error("Missing env variable S3_ENDPOINT");
	}

	const s3Region = (process.env.S3_REGION as string) || "auto";

	const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID as string;
	if (!s3AccessKeyId) {
		throw new Error("Missing env variable S3_ACCESS_KEY_ID");
	}

	const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY as string;
	if (!s3SecretAccessKey) {
		throw new Error("Missing env variable S3_SECRET_ACCESS_KEY");
	}

	s3Client = new S3Client({
		region: s3Region,
		endpoint: s3Endpoint,
		forcePathStyle: true,
		credentials: {
			accessKeyId: s3AccessKeyId,
			secretAccessKey: s3SecretAccessKey,
		},
	});

	return s3Client;
};

export const getSignedUploadUrl: GetSignedUploadUrlHandler = async (
	path,
	{ bucket },
) => {
	const s3Client = getS3Client();
	try {
		return await getS3SignedUrl(
			s3Client,
			new PutObjectCommand({
				Bucket: bucket,
				Key: path,
				ContentType: "image/jpeg",
			}),
			{
				expiresIn: 60,
			},
		);
	} catch (e) {
		logger.error(e);

		throw new Error("Could not get signed upload url");
	}
};

export const getSignedUrl: GetSignedUrlHander = async (
	path,
	{ bucket, expiresIn },
) => {
	const s3Client = getS3Client();
	try {
		return getS3SignedUrl(
			s3Client,
			new GetObjectCommand({ Bucket: bucket, Key: path }),
			{ expiresIn },
		);
	} catch (e) {
		logger.error(e);
		throw new Error("Could not get signed url");
	}
};

/**
 * 获取文件的公开访问 URL
 * 需要配置 S3_PUBLIC_URL 环境变量（R2 公共开发 URL 或自定义域名）
 * R2 公共 URL 直接映射到 bucket 根目录，路径格式为 {path}
 */
export const getPublicUrl = (path: string, _bucket: string): string => {
	const publicUrl = process.env.S3_PUBLIC_URL;
	if (!publicUrl) {
		throw new Error(
			"Missing env variable S3_PUBLIC_URL. Please enable R2 public URL or configure a custom domain.",
		);
	}
	// R2 公共 URL 格式: https://pub-xxx.r2.dev/{path}
	// bucket 参数保留用于兼容性，但 R2 公共 URL 不需要 bucket 前缀
	return `${publicUrl.replace(/\/$/, "")}/${path}`;
};
