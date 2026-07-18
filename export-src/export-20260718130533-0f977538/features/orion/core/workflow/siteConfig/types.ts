export type OrionSiteSummary = {
	admin_message?: string;
	model_status?: string;
	model_input?: Record<string, unknown>;
	site_name: string;
	short_description: string;
	logo_preference: string;
	logo_path: string;
	logo_alt_text: string;
	site_name_font: string;
	brand_font: string;
	style_words: string[];
	color_preferences: string[];
	font_preference: string;
	primary_font: string;
	nav_font: string;
	primary_color: string;
	accent_color: string;
	theme_mode: 'light' | 'dark' | '' | string;
	page_bg: string;
	page_panel: string;
	page_text: string;
	page_text_muted: string;
	page_border: string;
	header_bg: string;
	header_text: string;
	header_border: string;
	footer_bg: string;
	footer_text: string;
	footer_border: string;
	button_bg: string;
	button_bg_hover: string;
	button_text: string;
	button_text_hover: string;
	corner_style: 'square' | 'soft' | 'rounded' | string;
	container_width: string;
	content_width: string;
	card_radius: string;
	button_radius: string;
	input_radius: string;
	seo_title: string;
	seo_description: string;
	missing_fields: string[];
};

export type OrionSiteProposal = {
	site_name: string;
	logo_alt_text: string | null;
	site_name_font: string | null;
	logo_path: string | null;
	primary_font: string | null;
	nav_font: string | null;
	theme: Record<string, unknown> | null;
	default_seo_title: string | null;
	default_seo_description: string | null;
	agent_notes: string;
	metadata: Record<string, unknown>;
};

export type OrionSitePostProposalResult = {
	summary: OrionSiteSummary;
	proposal: OrionSiteProposal;
};

export type OrionSiteDecision = {
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
	model_input: Record<string, unknown> | null;
	request_id?: string | null;
	workflow_id?: string | null;
};
