import type {
	ResolvedSiteTheme,
	SiteTheme,
	SiteThemeButtonColors,
	SiteThemeFooterColors,
	SiteThemeHeaderColors,
	SiteThemePageColors,
} from '../types';
import { DEFAULT_SITE_THEME } from './defaults';
import { resolveSiteFontStack } from './fonts';

type ThemeObject = Record<string, unknown>;

function isObject(value: unknown): value is ThemeObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
	return typeof value === 'string' && value.trim() ? value : null;
}

function resolvePageColors(colors: ThemeObject): Required<Record<keyof SiteThemePageColors, string>> {
	const page = isObject(colors.page) ? colors.page : {};
	return {
		bg: asString(page.bg) ?? asString(colors.bg) ?? DEFAULT_SITE_THEME.colors.page.bg,
		panel: asString(page.panel) ?? asString(colors.panel) ?? DEFAULT_SITE_THEME.colors.page.panel,
		text: asString(page.text) ?? asString(colors.text) ?? DEFAULT_SITE_THEME.colors.page.text,
		text_muted:
			asString(page.text_muted) ?? asString(colors.text_muted) ?? DEFAULT_SITE_THEME.colors.page.text_muted,
		border: asString(page.border) ?? asString(colors.border) ?? DEFAULT_SITE_THEME.colors.page.border,
	};
}

function resolveHeaderColors(
	colors: ThemeObject,
	page: Required<Record<keyof SiteThemePageColors, string>>,
): Required<Record<keyof SiteThemeHeaderColors, string>> {
	const header = isObject(colors.header) ? colors.header : {};
	return {
		bg: asString(header.bg) ?? page.panel,
		text: asString(header.text) ?? page.text,
		border: asString(header.border) ?? asString(colors.border_soft) ?? page.border,
	};
}

function resolveFooterColors(
	colors: ThemeObject,
	page: Required<Record<keyof SiteThemePageColors, string>>,
): Required<Record<keyof SiteThemeFooterColors, string>> {
	const footer = isObject(colors.footer) ? colors.footer : {};
	return {
		bg: asString(footer.bg) ?? DEFAULT_SITE_THEME.colors.footer.bg,
		text: asString(footer.text) ?? page.text,
		border: asString(footer.border) ?? asString(colors.border_soft) ?? page.border,
	};
}

function resolveButtonColors(colors: ThemeObject): Required<Record<keyof SiteThemeButtonColors, string>> {
	const button = isObject(colors.button) ? colors.button : {};
	return {
		bg: asString(button.bg) ?? asString(colors.button_bg) ?? DEFAULT_SITE_THEME.colors.button.bg,
		bg_hover:
			asString(button.bg_hover) ??
			asString(colors.button_bg_hover) ??
			DEFAULT_SITE_THEME.colors.button.bg_hover,
		text: asString(button.text) ?? asString(colors.button_text) ?? DEFAULT_SITE_THEME.colors.button.text,
		text_hover:
			asString(button.text_hover) ??
			asString(colors.button_text_hover) ??
			DEFAULT_SITE_THEME.colors.button.text_hover,
	};
}

export function resolveSiteTheme(input: unknown): ResolvedSiteTheme {
	const theme = isObject(input) ? input : {};
	const themeFonts = isObject(theme.fonts) ? theme.fonts : {};
	const colors = isObject(theme.colors) ? theme.colors : {};
	const layout = isObject(theme.layout) ? theme.layout : {};
	const radius = isObject(theme.radius) ? theme.radius : {};

	const primaryFont =
		resolveSiteFontStack(asString(themeFonts.primary) ?? asString(theme.primary_font)) ??
		DEFAULT_SITE_THEME.fonts.primary;
	const brandFont =
		resolveSiteFontStack(asString(themeFonts.brand)) ??
		primaryFont;
	const navFont =
		resolveSiteFontStack(asString(themeFonts.nav)) ??
		primaryFont;

	const page = resolvePageColors(colors);
	const header = resolveHeaderColors(colors, page);
	const footer = resolveFooterColors(colors, page);
	const button = resolveButtonColors(colors);

	return {
		fonts: {
			primary: primaryFont,
			brand: brandFont,
			nav: navFont,
		},
		colors: {
			page,
			header,
			footer,
			button,
		},
		layout: {
			container_width: asString(layout.container_width) ?? DEFAULT_SITE_THEME.layout.container_width,
			content_width: asString(layout.content_width) ?? DEFAULT_SITE_THEME.layout.content_width,
		},
		radius: {
			card: asString(radius.card) ?? DEFAULT_SITE_THEME.radius.card,
			button: asString(radius.button) ?? DEFAULT_SITE_THEME.radius.button,
			input: asString(radius.input) ?? DEFAULT_SITE_THEME.radius.input,
		},
	};
}
