import type { SiteConfig, SiteTheme } from './types';
import { asString, asNumber, asObject } from '../../../lib/normalize';
import { DEFAULT_SITE_FONT_KEY, resolveSiteFontKey } from './theme';

export function normalizeSiteConfig(input: unknown): SiteConfig {
	const data = asObject(input);
	const identity = asObject(data.identity);
	const brand = asObject(data.brand);
	const seoDefaults = asObject(data.seo_defaults);
	const groupedTheme = data.theme && typeof data.theme === 'object' && !Array.isArray(data.theme)
		? (data.theme as SiteTheme)
		: {};
	const hasGroupedShape = Boolean(data.identity || data.brand || data.seo_defaults);
	const themeFonts = groupedTheme.fonts && typeof groupedTheme.fonts === 'object' && !Array.isArray(groupedTheme.fonts)
		? groupedTheme.fonts
		: undefined;
	const brandFont =
		resolveSiteFontKey(asString(themeFonts?.brand) || asString(brand.site_name_font) || asString(data.site_name_font) || '') ||
		null;

	return {
		id: asNumber(data.id) ?? 1,
		identity: {
			site_name: (hasGroupedShape ? asString(identity.site_name) : asString(data.site_name)).trim() || 'My Site',
			logo_path: hasGroupedShape ? asString(identity.logo_path) || null : asString(data.logo_path) || null,
			logo_media_key: hasGroupedShape ? asString(identity.logo_media_key) || null : asString(data.logo_media_key) || null,
			logo_thumb_path: hasGroupedShape ? asString(identity.logo_thumb_path) || null : asString(data.logo_thumb_path) || null,
			logo_alt_text: hasGroupedShape ? asString(identity.logo_alt_text) || null : null,
		},
		brand: {
			site_name_font: brandFont,
		},
		theme: {
			...groupedTheme,
			fonts: {
				primary:
					resolveSiteFontKey(asString(themeFonts?.primary) || groupedTheme.primary_font || asString(data.primary_font) || '') ||
					DEFAULT_SITE_FONT_KEY,
				brand: brandFont,
				nav: resolveSiteFontKey(asString(themeFonts?.nav) || '') || null,
			},
			primary_font:
				resolveSiteFontKey(asString(themeFonts?.primary) || groupedTheme.primary_font || asString(data.primary_font) || '') ||
				DEFAULT_SITE_FONT_KEY,
		},
		seo_defaults: {
			title: hasGroupedShape ? asString(seoDefaults.title) || null : asString(data.default_seo_title) || null,
			description:
				hasGroupedShape ? asString(seoDefaults.description) || null : asString(data.default_seo_description) || null,
		},
	};
}
