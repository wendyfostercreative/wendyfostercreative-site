import { applyVisibleContext, getVisiblePageContext } from '../context/pageContext';
import { appendMessageForPath, messagesForPath } from '../../state/messages';
import { renderOrionMessage } from '../render/messageRenderer';
import { ORION_STATE_CHANGED_EVENT, loadOrionState, saveOrionState } from '../storage/orionState';
import { applyPanelVisibility } from '../ui/panel';
import type {
	OrionAssistantLabels,
	OrionAssistantState,
	OrionMessage,
	OrionPageContext,
	OrionWorkflowState,
} from '../../../../core/types';
import { createWorkflowForDomain, workflowDomainForPath } from '../../../../core/workflow';
import type { AssistantElements } from '../ui/elements';

type LegacyWorkflowState = Omit<OrionWorkflowState, 'domain'> & {
	domain: OrionWorkflowState['domain'] | 'site';
};

function isCurrentWorkflowDomain(
	domain: LegacyWorkflowState['domain'],
): domain is OrionWorkflowState['domain'] {
	return domain === 'admin_home' || domain === 'site_profile' || domain === 'site_config';
}

function normalizeWorkflow(existing: LegacyWorkflowState | undefined): OrionWorkflowState | null {
	if (!existing) return null;
	if (existing.domain === 'site') {
		return {
			...existing,
			domain: 'site_config',
		};
	}
	if (isCurrentWorkflowDomain(existing.domain)) {
		return {
			...existing,
			domain: existing.domain,
		};
	}
	return {
		...existing,
		domain: 'admin_home',
		proposal: existing.proposal ?? null,
	};
}

export type AssistantControllerStore = {
	pathname: string;
	context: OrionPageContext;
	labels: OrionAssistantLabels;
	elements: AssistantElements;
	root: HTMLElement;
	getState: () => OrionAssistantState;
	setState: (next: OrionAssistantState) => void;
	workflow: () => OrionWorkflowState;
	setWorkflow: (next: OrionWorkflowState) => void;
	messages: () => OrionMessage[];
	appendMessage: (message: OrionMessage) => void;
	updateVisibleWorkflowContext: () => void;
	renderMessages: () => void;
	applyState: () => void;
	syncFromStoredState: () => void;
};

export function createAssistantControllerStore({
	root,
	elements,
	pathname,
	context,
	labels,
}: {
	root: HTMLElement;
	elements: AssistantElements;
	pathname: string;
	context: OrionPageContext;
	labels: OrionAssistantLabels;
}): AssistantControllerStore {
	let state = loadOrionState();

	function workflow(): OrionWorkflowState {
		const existing = state.workflowsByPath[pathname];
		const normalized = normalizeWorkflow(existing);
		const desiredDomain = workflowDomainForPath(pathname);
		if (normalized && normalized.domain !== desiredDomain) {
			const next = createWorkflowForDomain(desiredDomain);
			state.workflowsByPath[pathname] = next;
			return next;
		}
		if (normalized) {
			state.workflowsByPath[pathname] = normalized;
			return normalized;
		}
		const next = createWorkflowForDomain(desiredDomain);
		state.workflowsByPath[pathname] = next;
		return next;
	}

	function updateVisibleWorkflowContext(): void {
		applyVisibleContext(root, getVisiblePageContext(workflow().domain, context, labels));
	}

	function messages(): OrionMessage[] {
		return messagesForPath(state, pathname, context, labels);
	}

	function renderMessages(): void {
		if (!elements.messagesEl) return;
		elements.messagesEl.innerHTML = '';
		for (const message of messages()) {
			elements.messagesEl.appendChild(renderOrionMessage(message));
		}
		elements.messagesEl.scrollTop = elements.messagesEl.scrollHeight;
	}

	function applyState(): void {
		applyPanelVisibility(elements, state);
		updateVisibleWorkflowContext();
		renderMessages();
		saveOrionState(state);
	}

	function appendMessage(message: OrionMessage): void {
		appendMessageForPath(state, pathname, context, labels, message);
		saveOrionState(state);
		renderMessages();
	}

	function syncFromStoredState(): void {
		state = loadOrionState();
		applyPanelVisibility(elements, state);
		updateVisibleWorkflowContext();
		renderMessages();
	}

	return {
		pathname,
		context,
		labels,
		elements,
		root,
		getState: () => state,
		setState(next) {
			state = next;
		},
		workflow,
		setWorkflow(next) {
			state.workflowsByPath[pathname] = next;
		},
		messages,
		appendMessage,
		updateVisibleWorkflowContext,
		renderMessages,
		applyState,
		syncFromStoredState,
	};
}

export { ORION_STATE_CHANGED_EVENT, loadOrionState, saveOrionState };
