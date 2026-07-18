export type FooterLayoutPreset =
	| 'minimal'
	| 'brand-links-copyright'
	| 'columns'
	| 'centered';

export type FooterContentWidth = 'site' | 'wide' | 'full';
export type FooterTextDirection = 'ltr' | 'rtl';
export type FooterBrandLayout = 'inline' | 'stacked';
export type FooterLogoHeight = 'sm' | 'md' | 'lg';
export type FooterLinkLayout = 'inline' | 'columns' | 'stacked';
export type FooterLinkTarget = 'self' | 'blank';
export type FooterCopyrightMode = 'generated' | 'custom' | 'hidden';
export type FooterBorderThickness = 'none' | 'thin' | 'medium' | 'thick';

export type FooterCustomLink = {
	id: string;
	label: string;
	href: string;
	target: FooterLinkTarget;
};

export type FooterSocialLink = {
	id: string;
	platform: string;
	label: string;
	href: string;
};

export type FooterCopyright = {
	mode: FooterCopyrightMode;
	text: string;
};

export type FooterContent = {
	tagline: string;
	custom_links: FooterCustomLink[];
	social_links: FooterSocialLink[];
	copyright: FooterCopyright;
};

export type FooterSettings = {
	id: number;
	enabled: boolean;
	layout_preset: FooterLayoutPreset;
	content_width: FooterContentWidth;
	background_color?: string | null;
	text_color?: string | null;
	text_direction: FooterTextDirection;

	show_logo: boolean;
	show_site_name: boolean;
	brand_layout: FooterBrandLayout;
	logo_max_height: FooterLogoHeight;

	show_page_links: boolean;
	show_custom_links: boolean;
	link_layout: FooterLinkLayout;

	show_tagline: boolean;
	show_social_links: boolean;
	show_copyright: boolean;

	show_top_border: boolean;
	border_color?: string | null;
	border_thickness: FooterBorderThickness;

	content_json: FooterContent;
	updated_at?: string;
};
