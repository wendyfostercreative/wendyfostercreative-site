export type OrionAdminHomeDecisionMode = 'answer_question' | 'offer_navigation' | 'route' | 'unknown';

export type OrionAdminHomeDecision = {
	mode: OrionAdminHomeDecisionMode;
	target_step_key?: string | null;
	topic?: string | null;
	answer?: string | null;
	offer_navigation: boolean;
	route?: string | null;
	action_label?: string | null;
	reason?: string | null;
	confidence: 'low' | 'medium' | 'high';
	model_status: string;
	model_input?: Record<string, unknown>;
};
