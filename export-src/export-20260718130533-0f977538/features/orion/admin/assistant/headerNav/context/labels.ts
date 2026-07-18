type Translate = (key: string, fallback: string) => string;

export type OrionHeaderNavLabels = {
	headerNavStep: string;
	headerNavTitle: string;
	headerNavGoal: string;
	headerNavPrompt: string;
	headerNavEntry: string;
	headerNavLayoutHelp: string;
	headerNavBrandHelp: string;
	headerNavNavigationHelp: string;
	headerNavBorderHelp: string;
	headerNavSaveHint: string;
	headerNavApplySuccess: string;
	headerNavContinueToPages: string;
};

const labelDefinitions: Record<keyof OrionHeaderNavLabels, readonly [string, string]> = {
	headerNavStep: ['admin.orion.header_nav.step', 'Step 03'],
	headerNavTitle: ['admin.orion.header_nav.title', 'Header & Navigation'],
	headerNavGoal: ['admin.orion.header_nav.goal', 'Shape the site header, brand display, navigation links, and menu styling.'],
	headerNavPrompt: ['admin.orion.header_nav.prompt', 'This page controls the top of the site: layout, logo/site-name display, navigation styling, and border. Pages remain the source of actual page content and page visibility.'],
	headerNavEntry: ['admin.orion.header_nav.entry', 'You’re on Header & Navigation. Review the Layout, Brand, Navigation, and Border areas on this page. I can explain what each area controls, but use the page fields and SAVE SETTINGS to persist changes.'],
	headerNavLayoutHelp: ['admin.orion.header_nav.layout.help', 'Layout controls the overall header arrangement: where the logo/site name sits, where links appear, width, sticky behavior, direction, and height.'],
	headerNavBrandHelp: ['admin.orion.header_nav.brand.help', 'Brand controls how your saved Site Config identity appears in the header, including whether the site name appears with the logo and how large the logo can be.'],
	headerNavNavigationHelp: ['admin.orion.header_nav.navigation.help', 'Navigation controls link typography, spacing, and colors. The actual page records still belong to Pages, while Header & Navigation controls how those links appear.'],
	headerNavBorderHelp: ['admin.orion.header_nav.border.help', 'Border controls the optional line under the header. It can help separate the header from the page content, especially on light themes.'],
	headerNavSaveHint: ['admin.orion.header_nav.save_hint', 'Review the Header & Navigation page. When it looks right, use SAVE SETTINGS at the bottom of the page.'],
	headerNavApplySuccess: ['admin.orion.header_nav.apply_success', 'Header & Navigation saved. Next, let’s move to Pages so you can review and edit the site pages.'],
	headerNavContinueToPages: ['admin.orion.header_nav.transfer.pages.label', 'Continue to Pages'],
};

export function buildHeaderNavAssistantLabels(t: Translate): OrionHeaderNavLabels {
	return Object.fromEntries(
		Object.entries(labelDefinitions).map(([name, [key, fallback]]) => [name, t(key, fallback)]),
	) as OrionHeaderNavLabels;
}

export const fallbackHeaderNavLabels = buildHeaderNavAssistantLabels((_key, fallback) => fallback);
