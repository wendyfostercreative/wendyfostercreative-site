import type { SiteConfig } from '../../../../../../siteConfig/core/types';
import type { OrionSiteSummary } from '../../types';
import {
	SITE_CONFIG_BRANDING_CARD_KEY,
	SITE_CONFIG_TYPOGRAPHY_CARD_KEY,
	type SiteConfigCard,
} from '../types';
import type { OrionSiteConfigBrandingDraft } from './types';

export function brandingDraftFromSiteSummary(summary: OrionSiteSummary | null): OrionSiteConfigBrandingDraft | null {
	if (!summary) return null;
	const cardSummary = brandingDraftFromModelInput(summary.model_input);
	if (cardSummary) return cardSummary;

	return {
		site_name: summary.site_name || '',
		logo_path: summary.logo_path || null,
		logo_alt_text: summary.logo_alt_text || null,
	};
}

export function savedBrandingValuesFromSiteSummary(
	summary: OrionSiteSummary | null,
): OrionSiteConfigBrandingDraft | null {
	return brandingDraftFromSiteSummary(summary);
}

export function isBrandingSummary(summary: OrionSiteSummary | null): summary is OrionSiteSummary {
	return Boolean(summary?.model_input && summary.model_input.card_key === SITE_CONFIG_BRANDING_CARD_KEY);
}

export function brandingPatchFromSiteSummary(summary: OrionSiteSummary): Partial<SiteConfig> {
	const draft = brandingDraftFromSiteSummary(summary);
	if (!draft) return {};

	return {
		identity: {
			site_name: draft.site_name,
			logo_path: draft.logo_path || null,
			logo_alt_text: draft.logo_alt_text || draft.site_name || null,
		},
	};
}

export const brandingCard: SiteConfigCard = {
	cardKey: SITE_CONFIG_BRANDING_CARD_KEY,
	nextCardKey: SITE_CONFIG_TYPOGRAPHY_CARD_KEY,
	draftFromSummary: brandingDraftFromSiteSummary,
	isSummary: isBrandingSummary,
	patchFromSummary: brandingPatchFromSiteSummary,
};

function brandingDraftFromModelInput(value: unknown): OrionSiteConfigBrandingDraft | null {
	if (!isRecord(value)) return null;
	const cardSummary = value.card_summary;
	if (!isRecord(cardSummary)) return null;

	return {
		site_name: stringValue(cardSummary.site_name),
		logo_path: stringValue(cardSummary.logo_path) || null,
		logo_alt_text: stringValue(cardSummary.logo_alt_text) || null,
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}
