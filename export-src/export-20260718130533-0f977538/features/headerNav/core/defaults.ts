import type { HeaderNavSettings } from './types';

export const DEFAULT_HEADER_NAV_SETTINGS: HeaderNavSettings = {
	id: 1,

	layout_preset: 'logo-site-inline-split',
	sticky: true,
	header_height: 'standard',
	content_width: 'site',
	text_direction: 'ltr',

	show_site_name_with_logo: true,
	brand_font_size: 'md',
	brand_font_weight: 'semibold',
	brand_letter_spacing: 'normal',
	brand_font_color: null,
	brand_gap: 'normal',
	brand_max_logo_height: 'md',

	background_color: null,

	nav_font_family: null,
	nav_font_size: 'md',
	nav_font_weight: 'normal',
	nav_text_transform: 'none',
	nav_letter_spacing: 'normal',
	link_spacing: 'normal',
	nav_font_color: null,
	nav_hover_color: null,

	show_bottom_border: false,
	border_color: null,
	border_thickness: 'thin',

	updated_at: undefined,
};

export const HEADER_NAV_HEADER_HEIGHTS = {
	compact: '56px',
	standard: '72px',
	tall: '88px',
	xtall: '104px',
} as const;

export const HEADER_NAV_LINK_GAPS = {
	tight: '12px',
	normal: '20px',
	wide: '32px',
} as const;

export const HEADER_NAV_FONT_SIZES = {
	sm: '0.875rem',
	md: '1rem',
	lg: '1.125rem',
} as const;

export const HEADER_NAV_BRAND_FONT_SIZES = {
	sm: '1rem',
	md: '1.25rem',
	lg: '1.5rem',
	xl: '1.75rem',
} as const;

export const HEADER_NAV_FONT_WEIGHTS = {
	normal: '400',
	medium: '500',
	semibold: '600',
	bold: '700',
} as const;

export const HEADER_NAV_LETTER_SPACINGS = {
	narrow: '-0.01em',
	normal: '0em',
	wide: '0.08em',
} as const;

export const HEADER_NAV_BRAND_GAPS = {
	tight: '6px',
	normal: '10px',
	wide: '16px',
} as const;

export const HEADER_NAV_LOGO_HEIGHTS = {
	sm: '28px',
	md: '36px',
	lg: '48px',
	xl: '64px',
} as const;

export const HEADER_NAV_BORDER_THICKNESSES = {
	none: '0px',
	thin: '1px',
	medium: '2px',
	thick: '3px',
} as const;

export const HEADER_NAV_CONTENT_WIDTHS = {
	site: {
		maxWidth: '72rem',
		padding: '0 1rem',
	},
	wide: {
		maxWidth: '90rem',
		padding: '0 1rem',
	},
	full: {
		maxWidth: '100%',
		padding: '0 1.5rem',
	},
} as const;

export const HEADER_NAV_RENDER_DEFAULTS = {
	resolvedSiteName: 'My Site',
	headerBackground: 'var(--site-color-header-bg)',
	headerText: 'var(--site-color-header-text)',
	headerBorder: 'var(--site-color-header-border)',
	navFontFamily: 'var(--site-font-nav)',
	brandFontFamily: 'var(--site-font-siteName)',
	brandLineHeight: '1.1',
	headerHeightCssVar: '--header-nav-height',
	brandGapCssVar: '--header-nav-brand-gap',
	mobileLogoColumnWidth: '9rem',
	mobileMenuIconWidth: '24px',
	mobileMenuIconHeight: '20px',
	mobileMenuIconBarHeight: '2px',
	mobileMenuIconFirstBarTop: '4px',
	mobileMenuIconSecondBarTop: '14px',
	mobileMenuIconOpenBarTop: '9px',
} as const;
