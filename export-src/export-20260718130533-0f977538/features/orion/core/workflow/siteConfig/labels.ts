type Translate = (key: string, fallback: string) => string;

export type OrionSiteConfigWorkflowLabels = {
	summaryError: string;
	summaryEmpty: string;
	siteSummaryIntro: string;
	siteSummaryName: string;
	siteSummaryDescription: string;
	siteSummaryLogo: string;
	siteSummaryStyle: string;
	siteSummaryColors: string;
	siteSummaryFont: string;
	siteSummarySeoTitle: string;
	siteSummarySeoDescription: string;
	siteSeoDescriptionHelp: string;
	siteProposalIntro: string;
	siteProposalName: string;
	siteProposalFont: string;
	siteProposalTheme: string;
	siteProposalSeoTitle: string;
	siteProposalSeoDescription: string;
	siteProposalNotes: string;
	sitePreviewBrandingTitle: string;
	sitePreviewBrandingDescription: string;
	sitePreviewTypographyTitle: string;
	sitePreviewTypographyDescription: string;
	sitePreviewThemeTitle: string;
	sitePreviewThemeDescription: string;
	sitePreviewComponentsTitle: string;
	sitePreviewComponentsDescription: string;
	sitePreviewSeoTitle: string;
	sitePreviewSeoDescription: string;
	sitePreviewProposalTitle: string;
	sitePreviewProposalDescription: string;
};

const labelDefinitions: Record<keyof OrionSiteConfigWorkflowLabels, readonly [string, string]> = {
	summaryError: ['admin.orion.assistant.summary_error', 'Orion could not summarize that yet. Check the Orion API route and try again.'],
	summaryEmpty: ['admin.orion.assistant.summary_empty', 'Not sure yet'],
	siteSummaryIntro: ['admin.orion.site_config.summary_intro', 'Here is what I understood for Site Identity & Theme:'],
	siteSummaryName: ['admin.orion.site_config.summary_name', 'Site name'],
	siteSummaryDescription: ['admin.orion.site_config.summary_description', 'Short description'],
	siteSummaryLogo: ['admin.orion.site_config.summary_logo', 'Logo'],
	siteSummaryStyle: ['admin.orion.site_config.summary_style', 'Style words'],
	siteSummaryColors: ['admin.orion.site_config.summary_colors', 'Colors'],
	siteSummaryFont: ['admin.orion.site_config.summary_font', 'Font'],
	siteSummarySeoTitle: ['admin.orion.site_config.summary_seo_title', 'SEO title'],
	siteSummarySeoDescription: ['admin.orion.site_config.summary_seo_description', 'SEO description'],
	siteSeoDescriptionHelp: ['admin.orion.site_config.seo_description_help', 'A search description is the short text Google or link previews may show under your site name. For this site, we can turn your words into a simple one-sentence description.'],
	siteProposalIntro: ['admin.orion.site_config.proposal_intro', 'Ready to save Site Identity & Theme'],
	siteProposalName: ['admin.orion.site_config.proposal_name', 'Site name'],
	siteProposalFont: ['admin.orion.site_config.proposal_font', 'Font'],
	siteProposalTheme: ['admin.orion.site_config.proposal_theme', 'Theme'],
	siteProposalSeoTitle: ['admin.orion.site_config.proposal_seo_title', 'SEO title'],
	siteProposalSeoDescription: ['admin.orion.site_config.proposal_seo_description', 'SEO description'],
	siteProposalNotes: ['admin.orion.site_config.proposal_notes', 'Agent notes'],
	sitePreviewBrandingTitle: ['admin.orion.site_config.preview.branding.title', 'Branding Draft Ready'],
	sitePreviewBrandingDescription: ['admin.orion.site_config.preview.branding.description', 'Review or edit the Branding area in the admin page. When it looks right, use APPLY on the card to continue.'],
	sitePreviewTypographyTitle: ['admin.orion.site_config.preview.typography.title', 'Typography Draft Ready'],
	sitePreviewTypographyDescription: ['admin.orion.site_config.preview.typography.description', 'Review or edit the Typography area in the admin page. When it looks right, use APPLY on the card to continue.'],
	sitePreviewThemeTitle: ['admin.orion.site_config.preview.theme.title', 'Theme Draft Ready'],
	sitePreviewThemeDescription: ['admin.orion.site_config.preview.theme.description', 'Review or edit the Theme area in the admin page. When it looks right, use APPLY on the card to continue.'],
	sitePreviewComponentsTitle: ['admin.orion.site_config.preview.components.title', 'Components Draft Ready'],
	sitePreviewComponentsDescription: ['admin.orion.site_config.preview.components.description', 'Review or edit the Components area in the admin page. When it looks right, use APPLY on the card to continue.'],
	sitePreviewSeoTitle: ['admin.orion.site_config.preview.seo.title', 'SEO Draft Ready'],
	sitePreviewSeoDescription: ['admin.orion.site_config.preview.seo.description', 'Review or edit the SEO area in the admin page. When it looks right, use SAVE SETTINGS to continue.'],
	sitePreviewProposalTitle: ['admin.orion.site_config.preview.proposal.title', 'Site Identity & Theme Draft Ready'],
	sitePreviewProposalDescription: ['admin.orion.site_config.preview.proposal.description', 'Review the Site Identity & Theme area in the admin page. If it looks right, use SAVE SETTINGS to continue.'],
};

export function buildSiteConfigWorkflowLabels(t: Translate): OrionSiteConfigWorkflowLabels {
	return Object.fromEntries(
		Object.entries(labelDefinitions).map(([name, [key, fallback]]) => [name, t(key, fallback)]),
	) as OrionSiteConfigWorkflowLabels;
}

export const fallbackSiteConfigWorkflowLabels = buildSiteConfigWorkflowLabels((_key, fallback) => fallback);
