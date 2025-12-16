export interface JsonLdProps {
	data: object | Array<object>;
}

/**
 * JSON-LD 结构化数据组件
 * 用于向搜索引擎提供结构化数据，支持富媒体搜索结果
 */
export function JsonLd({ data }: JsonLdProps) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD 需要使用 dangerouslySetInnerHTML，数据经过 JSON.stringify 处理是安全的
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}

/**
 * 多个 JSON-LD Schema 组合组件
 */
export function JsonLdMultiple({ schemas }: { schemas: Array<object> }) {
	return (
		<>
			{schemas.map((schema, index) => (
				<JsonLd key={index} data={schema} />
			))}
		</>
	);
}
