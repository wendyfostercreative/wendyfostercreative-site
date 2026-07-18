export type OrionSummary = {
	admin_message?: string;
	context?: Record<string, unknown> | null;
	model_status?: string;
	model_input?: Record<string, unknown>;
	suggested_profile_key: string;
	site_profile_type_key: string;
	site_type: string;
	business_type: string;
	primary_work: string;
	audience: string;
	suggested_templates: string[];
	suggested_default_pages: string[];
	deferred_to_site_config: string[];
	missing_fields: string[];
};

export type OrionDefaultPageDefinition = {
	title: string;
	path: string;
	template: string;
};

export type OrionSiteProfileProposal = {
	profile_key: string;
	profile_version: string;
	label: string;
	description: string;
	status: string;
	is_active: boolean;
	enabled_templates: string[];
	default_pages: OrionDefaultPageDefinition[];
	agent_notes: string;
	metadata: Record<string, unknown>;
};

export type OrionSiteProfileProposalResult = {
	summary: OrionSummary;
	proposal: OrionSiteProfileProposal;
};

export type OrionSiteProfileDecision = {
	mode:
		| 'update_card'
		| 'answer_question'
		| 'save_card'
		| 'switch_card'
		| 'redirect_domain'
		| 'off_topic';
	domain_key: string;
	card_key: string | null;
	target_card_key: string | null;
	target_domain_key: string | null;
	offer_navigation: boolean;
	topic: string | null;
	answer: string | null;
	message: string;
	proposal_task: string;
	reason: string | null;
	should_change_draft: boolean;
	confidence: 'low' | 'medium' | 'high';
	model_status: string;
	request_id?: string | null;
	workflow_id?: string | null;
	model_input?: Record<string, unknown>;
};
