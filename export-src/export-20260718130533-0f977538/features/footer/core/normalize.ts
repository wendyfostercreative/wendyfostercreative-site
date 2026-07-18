import { asBoolean, asNumber, asObject, asString } from '../../../lib/normalize';

import type {
	FooterBorderThickness,
	FooterBrandLayout,
	FooterContent,
	FooterContentWidth,
	FooterCopyrightMode,
	FooterCustomLink,
	FooterLayoutPreset,
	FooterLinkLayout,
	FooterLinkTarget,
	FooterLogoHeight,
	FooterSettings,
	FooterSocialLink,
	FooterTextDirection,
} from './types';

const DEFAULT_COPYRIGHT_TEXT = '\u00a9 {year} {site_name}';

function nullableString(value: unknown): string | null {
	const v = asString(value).trim();
	return v ? v : null;
}

function asLayoutPreset(value: unknown): FooterLayoutPreset {
	const v = asString(value).trim();
	if (v === 'minimal' || v === 'brand-links-copyright' || v === 'columns' || v === 'centered') {
		return v;
	}
	return 'brand-links-copyright';
}

function asContentWidth(value: unknown): FooterContentWidth {
	const v = asString(value).trim();
	if (v === 'site' || v === 'wide' || v === 'full') return v;
	return 'site';
}

function asTextDirection(value: unknown): FooterTextDirection {
	const v = asString(value).trim();
	if (v === 'ltr' || v === 'rtl') return v;
	return 'ltr';
}

function asBrandLayout(value: unknown): FooterBrandLayout {
	const v = asString(value).trim();
	if (v === 'inline' || v === 'stacked') return v;
	return 'stacked';
}

function asLogoHeight(value: unknown): FooterLogoHeight {
	const v = asString(value).trim();
	if (v === 'sm' || v === 'md' || v === 'lg') return v;
	return 'sm';
}

function asLinkLayout(value: unknown): FooterLinkLayout {
	const v = asString(value).trim();
	if (v === 'inline' || v === 'columns' || v === 'stacked') return v;
	return 'inline';
}

function asLinkTarget(value: unknown): FooterLinkTarget {
	const v = asString(value).trim();
	if (v === 'self' || v === 'blank') return v;
	return 'self';
}

function asCopyrightMode(value: unknown): FooterCopyrightMode {
	const v = asString(value).trim();
	if (v === 'generated' || v === 'custom' || v === 'hidden') return v;
	return 'generated';
}

function asBorderThickness(value: unknown): FooterBorderThickness {
	const v = asString(value).trim();
	if (v === 'none' || v === 'thin' || v === 'medium' || v === 'thick') return v;
	return 'thin';
}

function asArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [];
}

function normalizeCustomLink(input: unknown, index: number): FooterCustomLink {
	const data = asObject(input);

	return {
		id: nullableString(data.id) ?? `link-${index}`,
		label: asString(data.label).trim(),
		href: asString(data.href).trim(),
		target: asLinkTarget(data.target),
	};
}

function normalizeSocialLink(input: unknown, index: number): FooterSocialLink {
	const data = asObject(input);
	const platform = asString(data.platform).trim();

	return {
		id: nullableString(data.id) ?? (platform || `social-${index}`),
		platform,
		label: asString(data.label).trim() || platform,
		href: asString(data.href).trim(),
	};
}

export function normalizeFooterContent(input: unknown): FooterContent {
	const data = asObject(input);
	const copyright = asObject(data.copyright);

	return {
		tagline: asString(data.tagline).trim(),
		custom_links: asArray(data.custom_links).map((item, index) => normalizeCustomLink(item, index + 1)),
		social_links: asArray(data.social_links).map((item, index) => normalizeSocialLink(item, index + 1)),
		copyright: {
			mode: asCopyrightMode(copyright.mode),
			text: asString(copyright.text).trim() || DEFAULT_COPYRIGHT_TEXT,
		},
	};
}

export function normalizeFooterSettings(input: unknown): FooterSettings {
	const data = asObject(input);

	return {
		id: asNumber(data.id) ?? 1,
		enabled: asBoolean(data.enabled, true),
		layout_preset: asLayoutPreset(data.layout_preset),
		content_width: asContentWidth(data.content_width),
		background_color: nullableString(data.background_color),
		text_color: nullableString(data.text_color),
		text_direction: asTextDirection(data.text_direction),

		show_logo: asBoolean(data.show_logo, false),
		show_site_name: asBoolean(data.show_site_name, true),
		brand_layout: asBrandLayout(data.brand_layout),
		logo_max_height: asLogoHeight(data.logo_max_height),

		show_page_links: asBoolean(data.show_page_links, true),
		show_custom_links: asBoolean(data.show_custom_links, false),
		link_layout: asLinkLayout(data.link_layout),

		show_tagline: asBoolean(data.show_tagline, false),
		show_social_links: asBoolean(data.show_social_links, false),
		show_copyright: asBoolean(data.show_copyright, true),

		show_top_border: asBoolean(data.show_top_border, true),
		border_color: nullableString(data.border_color),
		border_thickness: asBorderThickness(data.border_thickness),

		content_json: normalizeFooterContent(data.content_json),
		updated_at: nullableString(data.updated_at) ?? undefined,
	};
}
