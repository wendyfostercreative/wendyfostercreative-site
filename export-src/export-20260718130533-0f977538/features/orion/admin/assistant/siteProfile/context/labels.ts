type Translate = (key: string, fallback: string) => string;

export type OrionSiteProfileLabels = {
	shortReply: string;
	heldReply: string;
	confirmSummary: string;
	editSummary: string;
	confirmedReply: string;
	editReply: string;
	siteProfileEditSiteType: string;
	siteProfileEditStarterPages: string;
	siteProfileTypeEntryMessage: string;
	siteProfileTypeSuccessMessage: string;
	siteProfileTransferToSiteConfig: string;
	siteProfileContinueToSiteConfig: string;
	proposalError: string;
	applyProposal: string;
	applySuccess: string;
	applyError: string;
};

const labelDefinitions: Record<keyof OrionSiteProfileLabels, readonly [string, string]> = {
	shortReply: ['admin.orion.assistant.short_reply', 'I have this note. For the next step, add a little more context: the site name, what kind of work this is, who it is for, and the feeling you want.'],
	heldReply: ['admin.orion.assistant.held_reply', 'Got it. I am holding that as context for {title}.\n\nNext Orion step: turn this message into structured fields, show you a plain-language summary, and ask before anything is saved.'],
	confirmSummary: ['admin.orion.assistant.confirm_summary', 'Continue'],
	editSummary: ['admin.orion.assistant.edit_summary', 'Change something'],
	confirmedReply: ['admin.orion.assistant.confirmed_reply', 'Great. I will treat this as confirmed context. The next step will be preparing a site profile proposal, and I will ask before saving anything.'],
	editReply: ['admin.orion.assistant.edit_reply', 'No problem. Tell me what to change or add.'],
	siteProfileEditSiteType: ['admin.orion.assistant.site_profile_edit_site_type', 'Edit Site Type'],
	siteProfileEditStarterPages: ['admin.orion.assistant.site_profile_edit_starter_pages', 'Edit Starter Pages'],
	siteProfileTypeEntryMessage: ['admin.orion.site_profile.card.site_type.entry', 'Tell me what kind of business, project, or creative work this site is for, and I’ll suggest the best site profile type. This gives us a starting set of pages and navigation, and we can change, rename, add, or remove anything later when we get to Pages.'],
	siteProfileTypeSuccessMessage: ['admin.orion.site_profile.card.site_type.success', 'The Site Profile Type is previewed on the page. Review the Site Profile Type and Starter Pages areas, then use SAVE SETTINGS when they look right.'],
	siteProfileTransferToSiteConfig: ['admin.orion.site_profile.transfer.site_config.message', 'Site Profile saved. Let’s move to Site Identity & Theme in Step 02.'],
	siteProfileContinueToSiteConfig: ['admin.orion.site_profile.transfer.site_config.label', 'Continue to Site Identity & Theme'],
	proposalError: ['admin.orion.assistant.proposal_error', 'Orion could not prepare the site profile proposal yet. Check the Orion API route and try again.'],
	applyProposal: ['admin.orion.assistant.apply_proposal', 'Apply site profile'],
	applySuccess: ['admin.orion.site_profile.transfer.site_config.message', 'Site Profile saved. Let’s move to Site Identity & Theme in Step 02.'],
	applyError: ['admin.orion.assistant.apply_error', 'Orion could not save the site profile yet. Check the Orion API route and try again.'],
};

export function buildSiteProfileAssistantLabels(t: Translate): OrionSiteProfileLabels {
	return Object.fromEntries(
		Object.entries(labelDefinitions).map(([name, [key, fallback]]) => [name, t(key, fallback)]),
	) as OrionSiteProfileLabels;
}

export const fallbackSiteProfileLabels = buildSiteProfileAssistantLabels((_key, fallback) => fallback);
