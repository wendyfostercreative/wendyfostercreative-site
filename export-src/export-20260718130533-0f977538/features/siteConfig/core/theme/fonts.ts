export const SITE_FONT_KEYS = [
	'system-sans',
	'arial',
	'trebuchet',
	'verdana',
	'georgia',
	'times',
] as const;

export type SiteFontKey = (typeof SITE_FONT_KEYS)[number];

export type SiteFontOption = {
	key: SiteFontKey;
	label: string;
	stack: string;
	category: 'sans' | 'serif';
};

export const DEFAULT_SITE_FONT_KEY: SiteFontKey = 'system-sans';

export const SITE_FONT_OPTIONS: readonly SiteFontOption[] = [
	{
		key: 'system-sans',
		label: 'System Sans',
		stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		category: 'sans',
	},
	{
		key: 'arial',
		label: 'Arial',
		stack: 'Arial, Helvetica, sans-serif',
		category: 'sans',
	},
	{
		key: 'trebuchet',
		label: 'Trebuchet',
		stack: '"Trebuchet MS", sans-serif',
		category: 'sans',
	},
	{
		key: 'verdana',
		label: 'Verdana',
		stack: 'Verdana, Geneva, sans-serif',
		category: 'sans',
	},
	{
		key: 'georgia',
		label: 'Georgia',
		stack: 'Georgia, serif',
		category: 'serif',
	},
	{
		key: 'times',
		label: 'Times',
		stack: '"Times New Roman", Times, serif',
		category: 'serif',
	},
] as const;

const FONT_BY_KEY = new Map<SiteFontKey, SiteFontOption>(
	SITE_FONT_OPTIONS.map((option) => [option.key, option]),
);

const ALIAS_TO_KEY: Record<string, SiteFontKey> = {
	'system sans': 'system-sans',
	'system-sans': 'system-sans',
	'professional': 'system-sans',
	'clean': 'system-sans',
	'modern': 'system-sans',
	'readable': 'system-sans',
	'minimal': 'system-sans',
	'simple': 'system-sans',
	'sharp': 'system-sans',
	'contemporary': 'system-sans',
	'friendly': 'trebuchet',
	'approachable': 'trebuchet',
	'warm': 'trebuchet',
	'casual': 'trebuchet',
	'clear': 'verdana',
	'accessible': 'verdana',
	'practical': 'verdana',
	'plain': 'arial',
	'familiar': 'arial',
	'classic': 'georgia',
	'elegant': 'georgia',
	'editorial': 'georgia',
	'formal': 'georgia',
	'refined': 'georgia',
	'literary': 'georgia',
	'serif': 'georgia',
	'traditional': 'times',
	'conservative': 'times',
	'old school': 'times',
	'old-school': 'times',
	'sans serif': 'system-sans',
	'sans-serif': 'system-sans',
	'arial': 'arial',
	'trebuchet': 'trebuchet',
	'verdana': 'verdana',
	'georgia': 'georgia',
	'times': 'times',
};

function normalizeFontValue(value: string): string {
	return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isSupportedSiteFontKey(value: string): value is SiteFontKey {
	return FONT_BY_KEY.has(value as SiteFontKey);
}

export function siteFontOptionForKey(key: SiteFontKey): SiteFontOption {
	return FONT_BY_KEY.get(key) ?? FONT_BY_KEY.get(DEFAULT_SITE_FONT_KEY)!;
}

export function resolveSiteFontKey(value: string | null | undefined): SiteFontKey | null {
	const raw = String(value ?? '').trim();
	if (!raw) return null;
	if (isSupportedSiteFontKey(raw)) return raw;

	const normalized = normalizeFontValue(raw);
	const aliasKey = ALIAS_TO_KEY[normalized];
	if (aliasKey) return aliasKey;

	for (const option of SITE_FONT_OPTIONS) {
		if (normalizeFontValue(option.label) === normalized) return option.key;
		if (normalizeFontValue(option.stack) === normalized) return option.key;
	}

	return null;
}

export function resolveSiteFontStack(value: string | null | undefined): string | null {
	const raw = String(value ?? '').trim();
	if (!raw) return null;
	const key = resolveSiteFontKey(raw);
	if (key) return siteFontOptionForKey(key).stack;
	return raw;
}

export function siteFontLabelForValue(
	value: string | null | undefined,
	fallback = 'Default',
): string {
	const key = resolveSiteFontKey(value);
	if (!key) return fallback;
	return siteFontOptionForKey(key).label;
}
