import {
	HEADER_NAV_BORDER_THICKNESSES,
	HEADER_NAV_BRAND_FONT_SIZES,
	HEADER_NAV_BRAND_GAPS,
	HEADER_NAV_FONT_SIZES,
	HEADER_NAV_FONT_WEIGHTS,
	HEADER_NAV_HEADER_HEIGHTS,
	HEADER_NAV_LETTER_SPACINGS,
	HEADER_NAV_LINK_GAPS,
	HEADER_NAV_LOGO_HEIGHTS,
} from './defaults';

function lookupDefault<T extends Record<string, string>>(
	values: T,
	value: unknown,
	fallback: T[keyof T],
): string {
	if (typeof value === 'string' && value in values) {
		return values[value as keyof T];
	}
	return fallback;
}

// HEADER HEIGHT
export function headerNavHeaderHeightToCssValue(preset: unknown): string {
	return lookupDefault(HEADER_NAV_HEADER_HEIGHTS, preset, HEADER_NAV_HEADER_HEIGHTS.standard);
}

// LINK SPACING (nav gap)
export function headerNavLinkSpacingToCssGap(preset: unknown): string {
	return lookupDefault(HEADER_NAV_LINK_GAPS, preset, HEADER_NAV_LINK_GAPS.normal);
}

// FONT SIZE (shared nav usage)
export function headerNavFontSizeToCssValue(preset: unknown): string {
	return lookupDefault(HEADER_NAV_FONT_SIZES, preset, HEADER_NAV_FONT_SIZES.md);
}

// BRAND FONT SIZE (separate scale)
export function headerNavBrandFontSizeToCssValue(preset: unknown): string {
	return lookupDefault(HEADER_NAV_BRAND_FONT_SIZES, preset, HEADER_NAV_BRAND_FONT_SIZES.md);
}

// FONT WEIGHT
export function headerNavFontWeightToCssValue(preset: unknown): string {
	return lookupDefault(HEADER_NAV_FONT_WEIGHTS, preset, HEADER_NAV_FONT_WEIGHTS.normal);
}

// LETTER SPACING
export function headerNavLetterSpacingToCssValue(preset: unknown): string {
	return lookupDefault(HEADER_NAV_LETTER_SPACINGS, preset, HEADER_NAV_LETTER_SPACINGS.normal);
}

// BRAND GAP (logo + text spacing)
export function headerNavBrandGapToCssValue(preset: unknown): string {
	return lookupDefault(HEADER_NAV_BRAND_GAPS, preset, HEADER_NAV_BRAND_GAPS.normal);
}

// LOGO HEIGHT
export function headerNavLogoHeightToCssValue(preset: unknown): string {
	return lookupDefault(HEADER_NAV_LOGO_HEIGHTS, preset, HEADER_NAV_LOGO_HEIGHTS.md);
}

// BORDER THICKNESS
export function headerNavBorderThicknessToCssValue(preset: unknown): string {
	return lookupDefault(HEADER_NAV_BORDER_THICKNESSES, preset, HEADER_NAV_BORDER_THICKNESSES.thin);
}