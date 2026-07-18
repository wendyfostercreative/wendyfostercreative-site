import type { SiteConfig } from '../../../../../../siteConfig/core/types';
import type { OrionSiteSummary } from '../../types';
import {
	SITE_CONFIG_SEO_CARD_KEY,
	type SiteConfigCard,
} from '../types';
import type { OrionSiteConfigSeoDraft } from './types';

export function seoDraftFromSiteSummary(
	summary: OrionSiteSummary | null,
): OrionSiteConfigSeoDraft | null {
	if (!summary) return null;
	const cardSummary = seoDraftFromModelInput(summary.model_input);
	if (cardSummary) return cardSummary;

	return {
		seo_title: summary.seo_title || null,
		seo_description: summary.seo_description || null,
	};
}

export function isSeoSummary(summary: OrionSiteSummary | null): summary is OrionSiteSummary {
	return Boolean(summary?.model_input && summary.model_input.card_key === SITE_CONFIG_SEO_CARD_KEY);
}

export function seoPatchFromSiteSummary(summary: OrionSiteSummary): Partial<SiteConfig> {
	const draft = seoDraftFromSiteSummary(summary);
	if (!draft) return {};

	return {
		seo_defaults: {
			title: draft.seo_title || null,
			description: draft.seo_description || null,
		},
	};
}

export const seoCard: SiteConfigCard = {
	cardKey: SITE_CONFIG_SEO_CARD_KEY,
	nextCardKey: null,
	draftFromSummary: seoDraftFromSiteSummary,
	isSummary: isSeoSummary,
	patchFromSummary: seoPatchFromSiteSummary,
};

function seoDraftFromModelInput(value: unknown): OrionSiteConfigSeoDraft | null {
	if (!isRecord(value)) return null;
	const cardSummary = value.card_summary;
	if (!isRecord(cardSummary)) return null;

	return {
		seo_title: stringValue(cardSummary.seo_title) || null,
		seo_description: stringValue(cardSummary.seo_description) || null,
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}
