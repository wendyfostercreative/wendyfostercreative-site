import type { ResolvedSiteTheme, SiteThemeLayout, SiteThemeRadius } from '../../core/types';

export type SiteThemeColorKey =
	| 'page_bg'
	| 'page_panel'
	| 'page_text'
	| 'page_text_muted'
	| 'page_border'
	| 'header_bg'
	| 'header_text'
	| 'header_border'
	| 'footer_bg'
	| 'footer_text'
	| 'footer_border'
	| 'button_bg'
	| 'button_bg_hover'
	| 'button_text'
	| 'button_text_hover';
export type SiteThemeLayoutKey = keyof SiteThemeLayout;
export type SiteThemeRadiusKey = keyof SiteThemeRadius;

type ThemeField<Key extends string> = {
	key: Key;
	label: string;
	name: string;
	id: string;
	value: string;
};

type ThemeColorField<Key extends string> = ThemeField<Key> & {
	section: 'header' | 'main' | 'footer';
};

const COLOR_LABELS: Array<{ key: SiteThemeColorKey; label: string; section: 'header' | 'main' | 'footer' }> = [
	{ key: 'header_bg', label: 'Header background', section: 'header' },
	{ key: 'header_text', label: 'Header text', section: 'header' },
	{ key: 'header_border', label: 'Header border', section: 'header' },
	{ key: 'page_bg', label: 'Page background', section: 'main' },
	{ key: 'page_panel', label: 'Page panel', section: 'main' },
	{ key: 'page_text', label: 'Page text', section: 'main' },
	{ key: 'page_text_muted', label: 'Page muted text', section: 'main' },
	{ key: 'page_border', label: 'Page border', section: 'main' },
	{ key: 'button_bg', label: 'Button background', section: 'main' },
	{ key: 'button_bg_hover', label: 'Button hover background', section: 'main' },
	{ key: 'button_text', label: 'Button text', section: 'main' },
	{ key: 'button_text_hover', label: 'Button hover text', section: 'main' },
	{ key: 'footer_bg', label: 'Footer background', section: 'footer' },
	{ key: 'footer_text', label: 'Footer text', section: 'footer' },
	{ key: 'footer_border', label: 'Footer border', section: 'footer' },
];

const LAYOUT_LABELS: Array<{ key: SiteThemeLayoutKey; label: string }> = [
	{ key: 'container_width', label: 'Container width' },
	{ key: 'content_width', label: 'Content width' },
];

const RADIUS_LABELS: Array<{ key: SiteThemeRadiusKey; label: string }> = [
	{ key: 'card', label: 'Card radius' },
	{ key: 'button', label: 'Button radius' },
	{ key: 'input', label: 'Input field radius' },
];

function colorValue(theme: ResolvedSiteTheme, key: SiteThemeColorKey): string {
	switch (key) {
		case 'page_bg':
			return theme.colors.page.bg;
		case 'page_panel':
			return theme.colors.page.panel;
		case 'page_text':
			return theme.colors.page.text;
		case 'page_text_muted':
			return theme.colors.page.text_muted;
		case 'page_border':
			return theme.colors.page.border;
		case 'header_bg':
			return theme.colors.header.bg;
		case 'header_text':
			return theme.colors.header.text;
		case 'header_border':
			return theme.colors.header.border;
		case 'footer_bg':
			return theme.colors.footer.bg;
		case 'footer_text':
			return theme.colors.footer.text;
		case 'footer_border':
			return theme.colors.footer.border;
		case 'button_bg':
			return theme.colors.button.bg;
		case 'button_bg_hover':
			return theme.colors.button.bg_hover;
		case 'button_text':
			return theme.colors.button.text;
		case 'button_text_hover':
			return theme.colors.button.text_hover;
		default:
			return '';
	}
}

export function getSiteThemeColorFields(theme: ResolvedSiteTheme): Array<ThemeColorField<SiteThemeColorKey>> {
	return COLOR_LABELS.map((field) => ({
		...field,
		name: `theme_colors_${field.key}`,
		id: `theme_colors_${field.key}`,
		value: colorValue(theme, field.key),
	}));
}

export function getSiteThemeLayoutFields(theme: ResolvedSiteTheme): Array<ThemeField<SiteThemeLayoutKey>> {
	return LAYOUT_LABELS.map((field) => ({
		...field,
		name: `theme_layout_${field.key}`,
		id: `theme_layout_${field.key}`,
		value: theme.layout[field.key],
	}));
}

export function getSiteThemeRadiusFields(theme: ResolvedSiteTheme): Array<ThemeField<SiteThemeRadiusKey>> {
	return RADIUS_LABELS.map((field) => ({
		...field,
		name: `theme_radius_${field.key}`,
		id: `theme_radius_${field.key}`,
		value: theme.radius[field.key],
	}));
}

export const SITE_THEME_COLOR_KEYS = COLOR_LABELS.map((field) => field.key);
export const SITE_THEME_LAYOUT_KEYS = LAYOUT_LABELS.map((field) => field.key);
export const SITE_THEME_RADIUS_KEYS = RADIUS_LABELS.map((field) => field.key);
