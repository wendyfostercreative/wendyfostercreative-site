import type { CmsPage } from '../../pages/core/types';

export type MediaCollectionOption = {
	value: string;
	label: string;
	path: string;
};

export function mediaCollectionKeyFromPath(path: string | null | undefined): string {
	const normalized = String(path || '')
		.trim()
		.toLowerCase()
		.replace(/^\/+|\/+$/g, '')
		.split('/')
		.filter(Boolean)
		.at(-1) || '';

	return normalized.replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function uniqueOptions(options: MediaCollectionOption[]): MediaCollectionOption[] {
	const seen = new Set<string>();
	return options.filter((option) => {
		if (!option.value || seen.has(option.value)) return false;
		seen.add(option.value);
		return true;
	});
}

export function mediaCollectionOptionsFromPages(pages: CmsPage[]): MediaCollectionOption[] {
	return uniqueOptions(
		pages
			.filter((page) => String(page.template || '').trim().toLowerCase() === 'media')
			.map((page) => {
				const value = mediaCollectionKeyFromPath(page.path);
				return {
					value,
					label: String(page.title || value).trim() || value,
					path: page.path,
				};
			})
			.filter((option) => Boolean(option.value)),
	);
}
