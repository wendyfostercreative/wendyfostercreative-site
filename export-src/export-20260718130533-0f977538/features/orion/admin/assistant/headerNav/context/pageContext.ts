import type { OrionPageContext } from '../../../../core/types';
import type { OrionPageContextSeed } from '../../shared/types/pageContext';
import type { OrionHeaderNavLabels } from './labels';

export const headerNavPageContext: OrionPageContextSeed = {
	key: 'header_nav',
	stepKey: 'admin.orion.header_nav.step',
	stepFallback: 'Step 03',
	titleKey: 'admin.orion.header_nav.title',
	titleFallback: 'Header & Navigation',
	goalKey: 'admin.orion.header_nav.goal',
	goalFallback: 'Shape the site header, brand display, navigation links, and menu styling.',
	promptKey: 'admin.orion.header_nav.prompt',
	promptFallback: 'This page controls the top of the site: layout, logo/site-name display, navigation styling, and border. Pages remain the source of actual page content and page visibility.',
	allowedActions: ['explain_header_nav', 'review_header_nav_page'],
};

export function headerNavContextForLabels(labels: OrionHeaderNavLabels): OrionPageContext {
	return {
		key: 'header_nav',
		step: labels.headerNavStep,
		title: labels.headerNavTitle,
		goal: labels.headerNavGoal,
		prompt: labels.headerNavPrompt,
		allowedActions: [],
	};
}
