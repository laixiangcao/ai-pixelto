import type { Context, Next } from "hono";
import { auth } from "@repo/auth";
import { logger } from "@repo/logs";

/**
 * 生成唯一请求 ID
 */
function generateRequestId(): string {
	return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * 安全序列化对象（处理循环引用和敏感字段）
 */
function safeStringify(obj: unknown, maxLength = 500): string {
	if (obj === undefined || obj === null) {
		return "";
	}
	try {
		const seen = new WeakSet();
		const sanitized = JSON.stringify(obj, (key, value) => {
			// 过滤敏感字段
			if (
				[
					"password",
					"token",
					"secret",
					"authorization",
					"cookie",
				].includes(key.toLowerCase())
			) {
				return "[REDACTED]";
			}
			// 处理循环引用
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return "[Circular]";
				}
				seen.add(value);
			}
			return value;
		});
		return sanitized.length > maxLength
			? `${sanitized.slice(0, maxLength)}...`
			: sanitized;
	} catch {
		return "[Unserializable]";
	}
}

/**
 * 增强日志中间件
 * 记录请求 ID、请求体、响应状态、错误详情和耗时
 */
export async function requestLogger(c: Context, next: Next) {
	const requestId = generateRequestId();
	const startTime = Date.now();
	const method = c.req.method;
	const path = c.req.path;

	// 将 requestId 存入 context 供后续使用
	c.set("requestId", requestId);

	// 尝试获取用户信息
	let userInfo = "";
	try {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});
		if (session?.user) {
			userInfo =
				session.user.name || session.user.email || session.user.id;
		}
	} catch {
		// 获取 session 失败，忽略
	}

	// 尝试获取请求体（仅 POST/PUT/PATCH）
	let bodyStr = "";
	if (["POST", "PUT", "PATCH"].includes(method)) {
		try {
			const clonedReq = c.req.raw.clone();
			const body = await clonedReq.json();
			bodyStr = safeStringify(body);
		} catch {
			// 非 JSON 请求体，忽略
		}
	}

	// 请求开始日志
	const userTag = userInfo ? `[${userInfo}]` : "";
	const logPrefix = `[${requestId}]${userTag}`;
	if (bodyStr) {
		logger.info(`${logPrefix} → ${method} ${path}`, { body: bodyStr });
	} else {
		logger.info(`${logPrefix} → ${method} ${path}`);
	}

	try {
		await next();

		// 请求完成日志
		const duration = Date.now() - startTime;
		const status = c.res.status;

		if (status >= 400) {
			// 错误响应，尝试获取响应体
			let errorBody = "";
			try {
				const clonedRes = c.res.clone();
				const resBody = await clonedRes.json();
				errorBody = safeStringify(resBody);
			} catch {
				// 非 JSON 响应体
			}
			logger.error(
				`${logPrefix} ✗ ${method} ${path} ${status} (${duration}ms)`,
				{
					error: errorBody || `HTTP ${status}`,
				},
			);
		} else {
			logger.info(
				`${logPrefix} ← ${method} ${path} ${status} (${duration}ms)`,
			);
		}
	} catch (error) {
		// 未捕获异常
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		const errorStack = error instanceof Error ? error.stack : undefined;

		logger.error(
			`${logPrefix} ✗ ${method} ${path} EXCEPTION (${duration}ms)`,
			{
				error: errorMessage,
				stack: errorStack,
			},
		);

		throw error;
	}
}
