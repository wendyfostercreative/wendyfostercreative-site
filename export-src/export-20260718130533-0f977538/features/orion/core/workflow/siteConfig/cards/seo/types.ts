export type OrionSiteConfigSeoCardKey = 'seo';

export type OrionSiteConfigSeoDraft = {
	seo_title: string | null;
	seo_description: string | null;
};

export type OrionSiteConfigSeoField = keyof OrionSiteConfigSeoDraft;
