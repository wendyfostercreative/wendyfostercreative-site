import type { OrionSiteSummary } from './types';
import { listValue, stringValue } from '../shared/text';

const BRANDING_FIELDS = new Set(['site_name', 'logo_preference', 'logo_path', 'logo_alt_text']);
const TYPOGRAPHY_FIELDS = new Set(['font_preference', 'primary_font', 'brand_font', 'nav_font', 'site_name_font']);
const THEME_TEXT_FIELDS = new Set([
	'primary_color',
	'accent_color',
	'theme_mode',
	'corner_style',
	'page_bg',
	'page_panel',
	'page_text',
	'page_text_muted',
	'page_border',
	'header_bg',
	'header_text',
	'header_border',
	'footer_bg',
	'footer_text',
	'footer_border',
	'button_bg',
	'button_bg_hover',
	'button_text',
	'button_text_hover',
]);
const THEME_LIST_FIELDS = new Set(['color_preferences', 'style_words']);
const COMPONENT_FIELDS = new Set(['container_width', 'content_width', 'card_radius', 'button_radius', 'input_radius']);
const SEO_FIELDS = new Set(['seo_title', 'seo_description', 'short_description']);

function missingSiteFieldsFor(summary: OrionSiteSummary): string[] {
	const missing: string[] = [];
	if (!summary.site_name) missing.push('site name');
	if (!summary.seo_description) missing.push('seo description');
	return missing;
}

function currentCardKey(summary: OrionSiteSummary | Record<string, unknown>): string {
	const modelInput = summary.model_input as Record<string, unknown> | undefined;
	return stringValue(modelInput?.card_key);
}

function isCardSummary(summary: OrionSiteSummary): boolean {
	return Boolean(currentCardKey(summary));
}

function nextTextField(
	field: string,
	nextSummary: Record<string, unknown>,
	previousSummary: Record<string, unknown>,
): string {
	const cardKey = currentCardKey(nextSummary);
	const cardOwnsField =
		(cardKey === 'branding' && BRANDING_FIELDS.has(field)) ||
		(cardKey === 'typography' && TYPOGRAPHY_FIELDS.has(field)) ||
		(cardKey === 'theme' && THEME_TEXT_FIELDS.has(field)) ||
		(cardKey === 'components' && COMPONENT_FIELDS.has(field)) ||
		(cardKey === 'seo' && SEO_FIELDS.has(field));

	if (cardOwnsField && field in nextSummary) {
		return stringValue(nextSummary[field]);
	}

	return stringValue(nextSummary[field]) || stringValue(previousSummary[field]);
}

function nextListField(
	field: string,
	nextSummary: Record<string, unknown>,
	previousSummary: Record<string, unknown>,
): string[] {
	const cardKey = currentCardKey(nextSummary);
	const cardOwnsField = cardKey === 'theme' && THEME_LIST_FIELDS.has(field);

	if (cardOwnsField && field in nextSummary) {
		return listValue(nextSummary[field]);
	}

	const nextValue = listValue(nextSummary[field]);
	return nextValue.length ? nextValue : listValue(previousSummary[field]);
}

export function mergeSiteSummary(previous: OrionSiteSummary | null, next: OrionSiteSummary): OrionSiteSummary {
	if (isCardSummary(next)) {
		return {
			...next,
			missing_fields: next.missing_fields,
		};
	}

	if (!previous) {
		return {
			...next,
			corner_style: stringValue((next as Record<string, unknown>).corner_style) || 'soft',
			missing_fields: missingSiteFieldsFor(next),
		};
	}

	const previousSummary = previous as Record<string, unknown>;
	const nextSummary = next as Record<string, unknown>;
	const merged: OrionSiteSummary = {
		admin_message: stringValue(nextSummary.admin_message) || stringValue(previousSummary.admin_message) || undefined,
		model_status: stringValue(nextSummary.model_status) || stringValue(previousSummary.model_status) || undefined,
		model_input:
			((nextSummary.model_input as Record<string, unknown>) ?? null) ||
			((previousSummary.model_input as Record<string, unknown>) ?? null) ||
			undefined,
		site_name: nextTextField('site_name', nextSummary, previousSummary),
		short_description: nextTextField('short_description', nextSummary, previousSummary),
		logo_preference: nextTextField('logo_preference', nextSummary, previousSummary),
		logo_path: nextTextField('logo_path', nextSummary, previousSummary),
		logo_alt_text: nextTextField('logo_alt_text', nextSummary, previousSummary),
		site_name_font: nextTextField('site_name_font', nextSummary, previousSummary),
		brand_font: nextTextField('brand_font', nextSummary, previousSummary),
		style_words: nextListField('style_words', nextSummary, previousSummary),
		color_preferences: nextListField('color_preferences', nextSummary, previousSummary),
		font_preference: nextTextField('font_preference', nextSummary, previousSummary),
		primary_font: nextTextField('primary_font', nextSummary, previousSummary),
		nav_font: nextTextField('nav_font', nextSummary, previousSummary),
		primary_color: nextTextField('primary_color', nextSummary, previousSummary),
		accent_color: nextTextField('accent_color', nextSummary, previousSummary),
		theme_mode: nextTextField('theme_mode', nextSummary, previousSummary),
		page_bg: nextTextField('page_bg', nextSummary, previousSummary),
		page_panel: nextTextField('page_panel', nextSummary, previousSummary),
		page_text: nextTextField('page_text', nextSummary, previousSummary),
		page_text_muted: nextTextField('page_text_muted', nextSummary, previousSummary),
		page_border: nextTextField('page_border', nextSummary, previousSummary),
		header_bg: nextTextField('header_bg', nextSummary, previousSummary),
		header_text: nextTextField('header_text', nextSummary, previousSummary),
		header_border: nextTextField('header_border', nextSummary, previousSummary),
		footer_bg: nextTextField('footer_bg', nextSummary, previousSummary),
		footer_text: nextTextField('footer_text', nextSummary, previousSummary),
		footer_border: nextTextField('footer_border', nextSummary, previousSummary),
		button_bg: nextTextField('button_bg', nextSummary, previousSummary),
		button_bg_hover: nextTextField('button_bg_hover', nextSummary, previousSummary),
		button_text: nextTextField('button_text', nextSummary, previousSummary),
		button_text_hover: nextTextField('button_text_hover', nextSummary, previousSummary),
		corner_style: nextTextField('corner_style', nextSummary, previousSummary) || 'soft',
		container_width: nextTextField('container_width', nextSummary, previousSummary),
		content_width: nextTextField('content_width', nextSummary, previousSummary),
		card_radius: nextTextField('card_radius', nextSummary, previousSummary),
		button_radius: nextTextField('button_radius', nextSummary, previousSummary),
		input_radius: nextTextField('input_radius', nextSummary, previousSummary),
		seo_title: nextTextField('seo_title', nextSummary, previousSummary),
		seo_description: nextTextField('seo_description', nextSummary, previousSummary),
		missing_fields: listValue(nextSummary.missing_fields),
	};

	merged.missing_fields = missingSiteFieldsFor(merged);
	return merged;
}
