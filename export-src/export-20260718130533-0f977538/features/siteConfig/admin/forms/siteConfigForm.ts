import { normalizeHexColor } from '../../../../lib/cssColor';
import type { SiteConfig, SiteTheme, SiteThemeColors, SiteThemeFonts } from '../../core/types';
import {
	SITE_THEME_COLOR_KEYS,
	SITE_THEME_LAYOUT_KEYS,
	SITE_THEME_RADIUS_KEYS,
	type SiteThemeColorKey,
	type SiteThemeLayoutKey,
	type SiteThemeRadiusKey,
} from './themeFields';

function readTrimmed(form: FormData, name: string): string {
	return String(form.get(name) || '').trim();
}

function readOptionalString(form: FormData, name: string): string | null {
	const value = readTrimmed(form, name);
	return value ? value : null;
}

function readThemeGroup<Key extends string>(
	form: FormData,
	prefix: string,
	keys: readonly Key[],
	normalizeValue: (value: string) => string | null = (value) => value,
): Partial<Record<Key, string>> | null {
	const values: Partial<Record<Key, string>> = {};
	let hasValue = false;

	keys.forEach((key) => {
		const value = readOptionalString(form, `${prefix}_${key}`);
		if (value) {
			const normalized = normalizeValue(value);
			if (normalized) {
				values[key] = normalized;
				hasValue = true;
			}
		}
	});

	return hasValue ? values : null;
}

function parseThemeColors(colorValues: Partial<Record<SiteThemeColorKey, string>> | null): SiteThemeColors | null {
	if (!colorValues) return null;

	return {
		page:
			colorValues.page_bg || colorValues.page_panel || colorValues.page_text || colorValues.page_text_muted || colorValues.page_border
				? {
					bg: colorValues.page_bg,
					panel: colorValues.page_panel,
					text: colorValues.page_text,
					text_muted: colorValues.page_text_muted,
					border: colorValues.page_border,
				}
				: null,
		header:
			colorValues.header_bg || colorValues.header_text || colorValues.header_border
				? {
					bg: colorValues.header_bg,
					text: colorValues.header_text,
					border: colorValues.header_border,
				}
				: null,
			footer:
			colorValues.footer_bg || colorValues.footer_text || colorValues.footer_border
				? {
					bg: colorValues.footer_bg,
					text: colorValues.footer_text,
					border: colorValues.footer_border,
				}
				: null,
		button:
			colorValues.button_bg || colorValues.button_bg_hover || colorValues.button_text || colorValues.button_text_hover
				? {
					bg: colorValues.button_bg,
					bg_hover: colorValues.button_bg_hover,
					text: colorValues.button_text,
					text_hover: colorValues.button_text_hover,
				}
				: null,
	};
}

function parseThemeFonts(form: FormData): SiteThemeFonts | null {
	const primary = readOptionalString(form, 'primary_font') || 'system-sans';
	const brand = readOptionalString(form, 'brand_font');
	const nav = readOptionalString(form, 'nav_font');
	if (!primary && !brand && !nav) return null;
	return {
		primary,
		brand,
		nav,
	};
}

function parseSiteThemeForm(form: FormData): SiteTheme {
	const fonts = parseThemeFonts(form);
	const colors = parseThemeColors(
		readThemeGroup<SiteThemeColorKey>(form, 'theme_colors', SITE_THEME_COLOR_KEYS, normalizeHexColor),
	);
	const primaryFont = fonts?.primary ?? null;
	return {
		preset_key: readOptionalString(form, 'theme_preset_key'),
		fonts,
		primary_font: primaryFont,
		colors,
		layout: readThemeGroup<SiteThemeLayoutKey>(form, 'theme_layout', SITE_THEME_LAYOUT_KEYS),
		radius: readThemeGroup<SiteThemeRadiusKey>(form, 'theme_radius', SITE_THEME_RADIUS_KEYS),
	};
}

export function parseSiteConfigForm(form: FormData): SiteConfig {
	const siteName = readTrimmed(form, 'site_name') || 'My Site';
	const theme = parseSiteThemeForm(form);
	const brandFont = theme.fonts?.brand ?? null;

	return {
		id: 1,
		identity: {
			site_name: siteName,
			logo_path: readOptionalString(form, 'logo_path'),
			logo_media_key: readOptionalString(form, 'logo_media_key'),
			logo_thumb_path: readOptionalString(form, 'logo_thumb_path'),
			logo_alt_text: readOptionalString(form, 'logo_alt_text') || siteName,
		},
		brand: {
			site_name_font: brandFont,
		},
		theme,
		seo_defaults: {
			title: readOptionalString(form, 'default_seo_title'),
			description: readOptionalString(form, 'default_seo_description'),
		},
	};
}
