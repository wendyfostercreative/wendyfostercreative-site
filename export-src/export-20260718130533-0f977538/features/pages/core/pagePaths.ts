export const RESERVED_CMS_PATHS = ['/', '/photos'] as const;
export const RESERVED_CMS_PREFIXES = ['/admin', '/api'] as const;

export function normalizeCmsPagePath(path: string | null | undefined): string {
	let value = String(path || '').trim();
	if (!value) return '/';
	if (!value.startsWith('/')) {
		value = `/${value}`;
	}
	value = value.replace(/\s+/g, '');
	value = value.replace(/\/+ /g, '/');
	if (value !== '/') {
		value = value.replace(/\/+$/, '');
	}
	return value || '/';
}

export function getReservedCmsPathReason(path: string): string | null {
	const normalized = normalizeCmsPagePath(path);
	if (normalized === '/media') {
		return 'The /media route is intentionally owned by media files.';
	}
	if (normalized === '/photos') {
		return 'The /photos route is intentionally owned by the photos landing page.';
	}
	if (RESERVED_CMS_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) {
		return 'Admin and API namespaces are reserved for application routes.';
	}
	return null;
}

export function getCmsPathReasonForTemplate(path: string, template: string | null | undefined): string | null {
	const normalized = normalizeCmsPagePath(path);
	const normalizedTemplate = String(template || '').trim().toLowerCase();

	if (normalized === '/' && normalizedTemplate !== 'home') {
		return 'The root path / is reserved for the Home template.';
	}

	return getReservedCmsPathReason(normalized);
}

export function isReservedCmsPath(path: string): boolean {
	return getReservedCmsPathReason(path) !== null;
}
