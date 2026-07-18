import { HEADER_NAV_CONTENT_WIDTHS, HEADER_NAV_RENDER_DEFAULTS } from '../core/defaults';
import type { HeaderNavSettings } from '../core/types';
import {
	headerNavBorderThicknessToCssValue,
	headerNavBrandFontSizeToCssValue,
	headerNavBrandGapToCssValue,
	headerNavFontSizeToCssValue,
	headerNavFontWeightToCssValue,
	headerNavHeaderHeightToCssValue,
	headerNavLetterSpacingToCssValue,
	headerNavLinkSpacingToCssGap,
	headerNavLogoHeightToCssValue,
} from '../core/presets';

function asNonEmptyString(v: unknown): string | undefined {
	if (typeof v !== 'string') return undefined;
	const s = v.trim();
	return s.length ? s : undefined;
}

export type HeaderNavStyleSet = {
	headerStyle: Record<string, string | undefined | null>;
	containerStyle: Record<string, string | undefined | null>;
	brandStyle: Record<string, string | undefined | null>;
	logoStyle: Record<string, string | undefined | null>;
	navStyle: Record<string, string | undefined | null>;
	linkListStyle: Record<string, string | undefined | null>;
	linkStyle: Record<string, string | undefined | null>;
};

function resolveContainerMaxWidth(content_width: HeaderNavSettings['content_width'] | undefined): string {
	return HEADER_NAV_CONTENT_WIDTHS[content_width ?? 'site']?.maxWidth ?? HEADER_NAV_CONTENT_WIDTHS.site.maxWidth;
}

function resolveContainerPadding(content_width: HeaderNavSettings['content_width'] | undefined): string {
	return HEADER_NAV_CONTENT_WIDTHS[content_width ?? 'site']?.padding ?? HEADER_NAV_CONTENT_WIDTHS.site.padding;
}

export function deriveHeaderNavStyles(settings: HeaderNavSettings | null): HeaderNavStyleSet {
	const headerHeight = headerNavHeaderHeightToCssValue(settings?.header_height);
	const backgroundColor = asNonEmptyString(settings?.background_color) ?? HEADER_NAV_RENDER_DEFAULTS.headerBackground;

	const navFontFamily = asNonEmptyString(settings?.nav_font_family);
	const navFontSize = headerNavFontSizeToCssValue(settings?.nav_font_size);
	const navFontWeight = headerNavFontWeightToCssValue(settings?.nav_font_weight);
	const navLetterSpacing = headerNavLetterSpacingToCssValue(settings?.nav_letter_spacing);

	const brandFontSize = headerNavBrandFontSizeToCssValue(settings?.brand_font_size);
	const brandFontWeight = headerNavFontWeightToCssValue(settings?.brand_font_weight);
	const brandLetterSpacing = headerNavLetterSpacingToCssValue(settings?.brand_letter_spacing);
	const brandGap = headerNavBrandGapToCssValue(settings?.brand_gap);
	const logoHeight = headerNavLogoHeightToCssValue(settings?.brand_max_logo_height);

	const navFontColor = asNonEmptyString(settings?.nav_font_color) ?? HEADER_NAV_RENDER_DEFAULTS.headerText;
	const brandFontColor = asNonEmptyString(settings?.brand_font_color) ?? HEADER_NAV_RENDER_DEFAULTS.headerText;
	const borderColor = asNonEmptyString(settings?.border_color) ?? HEADER_NAV_RENDER_DEFAULTS.headerBorder;
	const borderThickness = headerNavBorderThicknessToCssValue(settings?.border_thickness);
	const resolvedNavFontFamily = navFontFamily
		? `var(--site-font-nav, ${navFontFamily})`
		: HEADER_NAV_RENDER_DEFAULTS.navFontFamily;

	const navTextTransform =
		settings?.nav_text_transform === 'uppercase' ? 'uppercase' : undefined;

	const borderBottom =
		settings?.show_bottom_border && borderThickness !== '0px'
			? `${borderThickness} solid ${borderColor}`
			: undefined;

	return {
		headerStyle: {
			'--header-nav-height': headerHeight,
			'--header-nav-brand-gap': brandGap,
			'background-color': backgroundColor,
			'border-bottom': borderBottom,
			'min-height': 'var(--header-nav-height)',
			width: '100%',
			display: 'flex',
			'align-items': 'center',
		},

		containerStyle: {
			'max-width': resolveContainerMaxWidth(settings?.content_width),
			padding: resolveContainerPadding(settings?.content_width),
			width: '100%',
			height: '100%',
			margin: '0 auto',
			display: 'flex',
			'flex-direction': 'column',
			'justify-content': 'center',
		},

		brandStyle: {
			color: brandFontColor,
			'font-size': brandFontSize,
			'font-weight': brandFontWeight,
			'letter-spacing': brandLetterSpacing,
			'line-height': HEADER_NAV_RENDER_DEFAULTS.brandLineHeight,
		},

		logoStyle: {
			'max-height': logoHeight,
			height: 'auto',
			width: 'auto',
		},

		navStyle: {
			'font-family': resolvedNavFontFamily,
			'min-width': '0',
		},

		linkListStyle: {
			display: 'flex',
			gap: headerNavLinkSpacingToCssGap(settings?.link_spacing),
			margin: '0',
			padding: '0',
			'list-style': 'none',
			'align-items': 'center',
		},

		linkStyle: {
			color: navFontColor,
			'font-family': resolvedNavFontFamily,
			'font-size': navFontSize,
			'font-weight': navFontWeight,
			'letter-spacing': navLetterSpacing,
			'text-transform': navTextTransform,
			'text-decoration': 'none',
		},
	};
}
