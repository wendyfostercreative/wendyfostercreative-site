export type OrionSiteConfigTypographyCardKey = 'typography';

export type OrionSiteConfigTypographyDraft = {
	primary_font: string;
	brand_font: string | null;
	nav_font: string | null;
};

export type OrionSiteConfigTypographyField = keyof OrionSiteConfigTypographyDraft;
