import { asBoolean, asNumber, asObject, asString } from '../../../lib/normalize';
import type { MediaVocabulary, SetupQuestion, SiteLocalization, SiteProfile } from './types';

function asStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.map((item) => asString(item)).filter(Boolean);
}

function normalizeMediaVocabulary(value: unknown): MediaVocabulary {
	const data = asObject(value);
	return {
		roles: asStringArray(data.roles),
		collections: asStringArray(data.collections),
	};
}

function normalizeSiteLocalization(value: unknown): SiteLocalization {
	const data = asObject(value);
	const enabled = asStringArray(data.enabled_locales);
	return {
		admin_locale: asString(data.admin_locale) || 'en',
		fallback_locale: asString(data.fallback_locale) || 'en',
		enabled_locales: enabled.length ? enabled : ['en'],
	};
}

function normalizeSetupQuestion(value: unknown): SetupQuestion | null {
	const data = asObject(value);
	const key = asString(data.key);
	const question = asString(data.question);
	if (!key || !question) return null;
	return {
		key,
		question,
		examples: asStringArray(data.examples),
	};
}

export function normalizeSiteProfile(input: unknown): SiteProfile {
	const data = asObject(input);

	return {
		id: asNumber(data.id) || 1,
		profile_key: asString(data.profile_key) || 'general_website',
		profile_version: asString(data.profile_version) || '1',
		label: asString(data.label) || 'General Website',
		description: asString(data.description) || 'General website setup.',
		status: asString(data.status) || 'active',
		is_active: asBoolean(data.is_active, true),
		media_vocabulary: normalizeMediaVocabulary(data.media_vocabulary),
		localization: normalizeSiteLocalization(data.localization),
		template_defaults: asObject(data.template_defaults),
		setup_questions: Array.isArray(data.setup_questions)
			? data.setup_questions.map(normalizeSetupQuestion).filter((question): question is SetupQuestion => Boolean(question))
			: [],
		agent_notes: asString(data.agent_notes),
		metadata: asObject(data.metadata),
		created_at: asString(data.created_at) || null,
		updated_at: asString(data.updated_at) || null,
	};
}
