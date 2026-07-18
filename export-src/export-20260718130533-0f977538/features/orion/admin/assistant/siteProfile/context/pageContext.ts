import type { OrionPageContextSeed } from '../../shared/types/pageContext';

export const siteProfilePageContext: OrionPageContextSeed = {
	key: 'site_profile',
	stepKey: 'admin.orion.site_profile.step',
	stepFallback: 'Step 01',
	titleKey: 'admin.orion.site_profile.title',
	titleFallback: 'Site Profile',
	goalKey: 'admin.orion.site_profile.goal',
	goalFallback: 'Understand what kind of site we are building before any setup work begins.',
	promptKey: 'admin.orion.site_profile.prompt',
	promptFallback:
		'First, I’ll help choose the website structure.\n\nI need two things:\n1. What kind of work, business, or project this site is for\n2. Which top-navigation pages the site should launch with\n\nBasically, what do you do, and what kind of website are we making?',
	allowedActions: ['collect_context', 'summarize_context', 'propose_site_profile_update'],
};
