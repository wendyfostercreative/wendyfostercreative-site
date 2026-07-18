import type { OrionPageContext } from '../../../../core/types';
import type { OrionSiteConfigLabels } from './labels';
import type { OrionPageContextSeed } from '../../shared/types/pageContext';

export const siteConfigPageContext: OrionPageContextSeed = {
	key: 'site_config',
	stepKey: 'admin.orion.site_config.step',
	stepFallback: 'Step 02',
	titleKey: 'admin.orion.site_config.title',
	titleFallback: 'Site Identity & Theme',
	goalKey: 'admin.orion.site_config.goal',
	goalFallback: 'Start with the site name, optional logo, and shared typography defaults.',
	promptKey: 'admin.orion.site_config.prompt',
	promptFallback:
		'This page sets your site name, logo, typography, theme, and default SEO.\n\nFor Branding, tell me your site name and any logo details you already have.',
	allowedActions: ['collect_context', 'summarize_context', 'propose_site_config_update'],
};

export function siteConfigContextForLabels(labels: OrionSiteConfigLabels): OrionPageContext {
	return {
		key: 'site_config',
		step: labels.siteConfigStep,
		title: labels.siteConfigTitle,
		goal: labels.siteConfigGoal,
		prompt: labels.siteConfigPrompt,
		allowedActions: [],
	};
}
