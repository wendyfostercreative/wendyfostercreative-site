type Translate = (key: string, fallback: string) => string;

export type OrionSiteProfileWorkflowLabels = {
	summaryIntro: string;
	summarySiteType: string;
	summaryBusinessType: string;
	summaryWork: string;
	summaryAudience: string;
	summaryTemplates: string;
	summaryDefaultPages: string;
	summaryDeferred: string;
	summaryMissing: string;
	summaryEmpty: string;
	summaryError: string;
	proposalIntro: string;
	proposalProfileKey: string;
	proposalDescription: string;
	proposalTemplates: string;
	proposalPages: string;
	proposalNotes: string;
	siteProfileSetupSection: string;
	siteProfilePagesSection: string;
	siteProfileNavigationPages: string;
	previewSiteTypeTitle: string;
	previewSiteTypeDescription: string;
	previewStarterPagesTitle: string;
	previewStarterPagesDescription: string;
	previewProposalTitle: string;
	previewProposalDescription: string;
	confirmedReview: string;
	readyReview: string;
	saveSettingsHint: string;
};

const labelDefinitions: Record<keyof OrionSiteProfileWorkflowLabels, readonly [string, string]> = {
	summaryIntro: ['admin.orion.assistant.summary_intro', 'Here is what I understood:'],
	summarySiteType: ['admin.orion.assistant.summary_site_type', 'Site type'],
	summaryBusinessType: ['admin.orion.assistant.summary_business_type', 'Business type'],
	summaryWork: ['admin.orion.assistant.summary_work', 'Work'],
	summaryAudience: ['admin.orion.assistant.summary_audience', 'Audience'],
	summaryTemplates: ['admin.orion.assistant.summary_templates', 'Templates'],
	summaryDefaultPages: ['admin.orion.assistant.summary_default_pages', 'Starter pages'],
	summaryDeferred: ['admin.orion.assistant.summary_deferred', 'Later in Site Identity & Theme'],
	summaryMissing: ['admin.orion.assistant.summary_missing', 'Still missing'],
	summaryEmpty: ['admin.orion.assistant.summary_empty', 'Not sure yet'],
	summaryError: ['admin.orion.assistant.summary_error', 'Orion could not summarize that yet. Check the Orion API route and try again.'],
	proposalIntro: ['admin.orion.assistant.proposal_intro', 'Ready to apply this Site Profile'],
	proposalProfileKey: ['admin.orion.assistant.proposal_profile_key', 'Profile key'],
	proposalDescription: ['admin.orion.assistant.proposal_description', 'Description'],
	proposalTemplates: ['admin.orion.assistant.proposal_templates', 'Templates'],
	proposalPages: ['admin.orion.assistant.proposal_pages', 'Starter pages'],
	proposalNotes: ['admin.orion.assistant.proposal_notes', 'Agent notes'],
	siteProfileSetupSection: ['admin.orion.assistant.site_profile_setup_section', 'Site Setup'],
	siteProfilePagesSection: ['admin.orion.assistant.site_profile_pages_section', 'Pages'],
	siteProfileNavigationPages: ['admin.orion.assistant.site_profile_navigation_pages', 'Navigation pages'],
	previewSiteTypeTitle: ['admin.orion.site_profile.preview.site_type.title', 'Site Profile Type Preview Ready'],
	previewSiteTypeDescription: ['admin.orion.site_profile.preview.site_type.description', 'Review the Site Profile Type and Starter Pages areas on this page. If they match what you want, use the SAVE SETTINGS button at the bottom of the page.'],
	previewStarterPagesTitle: ['admin.orion.site_profile.preview.starter_pages.title', 'Starter Pages Preview Ready'],
	previewStarterPagesDescription: ['admin.orion.site_profile.preview.starter_pages.description', 'Review the Starter Pages area on this page. If the starter page list looks right, use the SAVE SETTINGS button at the bottom of the page.'],
	previewProposalTitle: ['admin.orion.site_profile.preview.proposal_title', 'Site Profile Preview Ready'],
	previewProposalDescription: ['admin.orion.site_profile.preview.proposal_description', 'Review the Site Profile area on this page. If it looks right, use the SAVE SETTINGS button at the bottom of the page.'],
	confirmedReview: ['admin.orion.site_profile.confirmed_review', 'Your Site Profile draft is now loaded into the admin page. Review it carefully.\n\nIf it looks right, use the SAVE SETTINGS button at the bottom of the page to continue to Step 02.'],
	readyReview: ['admin.orion.site_profile.ready_review', 'The Site Profile preview is loaded into the page. Review the Site Profile Type and Starter Pages areas, then use the SAVE SETTINGS button at the bottom of the page when it looks right.'],
	saveSettingsHint: ['admin.orion.site_profile.save_settings_hint', 'Use the SAVE SETTINGS button at the bottom of the Site Profile page to save this setup. That save will create or update the starter pages and then move you toward Site Identity & Theme.'],
};

export function buildSiteProfileWorkflowLabels(t: Translate): OrionSiteProfileWorkflowLabels {
	return Object.fromEntries(
		Object.entries(labelDefinitions).map(([name, [key, fallback]]) => [name, t(key, fallback)]),
	) as OrionSiteProfileWorkflowLabels;
}

export const fallbackSiteProfileWorkflowLabels = buildSiteProfileWorkflowLabels((_key, fallback) => fallback);
