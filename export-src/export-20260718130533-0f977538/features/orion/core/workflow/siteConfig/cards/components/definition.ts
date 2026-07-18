import type { SiteConfig } from '../../../../../../siteConfig/core/types';
import type { OrionSiteSummary } from '../../types';
import {
	SITE_CONFIG_COMPONENTS_CARD_KEY,
	SITE_CONFIG_SEO_CARD_KEY,
	type SiteConfigCard,
} from '../types';
import type { OrionSiteConfigComponentsDraft } from './types';

export function componentsDraftFromSiteSummary(
	summary: OrionSiteSummary | null,
): OrionSiteConfigComponentsDraft | null {
	if (!summary) return null;
	return componentsDraftFromModelInput(summary.model_input);
}

export function isComponentsSummary(summary: OrionSiteSummary | null): summary is OrionSiteSummary {
	return Boolean(summary?.model_input && summary.model_input.card_key === SITE_CONFIG_COMPONENTS_CARD_KEY);
}

export function componentsPatchFromSiteSummary(summary: OrionSiteSummary): Partial<SiteConfig> {
	const draft = componentsDraftFromSiteSummary(summary);
	if (!draft) return {};

	return {
		theme: {
			layout: {
				container_width: draft.container_width || null,
				content_width: draft.content_width || null,
			},
			radius: {
				card: draft.card_radius || null,
				button: draft.button_radius || null,
				input: draft.input_radius || null,
			},
		},
	};
}

export const componentsCard: SiteConfigCard = {
	cardKey: SITE_CONFIG_COMPONENTS_CARD_KEY,
	nextCardKey: SITE_CONFIG_SEO_CARD_KEY,
	draftFromSummary: componentsDraftFromSiteSummary,
	isSummary: isComponentsSummary,
	patchFromSummary: componentsPatchFromSiteSummary,
};

function componentsDraftFromModelInput(value: unknown): OrionSiteConfigComponentsDraft | null {
	if (!isRecord(value)) return null;
	const cardSummary = value.card_summary;
	if (!isRecord(cardSummary)) return null;

	return {
		container_width: stringValue(cardSummary.container_width) || null,
		content_width: stringValue(cardSummary.content_width) || null,
		card_radius: stringValue(cardSummary.card_radius) || null,
		button_radius: stringValue(cardSummary.button_radius) || null,
		input_radius: stringValue(cardSummary.input_radius) || null,
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}
