import type { SiteConfig } from '../../../../../siteConfig/core/types';
import type { OrionSiteSummary } from '../types';

export const SITE_CONFIG_BRANDING_CARD_KEY = 'branding';
export const SITE_CONFIG_TYPOGRAPHY_CARD_KEY = 'typography';
export const SITE_CONFIG_THEME_CARD_KEY = 'theme';
export const SITE_CONFIG_COMPONENTS_CARD_KEY = 'components';
export const SITE_CONFIG_SEO_CARD_KEY = 'seo';

export type SiteConfigCardKey =
	| typeof SITE_CONFIG_BRANDING_CARD_KEY
	| typeof SITE_CONFIG_TYPOGRAPHY_CARD_KEY
	| typeof SITE_CONFIG_THEME_CARD_KEY
	| typeof SITE_CONFIG_COMPONENTS_CARD_KEY
	| typeof SITE_CONFIG_SEO_CARD_KEY;

export type SiteConfigCard = {
	cardKey: SiteConfigCardKey;
	nextCardKey: SiteConfigCardKey | null;
	draftFromSummary: (summary: OrionSiteSummary | null) => unknown | null;
	isSummary: (summary: OrionSiteSummary | null) => summary is OrionSiteSummary;
	patchFromSummary: (summary: OrionSiteSummary) => Partial<SiteConfig>;
};
