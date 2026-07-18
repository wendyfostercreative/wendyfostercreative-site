import type { OrionMessage, OrionMessageAction, OrionWorkflowHandoff } from '../../types';

type CreateWorkflowHandoffMessageArgs = {
	scope: OrionWorkflowHandoff['scope'];
	headline: string;
	body: string;
	label?: string;
	actions?: OrionMessageAction[];
	replaceKey?: string;
};

export function createWorkflowHandoffMessage({
	scope,
	headline,
	body,
	label,
	actions,
	replaceKey,
}: CreateWorkflowHandoffMessageArgs): OrionMessage {
	return {
		role: 'assistant',
		text: '',
		handoff: {
			kind: 'workflow_handoff',
			scope,
			label,
			headline,
			body,
		},
		actions,
		replaceKey,
	};
}
