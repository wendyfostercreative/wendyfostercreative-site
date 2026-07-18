import type { OrionPageContext } from '../../../../core/types';
import type { OrionPageContextSeed } from '../../shared/types/pageContext';

export const adminHomePageContext: OrionPageContextSeed = {
	key: 'admin_home',
	stepKey: 'admin.orion.admin_home.step',
	stepFallback: '',
	titleKey: 'admin.orion.admin_home.title',
	titleFallback: 'Admin Home',
	goalKey: 'admin.orion.admin_home.goal',
	goalFallback: 'Explain the setup path and help the admin start the first step.',
	promptKey: 'admin.orion.admin_home.prompt',
	promptFallback:
		'Welcome! I’m Orion. I can help you set up this website step by step.\n\nThis admin home page shows the main steps we’ll work through to get the site ready. I can answer questions about any step, or we can get started now.',
	allowedActions: ['answer_setup_questions', 'route_to_site_profile'],
};

export const adminHomeFallbackPageContext: OrionPageContext = {
	key: adminHomePageContext.key,
	step: adminHomePageContext.stepFallback,
	title: adminHomePageContext.titleFallback,
	goal: adminHomePageContext.goalFallback,
	prompt: adminHomePageContext.promptFallback,
	allowedActions: adminHomePageContext.allowedActions,
};
