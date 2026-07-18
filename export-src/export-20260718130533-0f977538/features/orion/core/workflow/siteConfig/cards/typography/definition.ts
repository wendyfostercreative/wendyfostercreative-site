import type { SiteConfig } from '../../../../../../siteConfig/core/types';
import type { OrionSiteSummary } from '../../types';
import {
	SITE_CONFIG_THEME_CARD_KEY,
	SITE_CONFIG_TYPOGRAPHY_CARD_KEY,
	type SiteConfigCard,
} from '../types';
import type { OrionSiteConfigTypographyDraft } from './types';

export function typographyDraftFromSiteSummary(
	summary: OrionSiteSummary | null,
): OrionSiteConfigTypographyDraft | null {
	if (!summary) return null;
	const cardSummary = typographyDraftFromModelInput(summary.model_input);
	if (cardSummary) return cardSummary;

	return {
		primary_font: summary.primary_font || summary.font_preference || '',
		brand_font: summary.brand_font || summary.site_name_font || null,
		nav_font: summary.nav_font || null,
	};
}

export function isTypographySummary(summary: OrionSiteSummary | null): summary is OrionSiteSummary {
	return Boolean(summary?.model_input && summary.model_input.card_key === SITE_CONFIG_TYPOGRAPHY_CARD_KEY);
}

export function typographyPatchFromSiteSummary(summary: OrionSiteSummary): Partial<SiteConfig> {
	const draft = typographyDraftFromSiteSummary(summary);
	if (!draft) return {};

	return {
		brand: {
			site_name_font: draft.brand_font || null,
		},
		theme: {
			fonts: {
				primary: draft.primary_font || null,
				brand: draft.brand_font || null,
				nav: draft.nav_font || null,
			},
			primary_font: draft.primary_font || null,
		},
	};
}

export const typographyCard: SiteConfigCard = {
	cardKey: SITE_CONFIG_TYPOGRAPHY_CARD_KEY,
	nextCardKey: SITE_CONFIG_THEME_CARD_KEY,
	draftFromSummary: typographyDraftFromSiteSummary,
	isSummary: isTypographySummary,
	patchFromSummary: typographyPatchFromSiteSummary,
};

function typographyDraftFromModelInput(value: unknown): OrionSiteConfigTypographyDraft | null {
	if (!isRecord(value)) return null;
	const cardSummary = value.card_summary;
	if (!isRecord(cardSummary)) return null;

	return {
		primary_font: stringValue(cardSummary.primary_font),
		brand_font: stringValue(cardSummary.brand_font) || null,
		nav_font: stringValue(cardSummary.nav_font) || null,
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}
