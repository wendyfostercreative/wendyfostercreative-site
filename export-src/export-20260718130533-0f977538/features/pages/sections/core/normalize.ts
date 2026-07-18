import { PAGE_SECTIONS_SCHEMA, type PageSection, type PageSectionsContent } from './types';

function asObject(value: unknown): Record<string, unknown> {
	return value && typeof value === 'object' && !Array.isArray(value)
		? value as Record<string, unknown>
		: {};
}

function asString(value: unknown, fallback = ''): string {
	if (value == null) return fallback;
	return String(value).trim() || fallback;
}

export function createPageSectionId(): string {
	const random = Math.random().toString(36).slice(2, 10);
	return `sec_${random}`;
}

export function isPageSectionsContent(value: unknown): value is PageSectionsContent {
	const raw = asObject(value);
	return raw.schema === PAGE_SECTIONS_SCHEMA && Array.isArray(raw.sections);
}

export function normalizePageSection(value: unknown): PageSection | null {
	const raw = asObject(value);
	const type = asString(raw.type);
	if (!type) return null;

	return {
		id: asString(raw.id, createPageSectionId()),
		type,
		layout: asString(raw.layout, type),
		content: asObject(raw.content),
		...('settings' in raw ? { settings: asObject(raw.settings) } : {}),
	};
}

export function normalizePageSectionsContent(value: unknown): PageSectionsContent {
	const raw = asObject(value);
	const rawSections = Array.isArray(raw.sections) ? raw.sections : [];
	return {
		schema: PAGE_SECTIONS_SCHEMA,
		sections: rawSections
			.map((section) => normalizePageSection(section))
			.filter((section): section is PageSection => Boolean(section)),
	};
}
