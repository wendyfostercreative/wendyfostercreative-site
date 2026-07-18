export type MediaVocabulary = {
	roles: string[];
	collections: string[];
};

export type SiteLocalization = {
	admin_locale: string;
	fallback_locale: string;
	enabled_locales: string[];
};

export type DefaultPageDefinition = {
	title: string;
	path: string;
	template: string;
};

export type SetupQuestion = {
	key: string;
	question: string;
	examples: string[];
};

export type SiteProfile = {
	id: number;
	profile_key: string;
	profile_version: string;
	label: string;
	description: string;
	status: string;
	is_active: boolean;
	media_vocabulary: MediaVocabulary;
	localization: SiteLocalization;
	template_defaults: Record<string, unknown>;
	setup_questions: SetupQuestion[];
	agent_notes: string;
	metadata: Record<string, unknown>;
	created_at: string | null;
	updated_at: string | null;
};
