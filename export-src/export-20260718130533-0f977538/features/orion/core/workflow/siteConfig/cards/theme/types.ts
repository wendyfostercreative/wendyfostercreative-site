export type OrionSiteConfigThemeCardKey = 'theme';

export type OrionSiteConfigThemeMode = 'light' | 'dark' | '';

export type OrionSiteConfigThemeDraft = {
	primary_color: string;
	accent_color: string;
	theme_mode: OrionSiteConfigThemeMode;
};

export type OrionSiteConfigThemeField = keyof OrionSiteConfigThemeDraft;
