import type { OrionAssistantState } from './types';

export const ORION_STORAGE_KEY = 'orion.assistant.v1';
export const ORION_STATE_CHANGED_EVENT = 'orion:state-changed';

export function defaultOrionState(): OrionAssistantState {
	return {
		enabled: false,
		open: false,
		expanded: false,
		position: null,
		messagesByPath: {},
		workflowsByPath: {},
	};
}

export function loadOrionState(): OrionAssistantState {
	try {
		const parsed = JSON.parse(window.localStorage.getItem(ORION_STORAGE_KEY) || '');
		return {
			...defaultOrionState(),
			...parsed,
			messagesByPath: parsed?.messagesByPath && typeof parsed.messagesByPath === 'object'
				? parsed.messagesByPath
				: {},
			workflowsByPath: parsed?.workflowsByPath && typeof parsed.workflowsByPath === 'object'
				? parsed.workflowsByPath
				: {},
		};
	} catch {
		return defaultOrionState();
	}
}

export function saveOrionState(next: OrionAssistantState): void {
	window.localStorage.setItem(ORION_STORAGE_KEY, JSON.stringify(next));
	window.dispatchEvent(new CustomEvent(ORION_STATE_CHANGED_EVENT, { detail: next }));
}
