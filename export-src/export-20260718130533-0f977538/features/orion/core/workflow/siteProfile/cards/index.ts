import { siteTypeCard } from './siteType';
import type { SiteProfileCard } from './types';

export * from './siteType';
export * from './starterPages';
export * from './types';

const SITE_PROFILE_CARDS: readonly SiteProfileCard[] = [siteTypeCard];

export function getSiteProfileCard(cardKey: string | null | undefined): SiteProfileCard {
	return getSiteProfileCardByKey(cardKey) ?? siteTypeCard;
}

export function getSiteProfileCardByKey(cardKey: string | null | undefined): SiteProfileCard | null {
	return SITE_PROFILE_CARDS.find((card) => card.cardKey === cardKey) ?? null;
}

export function getSiteProfileCardForSummary(
	summary: Parameters<SiteProfileCard['draftFromSummary']>[0],
): SiteProfileCard {
	return SITE_PROFILE_CARDS.find((card) => card.isSummary(summary)) ?? siteTypeCard;
}
