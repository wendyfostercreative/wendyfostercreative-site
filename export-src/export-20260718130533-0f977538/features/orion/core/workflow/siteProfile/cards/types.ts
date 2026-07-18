import type { OrionSummary } from '../types';

export const SITE_PROFILE_SITE_TYPE_CARD_KEY = 'site_type';
export const SITE_PROFILE_STARTER_PAGES_CARD_KEY = 'starter_pages';

export type SiteProfileCardKey =
	| typeof SITE_PROFILE_SITE_TYPE_CARD_KEY
	| typeof SITE_PROFILE_STARTER_PAGES_CARD_KEY;

export type SiteProfileCard = {
	cardKey: SiteProfileCardKey;
	title: string;
	applyLabel: string;
	entryMessage: string;
	successMessage: string;
	nextCardKey: SiteProfileCardKey | null;
	draftFromSummary: (summary: OrionSummary | null) => unknown | null;
	isSummary: (summary: OrionSummary | null) => summary is OrionSummary;
};
