import type { OrionSummary } from '../../types';
import { siteProfileTypeLabel } from '../../siteProfileTypes';
import {
	SITE_PROFILE_SITE_TYPE_CARD_KEY,
	type SiteProfileCard,
} from '../types';
import type { OrionSiteProfileSiteTypeDraft } from './types';

export function siteTypeDraftFromSummary(summary: OrionSummary | null): OrionSiteProfileSiteTypeDraft | null {
	if (!summary) return null;
	const cardSummary = siteTypeDraftFromModelInput(summary.model_input);
	if (cardSummary) return cardSummary;

	return {
		site_type: summary.site_type || '',
		site_profile_type_key: summary.site_profile_type_key || '',
		business_type: summary.business_type || '',
		primary_work: summary.primary_work || '',
		audience: summary.audience || '',
	};
}

export function isSiteTypeSummary(summary: OrionSummary | null): summary is OrionSummary {
	return Boolean(summary?.model_input && summary.model_input.card_key === SITE_PROFILE_SITE_TYPE_CARD_KEY);
}

export const siteTypeCard: SiteProfileCard = {
	cardKey: SITE_PROFILE_SITE_TYPE_CARD_KEY,
	title: 'Site Type',
	applyLabel: 'Review on page',
	entryMessage:
		'Tell me what kind of business you run, and I’ll suggest the best starter setup for your site. This gives us a starting set of pages and navigation, and we can change, rename, add, or remove anything later when we get to Pages.',
	successMessage: 'Site Profile Type is previewed on the page. Review the Site Profile Type and Starter Pages areas, then use SAVE SETTINGS when they look right.',
	nextCardKey: null,
	draftFromSummary: siteTypeDraftFromSummary,
	isSummary: isSiteTypeSummary,
};

function siteTypeDraftFromModelInput(value: unknown): OrionSiteProfileSiteTypeDraft | null {
	if (!isRecord(value)) return null;
	const cardSummary = value.card_summary;
	if (!isRecord(cardSummary)) return null;

	return {
		site_type: stringValue(cardSummary.site_type),
		site_profile_type_key: stringValue(cardSummary.site_profile_type_key) || stringValue(cardSummary.starter_category_key),
		business_type: stringValue(cardSummary.business_type),
		primary_work: stringValue(cardSummary.primary_work) || stringValue(cardSummary.work),
		audience: stringValue(cardSummary.audience),
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

export function siteTypeSiteProfileTypeText(siteProfileTypeKey: string): string {
	return siteProfileTypeLabel(siteProfileTypeKey) || '';
}
