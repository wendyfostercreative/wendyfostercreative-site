import { asBoolean, asNumber, asObject, asString } from '../../../lib/normalize';

import type {
	HeaderNavBorderThickness,
	HeaderNavBrandFontSize,
	HeaderNavBrandFontWeight,
	HeaderNavBrandGap,
	HeaderNavBrandLetterSpacing,
	HeaderNavBrandLogoHeight,
	HeaderNavContentWidth,
	HeaderNavFontSize,
	HeaderNavFontWeight,
	HeaderNavHeaderHeight,
	HeaderNavLayoutPreset,
	HeaderNavLetterSpacing,
	HeaderNavLinkSpacing,
	HeaderNavSettings,
	HeaderNavTextDirection,
	HeaderNavTextTransform,
} from './types';

function nullableString(value: unknown): string | null {
	const v = asString(value).trim();
	return v ? v : null;
}

function asLayoutPreset(value: unknown): HeaderNavLayoutPreset {
	const v = asString(value).trim();
	if (
		v === 'logo-site-inline-split' ||
		v === 'logo-left-links-below-site-left' ||
		v === 'logo-site-center-links-below-center' ||
		v === 'stacked-centered'
	) {
		return v as HeaderNavLayoutPreset;
	}
	return 'logo-site-inline-split';
}

function asContentWidth(value: unknown): HeaderNavContentWidth {
	const v = asString(value).trim();
	if (v === 'site' || v === 'wide' || v === 'full') return v;
	return 'site';
}

function asTextDirection(value: unknown): HeaderNavTextDirection {
	const v = asString(value).trim();
	if (v === 'ltr' || v === 'rtl') return v;
	return 'ltr';
}

function asHeaderHeight(value: unknown): HeaderNavHeaderHeight {
	const v = asString(value).trim();
	if (v === 'compact' || v === 'standard' || v === 'tall' || v === 'xtall') return v;
	return 'standard';
}

function asBrandFontSize(value: unknown): HeaderNavBrandFontSize {
	const v = asString(value).trim();
	if (v === 'sm' || v === 'md' || v === 'lg' || v === 'xl') return v;
	return 'md';
}

function asBrandFontWeight(value: unknown): HeaderNavBrandFontWeight {
	const v = asString(value).trim();
	if (v === 'normal' || v === 'medium' || v === 'semibold' || v === 'bold') return v;
	return 'semibold';
}

function asBrandLetterSpacing(value: unknown): HeaderNavBrandLetterSpacing {
	const v = asString(value).trim();
	if (v === 'narrow' || v === 'normal' || v === 'wide') return v;
	return 'normal';
}

function asBrandGap(value: unknown): HeaderNavBrandGap {
	const v = asString(value).trim();
	if (v === 'tight' || v === 'normal' || v === 'wide') return v;
	return 'normal';
}

function asBrandLogoHeight(value: unknown): HeaderNavBrandLogoHeight {
	const v = asString(value).trim();
	if (v === 'sm' || v === 'md' || v === 'lg' || v === 'xl') return v;
	return 'md';
}

function asFontSize(value: unknown): HeaderNavFontSize {
	const v = asString(value).trim();
	if (v === 'sm' || v === 'md' || v === 'lg') return v;
	return 'md';
}

function asFontWeight(value: unknown): HeaderNavFontWeight {
	const v = asString(value).trim();
	if (v === 'normal' || v === 'medium' || v === 'semibold' || v === 'bold') return v;
	return 'normal';
}

function asTextTransform(value: unknown): HeaderNavTextTransform {
	const v = asString(value).trim();
	if (v === 'none' || v === 'uppercase') return v;
	return 'none';
}

function asLetterSpacing(value: unknown): HeaderNavLetterSpacing {
	const v = asString(value).trim();
	if (v === 'narrow' || v === 'normal' || v === 'wide') return v;
	return 'normal';
}

function asLinkSpacing(value: unknown): HeaderNavLinkSpacing {
	const v = asString(value).trim();
	if (v === 'tight' || v === 'normal' || v === 'wide') return v;
	return 'normal';
}

function asBorderThickness(value: unknown): HeaderNavBorderThickness {
	const v = asString(value).trim();
	if (v === 'none' || v === 'thin' || v === 'medium' || v === 'thick') return v;
	return 'thin';
}

export function normalizeHeaderNavSettings(input: unknown): HeaderNavSettings {
	const data = asObject(input);

	return {
		id: asNumber(data.id) ?? 1,
		layout_preset: asLayoutPreset(data.layout_preset),
		sticky: asBoolean(data.sticky, true),
		header_height: asHeaderHeight(data.header_height),
		background_color: nullableString(data.background_color),
		content_width: asContentWidth(data.content_width),
		text_direction: asTextDirection(data.text_direction),

		show_site_name_with_logo: asBoolean(data.show_site_name_with_logo, false),
		brand_font_size: asBrandFontSize(data.brand_font_size),
		brand_font_weight: asBrandFontWeight(data.brand_font_weight),
		brand_letter_spacing: asBrandLetterSpacing(data.brand_letter_spacing),
		brand_font_color: nullableString(data.brand_font_color),
		brand_gap: asBrandGap(data.brand_gap),
		brand_max_logo_height: asBrandLogoHeight(data.brand_max_logo_height),

		nav_font_family: nullableString(data.nav_font_family),
		nav_font_size: asFontSize(data.nav_font_size),
		nav_font_weight: asFontWeight(data.nav_font_weight),
		nav_text_transform: asTextTransform(data.nav_text_transform),
		nav_letter_spacing: asLetterSpacing(data.nav_letter_spacing),
		link_spacing: asLinkSpacing(data.link_spacing),
		nav_font_color: nullableString(data.nav_font_color),
		nav_hover_color: nullableString(data.nav_hover_color),

		show_bottom_border: asBoolean(data.show_bottom_border, true),
		border_color: nullableString(data.border_color),
		border_thickness: asBorderThickness(data.border_thickness),

		updated_at: nullableString(data.updated_at) ?? undefined,
	};
}