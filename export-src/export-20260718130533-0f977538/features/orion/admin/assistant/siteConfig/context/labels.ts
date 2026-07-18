type Translate = (key: string, fallback: string) => string;

export type OrionSiteConfigLabels = {
	editSummary: string;
	editReply: string;
	siteConfigStep: string;
	siteConfigTitle: string;
	siteConfigGoal: string;
	siteConfigPrompt: string;
	siteConfigTransition: string;
	siteConfirmedReply: string;
	siteProposalError: string;
	siteApplyProposal: string;
	siteApplySuccess: string;
	siteApplyError: string;
	siteConfigContinueToHeaderNav: string;
	siteConfigConfirmedLoaded: string;
	siteConfigAlreadyLoaded: string;
	siteConfigEntryBranding: string;
	siteConfigEntryTypography: string;
	siteConfigEntryTheme: string;
	siteConfigEntryComponents: string;
	siteConfigEntrySeo: string;
	siteConfigSuccessBranding: string;
	siteConfigSuccessTypography: string;
	siteConfigSuccessTheme: string;
	siteConfigSuccessComponents: string;
	siteConfigSuccessSeo: string;
	siteConfigReminderBranding: string;
	siteConfigReminderTypography: string;
	siteConfigReminderTheme: string;
	siteConfigReminderComponents: string;
	siteConfigReminderSeo: string;
	siteConfigEditBranding: string;
	siteConfigEditTypography: string;
	siteConfigEditTheme: string;
	siteConfigEditComponents: string;
	siteConfigEditSeo: string;
	siteConfigReturnBranding: string;
	siteConfigReturnTypography: string;
	siteConfigReturnTheme: string;
	siteConfigReturnComponents: string;
	siteConfigReturnSeo: string;
	siteConfigSwitchBranding: string;
	siteConfigSwitchTypography: string;
	siteConfigSwitchTheme: string;
	siteConfigSwitchComponents: string;
	siteConfigSwitchSeo: string;
};

