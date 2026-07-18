export type OrionSiteConfigBrandingCardKey = 'branding';

export type OrionSiteConfigBrandingDraft = {
	site_name: string;
	logo_path: string | null;
	logo_alt_text: string | null;
};

export type OrionSiteConfigBrandingField = keyof OrionSiteConfigBrandingDraft;
