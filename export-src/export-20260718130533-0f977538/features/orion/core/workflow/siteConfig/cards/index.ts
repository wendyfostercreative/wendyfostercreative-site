import { brandingCard } from './branding';
import { componentsCard } from './components';
import { seoCard } from './seo';
import { themeCard } from './theme';
import { typographyCard } from './typography';
import type { SiteConfigCard } from './types';

export * from './branding';
export * from './typography';
export * from './theme';
export * from './components';
export * from './seo';
export * from './types';

const SITE_CONFIG_CARDS: readonly SiteConfigCard[] = [
	brandingCard,
	typographyCard,
	themeCard,
	componentsCard,
	seoCard,
];

export function getSiteConfigCard(cardKey: string | null | undefined): SiteConfigCard {
	return getSiteConfigCardByKey(cardKey) ?? brandingCard;
}

export function getSiteConfigCardByKey(cardKey: string | null | undefined): SiteConfigCard | null {
	return SITE_CONFIG_CARDS.find((card) => card.cardKey === cardKey) ?? null;
}

export function getSiteConfigCardForSummary(summary: Parameters<SiteConfigCard['draftFromSummary']>[0]): SiteConfigCard {
	return SITE_CONFIG_CARDS.find((card) => card.isSummary(summary)) ?? brandingCard;
}
