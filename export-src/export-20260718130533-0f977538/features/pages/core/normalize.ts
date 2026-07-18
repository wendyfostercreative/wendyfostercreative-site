import type { CmsPage } from './types';
import { asString, asNumber, asObject, asBoolean } from '../../../lib/normalize';

function asPageContent(value: unknown): Record<string, unknown> | unknown[] | null {
	if (value && typeof value === 'object') {
		if (Array.isArray(value)) return value;
		return value as Record<string, unknown>;
	}

	return null;
}

export function normalizeCmsPage(input: unknown): CmsPage {
	const data = asObject(input);

	return {
		id: asNumber(data.id) ?? 0,
		title: asString(data.title),
		path: asString(data.path),
		template: asString(data.template),
		published: asBoolean(data.published, false),

		show_in_nav: asBoolean(data.show_in_nav, false),
		nav_label: asString(data.nav_label) || null,
		nav_order: asNumber(data.nav_order),
		seo_title: asString(data.seo_title) || null,
		seo_description: asString(data.seo_description) || null,

		// TODO: remove content_json fallback after backend fully migrates to `content`
		content: asPageContent(data.content ?? data.content_json ?? null),

		created_at: asString(data.created_at),
		updated_at: asString(data.updated_at),
	};
}