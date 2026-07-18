import type { OrionSummary } from './types';
import { listValue, stringValue } from '../shared/text';

const SITE_TYPE_FIELDS = new Set(['suggested_profile_key', 'site_profile_type_key', 'site_type', 'business_type', 'primary_work', 'audience']);
const STARTER_PAGE_FIELDS = new Set(['suggested_templates', 'suggested_default_pages']);

function nextMissingFields(value: Record<string, unknown>, previous: Record<string, unknown>): string[] {
	if ('missing_fields' in value) return listValue(value.missing_fields);
	return listValue(previous.missing_fields);
}

function currentCardKey(value: Record<string, unknown>): string {
	const modelInput = value.model_input as Record<string, unknown> | undefined;
	return stringValue(modelInput?.card_key);
}

function nextStringField(
	field: string,
	nextSummary: Record<string, unknown>,
	previousSummary: Record<string, unknown>,
	aliases: string[] = [],
): string {
	const lookupFields = [field, ...aliases];
	if (currentCardKey(nextSummary) === 'site_type' && SITE_TYPE_FIELDS.has(field) && field in nextSummary) {
		return stringValue(nextSummary[field]);
	}
	for (const lookupField of lookupFields) {
		const nextValue = stringValue(nextSummary[lookupField]);
		if (nextValue) return nextValue;
	}
	for (const lookupField of lookupFields) {
		const previousValue = stringValue(previousSummary[lookupField]);
		if (previousValue) return previousValue;
	}
	return '';
}

function nextListField(
	field: string,
	nextSummary: Record<string, unknown>,
	previousSummary: Record<string, unknown>,
): string[] {
	if (currentCardKey(nextSummary) === 'starter_pages' && STARTER_PAGE_FIELDS.has(field) && field in nextSummary) {
		return listValue(nextSummary[field]);
	}
	const nextValue = listValue(nextSummary[field]);
	return nextValue.length ? nextValue : listValue(previousSummary[field]);
}

export function mergeSiteProfileSummary(previous: OrionSummary | null, next: OrionSummary): OrionSummary {
	if (!previous) {
		return {
			...next,
			missing_fields: listValue((next as Record<string, unknown>).missing_fields),
		};
	}

	const previousSummary = previous as Record<string, unknown>;
	const nextSummary = next as Record<string, unknown>;

	return {
		admin_message: stringValue(nextSummary.admin_message) || stringValue(previousSummary.admin_message) || undefined,
		context: (nextSummary.context as Record<string, unknown>) || (previousSummary.context as Record<string, unknown>) || null,
		model_status: stringValue(nextSummary.model_status) || stringValue(previousSummary.model_status) || undefined,
		model_input:
			((nextSummary.model_input as Record<string, unknown>) ?? null) ||
			((previousSummary.model_input as Record<string, unknown>) ?? null) ||
			undefined,
		suggested_profile_key: nextStringField('suggested_profile_key', nextSummary, previousSummary),
		site_profile_type_key: nextStringField('site_profile_type_key', nextSummary, previousSummary, ['starter_category_key']),
		site_type: nextStringField('site_type', nextSummary, previousSummary),
		business_type: nextStringField('business_type', nextSummary, previousSummary),
		primary_work:
			nextStringField('primary_work', nextSummary, previousSummary) ||
			nextStringField('work', nextSummary, previousSummary),
		audience: nextStringField('audience', nextSummary, previousSummary),
		suggested_templates: nextListField('suggested_templates', nextSummary, previousSummary),
		suggested_default_pages: nextListField('suggested_default_pages', nextSummary, previousSummary),
		deferred_to_site_config: listValue(nextSummary.deferred_to_site_config).length
			? listValue(nextSummary.deferred_to_site_config)
			: listValue(previousSummary.deferred_to_site_config),
		missing_fields: nextMissingFields(nextSummary, previousSummary),
	};
}
