export type HeaderNavLayoutPreset =
	| 'logo-site-inline-split'
	| 'logo-left-links-below-site-left'
	| 'logo-site-center-links-below-center'
	| 'stacked-centered';

export type HeaderNavContentWidth = 'site' | 'wide' | 'full';
export type HeaderNavTextDirection = 'ltr' | 'rtl';

export type HeaderNavHeaderHeight = 'compact' | 'standard' | 'tall' | 'xtall';

export type HeaderNavBrandFontSize = 'sm' | 'md' | 'lg' | 'xl';
export type HeaderNavBrandFontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type HeaderNavBrandLetterSpacing = 'narrow' | 'normal' | 'wide';
export type HeaderNavBrandGap = 'tight' | 'normal' | 'wide';
export type HeaderNavBrandLogoHeight = 'sm' | 'md' | 'lg' | 'xl';

export type HeaderNavFontSize = 'sm' | 'md' | 'lg';
export type HeaderNavFontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type HeaderNavTextTransform = 'none' | 'uppercase';
export type HeaderNavLetterSpacing = 'narrow' | 'normal' | 'wide';
export type HeaderNavLinkSpacing = 'tight' | 'normal' | 'wide';

export type HeaderNavBorderThickness = 'none' | 'thin' | 'medium' | 'thick';

export type HeaderNavSettings = {
	id: number;
	layout_preset: HeaderNavLayoutPreset;
	sticky: boolean;
	header_height: HeaderNavHeaderHeight;
	background_color?: string | null;
	content_width: HeaderNavContentWidth;
	text_direction: HeaderNavTextDirection;

	show_site_name_with_logo: boolean;
	brand_font_size: HeaderNavBrandFontSize;
	brand_font_weight: HeaderNavBrandFontWeight;
	brand_letter_spacing: HeaderNavBrandLetterSpacing;
	brand_font_color?: string | null;
	brand_gap: HeaderNavBrandGap;
	brand_max_logo_height: HeaderNavBrandLogoHeight;

	nav_font_family?: string | null;
	nav_font_size: HeaderNavFontSize;
	nav_font_weight: HeaderNavFontWeight;
	nav_text_transform: HeaderNavTextTransform;
	nav_letter_spacing: HeaderNavLetterSpacing;
	link_spacing: HeaderNavLinkSpacing;
	nav_font_color?: string | null;
	nav_hover_color?: string | null;

	show_bottom_border: boolean;
	border_color?: string | null;
	border_thickness: HeaderNavBorderThickness;

	updated_at?: string;
};

export interface NavItem {
	key: string;
	label: string;
	href: string;
	enabled: boolean;
}