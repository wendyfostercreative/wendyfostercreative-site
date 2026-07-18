export type SiteThemePageColors = {
	bg?: string | null;
	panel?: string | null;
	text?: string | null;
	text_muted?: string | null;
	border?: string | null;
};

export type SiteThemeHeaderColors = {
	bg?: string | null;
	text?: string | null;
	border?: string | null;
};

export type SiteThemeFooterColors = {
	bg?: string | null;
	text?: string | null;
	border?: string | null;
};

export type SiteThemeButtonColors = {
	bg?: string | null;
	bg_hover?: string | null;
	text?: string | null;
	text_hover?: string | null;
};

export type SiteThemeColors = {
	page?: SiteThemePageColors | null;
	header?: SiteThemeHeaderColors | null;
	footer?: SiteThemeFooterColors | null;
	button?: SiteThemeButtonColors | null;

	bg?: string | null;
	panel?: string | null;
	text?: string | null;
	text_muted?: string | null;
	border?: string | null;
	border_soft?: string | null;
	button_bg?: string | null;
	button_bg_hover?: string | null;
	button_text?: string | null;
	button_text_hover?: string | null;
};

export type SiteThemeFonts = {
	primary?: string | null;
	brand?: string | null;
	nav?: string | null;
};

export type SiteThemeLayout = {
	container_width?: string | null;
	content_width?: string | null;
};

export type SiteThemeRadius = {
	card?: string | null;
	button?: string | null;
	input?: string | null;
};

export type SiteTheme = {
	preset_key?: string | null;
	fonts?: SiteThemeFonts | null;
	primary_font?: string | null;
	colors?: SiteThemeColors | null;
	layout?: SiteThemeLayout | null;
	radius?: SiteThemeRadius | null;
};

export type SiteIdentity = {
	site_name: string;
	logo_path?: string | null;
	logo_media_key?: string | null;
	logo_thumb_path?: string | null;
	logo_alt_text?: string | null;
};

export type SiteBrand = {
	site_name_font?: string | null;
};

export type SiteSeoDefaults = {
	title?: string | null;
	description?: string | null;
};

export type SiteConfig = {
	id: number;
	identity: SiteIdentity;
	brand: SiteBrand;
	theme: SiteTheme;
	seo_defaults: SiteSeoDefaults;
};

export type ResolvedSiteTheme = {
	fonts: {
		primary: string;
		brand: string;
		nav: string;
	};
	colors: {
		page: Required<Record<keyof SiteThemePageColors, string>>;
		header: Required<Record<keyof SiteThemeHeaderColors, string>>;
		footer: Required<Record<keyof SiteThemeFooterColors, string>>;
		button: Required<Record<keyof SiteThemeButtonColors, string>>;
	};
	layout: Required<Record<keyof SiteThemeLayout, string>>;
	radius: Required<Record<keyof SiteThemeRadius, string>>;
};
