import type { OrionSummary } from '../../types';
import {
	SITE_PROFILE_STARTER_PAGES_CARD_KEY,
	type SiteProfileCard,
} from '../types';
import type { OrionSiteProfileStarterPagesDraft } from './types';

export function starterPagesDraftFromSummary(summary: OrionSummary | null): OrionSiteProfileStarterPagesDraft | null {
	if (!summary) return null;
	const cardSummary = starterPagesDraftFromModelInput(summary.model_input);
	if (cardSummary) return cardSummary;

	return {
		suggested_default_pages: stringList(summary.suggested_default_pages),
		suggested_templates: stringList(summary.suggested_templates),
	};
}

export function isStarterPagesSummary(summary: OrionSummary | null): summary is OrionSummary {
	return Boolean(summary?.model_input && summary.model_input.card_key === SITE_PROFILE_STARTER_PAGES_CARD_KEY);
}

export const starterPagesCard: SiteProfileCard = {
	cardKey: SITE_PROFILE_STARTER_PAGES_CARD_KEY,
	title: 'Starter Pages',
	applyLabel: 'Review on page',
	entryMessage:
		'You’re on Starter Pages. This card confirms the starting pages and templates Orion should use for launch navigation. This is only the initial structure, and you can change, rename, add, or remove pages later in Pages.',
	successMessage: 'Starter pages are previewed on the page. Review them, then use SAVE SETTINGS when they look right.',
	nextCardKey: null,
	draftFromSummary: starterPagesDraftFromSummary,
	isSummary: isStarterPagesSummary,
};

function starterPagesDraftFromModelInput(value: unknown): OrionSiteProfileStarterPagesDraft | null {
	if (!isRecord(value)) return null;
	const cardSummary = value.card_summary;
	if (!isRecord(cardSummary)) return null;

	return {
		suggested_default_pages: stringList(cardSummary.default_pages ?? cardSummary.suggested_default_pages),
		suggested_templates: stringList(cardSummary.templates ?? cardSummary.suggested_templates),
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringList(value: unknown): string[] {
	return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}
