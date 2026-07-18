type Translate = (key: string, fallback: string) => string;

export type OrionAdminHomeLabels = {
	startStep01: string;
	openStep: string;
	routeSiteProfile: string;
	routeSiteConfig: string;
	routeHeaderNav: string;
	routePages: string;
	routeMedia: string;
	routeFooter: string;
	adminHomeFallbackAnswer: string;
};

const labelDefinitions: Record<keyof OrionAdminHomeLabels, readonly [string, string]> = {
	startStep01: ['admin.orion.admin_home.start_step_01', 'Start Step 01'],
	openStep: ['admin.orion.admin_home.open_step', 'Open step'],
	routeSiteProfile: ['admin.index.actions.route.site_profile', 'Start Step 01'],
	routeSiteConfig: ['admin.index.actions.route.site_config', 'Edit identity & theme'],
	routeHeaderNav: ['admin.index.actions.route.header_nav', 'Edit header'],
	routePages: ['admin.index.actions.route.pages', 'Manage pages'],
	routeMedia: ['admin.index.actions.route.media', 'Manage media'],
	routeFooter: ['admin.index.actions.route.footer', 'Edit footer'],
	adminHomeFallbackAnswer: [
		'admin.orion.admin_home.fallback_answer',
		'I can help explain the setup steps, or we can start with Step 01: Site Profile.',
	],
};

export function buildAdminHomeAssistantLabels(t: Translate): OrionAdminHomeLabels {
	return Object.fromEntries(
		Object.entries(labelDefinitions).map(([name, [key, fallback]]) => [name, t(key, fallback)]),
	) as OrionAdminHomeLabels;
}

export const fallbackAdminHomeLabels = buildAdminHomeAssistantLabels((_key, fallback) => fallback);