const labelDefinitions: Record<keyof OrionSiteConfigLabels, readonly [string, string]> = {
	editSummary: ['admin.orion.assistant.edit_summary', 'Change something'],
	editReply: ['admin.orion.assistant.edit_reply', 'No problem. Tell me what to change or add.'],
	siteConfigStep: ['admin.orion.site_config.step', 'Step 02'],
	siteConfigTitle: ['admin.orion.site_config.title', 'Site Identity & Theme'],
	siteConfigGoal: ['admin.orion.site_config.goal', 'Start with the site name, optional logo, and shared typography defaults.'],
	siteConfigPrompt: ['admin.orion.site_config.prompt', 'This page sets your site name, logo, typography, theme, and default SEO.\n\nFor Branding, tell me your site name and any logo details you already have.'],
	siteConfigTransition: ['admin.orion.site_config.transition', 'Great. Site Profile is saved. Now let’s prepare your branding and site theme, starting with the basic brand identity.'],
	siteConfirmedReply: ['admin.orion.site_config.confirmed_reply', 'Great. I will prepare a Site Identity & Theme proposal and ask before saving anything.'],
	siteProposalError: ['admin.orion.site_config.proposal_error', 'Orion could not prepare the Site Identity & Theme proposal yet. Check the Orion API route and try again.'],
	siteApplyProposal: ['admin.orion.site_config.apply_proposal', 'Apply identity & theme'],
	siteApplySuccess: ['admin.orion.site_config.apply_success', 'Site Identity & Theme saved. Let’s move to Header & Navigation in Step 03.'],
	siteApplyError: ['admin.orion.site_config.apply_error', 'Orion could not save Site Identity & Theme yet. Check the Orion API route and try again.'],
	siteConfigContinueToHeaderNav: ['admin.orion.site_config.transfer.header_nav.label', 'Continue to Header & Navigation'],
	siteConfigConfirmedLoaded: ['admin.orion.site_config.confirmed.loaded', 'Your Site Identity & Theme draft is now loaded into the admin page. Review it carefully.\n\nIf it looks right, use the SAVE SETTINGS button at the bottom of the page to continue to Step 03: Header & Navigation.'],
	siteConfigAlreadyLoaded: ['admin.orion.site_config.confirmed.already_loaded', 'Your Site Identity & Theme draft is already loaded into the page. Review it carefully, then use the SAVE SETTINGS button at the bottom of the page when you’re ready to continue to Step 03: Header & Navigation.'],
	siteConfigEntryBranding: ['admin.orion.site_config.card.branding.entry', 'You’re on Branding. This card controls the site name, optional logo path, and optional logo alt text.'],
	siteConfigEntryTypography: ['admin.orion.site_config.card.typography.entry', 'You’re on Typography. This card controls the main site font plus optional brand and nav fonts. Brand and nav fonts inherit the primary font when left blank.'],
	siteConfigEntryTheme: ['admin.orion.site_config.card.theme.entry', 'You’re on Theme. Give me one main color, an optional accent color, and whether you want a light or dark theme.'],
	siteConfigEntryComponents: ['admin.orion.site_config.card.components.entry', 'You’re on Components. This card controls shared layout width and corner styling.'],
	siteConfigEntrySeo: ['admin.orion.site_config.card.seo.entry', 'You’re on SEO. This card controls the default search title and search description for the whole site.'],
	siteConfigSuccessBranding: ['admin.orion.site_config.card.branding.success', 'Branding applied. Next, choose the site typography.'],
	siteConfigSuccessTypography: ['admin.orion.site_config.card.typography.success', 'Typography applied. Next, choose the site theme.'],
	siteConfigSuccessTheme: ['admin.orion.site_config.card.theme.success', 'Theme applied. Next, choose the shared components style.'],
	siteConfigSuccessComponents: ['admin.orion.site_config.card.components.success', 'Components applied. Next, set the default SEO.'],
	siteConfigSuccessSeo: ['admin.orion.site_config.card.seo.success', 'SEO is ready to review. Use SAVE SETTINGS when everything looks right.'],
	siteConfigReminderBranding: ['admin.orion.site_config.card.branding.reminder', 'Review the Branding card in the admin page, then click APPLY to continue.'],
	siteConfigReminderTypography: ['admin.orion.site_config.card.typography.reminder', 'Review the Typography card in the admin page, then click APPLY to continue.'],
	siteConfigReminderTheme: ['admin.orion.site_config.card.theme.reminder', 'Review the Theme card in the admin page, then click APPLY to continue.'],
	siteConfigReminderComponents: ['admin.orion.site_config.card.components.reminder', 'Review the Components card in the admin page, then click APPLY to continue.'],
	siteConfigReminderSeo: ['admin.orion.site_config.card.seo.reminder', 'Review the SEO area in the admin page, then use SAVE SETTINGS to continue.'],
	siteConfigEditBranding: ['admin.orion.site_config.card.branding.edit_prompt', 'Tell me what to change in Branding.'],
	siteConfigEditTypography: ['admin.orion.site_config.card.typography.edit_prompt', 'Tell me what to change in Typography.'],
	siteConfigEditTheme: ['admin.orion.site_config.card.theme.edit_prompt', 'Tell me what to change in Theme.'],
	siteConfigEditComponents: ['admin.orion.site_config.card.components.edit_prompt', 'Tell me what to change in Components.'],
	siteConfigEditSeo: ['admin.orion.site_config.card.seo.edit_prompt', 'Tell me what to change in SEO.'],
	siteConfigReturnBranding: ['admin.orion.site_config.card.branding.return_prompt', 'We’re back on Branding. What would you like me to change?'],
	siteConfigReturnTypography: ['admin.orion.site_config.card.typography.return_prompt', 'We’re back on Typography. What would you like me to change?'],
	siteConfigReturnTheme: ['admin.orion.site_config.card.theme.return_prompt', 'We’re back on Theme. What would you like me to change?'],
	siteConfigReturnComponents: ['admin.orion.site_config.card.components.return_prompt', 'We’re back on Components. What would you like me to change?'],
	siteConfigReturnSeo: ['admin.orion.site_config.card.seo.return_prompt', 'We’re back on SEO. What would you like me to change?'],
	siteConfigSwitchBranding: ['admin.orion.site_config.card.branding.switch_label', 'Switch to Branding'],
	siteConfigSwitchTypography: ['admin.orion.site_config.card.typography.switch_label', 'Switch to Typography'],
	siteConfigSwitchTheme: ['admin.orion.site_config.card.theme.switch_label', 'Switch to Theme'],
	siteConfigSwitchComponents: ['admin.orion.site_config.card.components.switch_label', 'Switch to Components'],
	siteConfigSwitchSeo: ['admin.orion.site_config.card.seo.switch_label', 'Switch to SEO'],
};

export function buildSiteConfigAssistantLabels(t: Translate): OrionSiteConfigLabels {
	return Object.fromEntries(
		Object.entries(labelDefinitions).map(([name, [key, fallback]]) => [name, t(key, fallback)]),
	) as OrionSiteConfigLabels;
}

export const fallbackSiteConfigLabels = buildSiteConfigAssistantLabels((_key, fallback) => fallback);
