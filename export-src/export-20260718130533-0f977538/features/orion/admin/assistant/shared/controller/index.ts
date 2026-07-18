import { fallbackLabels } from '../context/assistantLabels';
import { assistantFallbackPageContext } from '../context/pageContext';
import { readJson } from '../helpers/json';
import { isSupportedMessageAction } from '../helpers/messageActions';
import { resetMessagesForPath } from '../../state/messages';
import { bindPanelDrag } from '../ui/drag';
import { getAssistantElements } from '../ui/elements';
import { createWorkflowForDomain, workflowDomainForPath } from '../../../../core/workflow';
import { getDomainController } from '../../state/registry';
import { handleSaveCompletions } from './completion';
import { handleAssistantAction, handleAssistantSubmit } from './dispatch';
import {
	createAssistantControllerStore,
	ORION_STATE_CHANGED_EVENT,
	saveOrionState,
} from './state';

export function initOrionAssistant(root: HTMLElement): void {
	const context = readJson(root.dataset.pageContext, assistantFallbackPageContext);
	const labels = readJson(root.dataset.labels, fallbackLabels);
	const pathname = root.dataset.pathname || window.location.pathname;
	const searchParams = new URLSearchParams(window.location.search);
	const elements = getAssistantElements(root);
	const store = createAssistantControllerStore({
		root,
		elements,
		pathname,
		context,
		labels,
	});

	elements.launcher?.addEventListener('click', () => {
		const state = store.getState();
		state.open = true;
		store.applyState();
		elements.input?.focus();
	});

	handleSaveCompletions(store, searchParams);

	elements.collapseButton?.addEventListener('click', () => {
		const state = store.getState();
		state.open = false;
		store.applyState();
	});

	elements.expandButton?.addEventListener('click', () => {
		const state = store.getState();
		state.expanded = !state.expanded;
		store.applyState();
	});

	elements.closeButton?.addEventListener('click', () => {
		const state = store.getState();
		state.open = false;
		store.applyState();
	});

	elements.clearButton?.addEventListener('click', () => {
		const state = store.getState();
		const domain = workflowDomainForPath(pathname);
		state.workflowsByPath[pathname] = createWorkflowForDomain(domain);
		const controller = getDomainController(domain);
		const resetHandled = controller?.resetState?.({
			pathname,
			context,
			labels,
			state,
		});
		if (!resetHandled) {
			resetMessagesForPath(state, pathname, context, labels);
		}
		if (elements.input) elements.input.value = '';
		store.applyState();
	});

	elements.form?.addEventListener('submit', async (event) => {
		event.preventDefault();
		const text = elements.input?.value.trim() || '';
		if (!text) return;
		await handleAssistantSubmit(store, text);
		if (elements.input) elements.input.value = '';
	});

	elements.messagesEl?.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		const button = target.closest<HTMLButtonElement>('[data-orion-action]');
		if (!button) return;
		const action = button.dataset.orionAction;
		if (isSupportedMessageAction(action)) {
			void handleAssistantAction(store, action);
		}
	});

	bindPanelDrag({
		elements,
		getState: store.getState,
		saveState() {
			saveOrionState(store.getState());
		},
		applyState: store.applyState,
	});

	window.addEventListener(ORION_STATE_CHANGED_EVENT, store.syncFromStoredState);
	window.addEventListener('storage', store.syncFromStoredState);
	window.addEventListener('focus', store.syncFromStoredState);

	store.applyState();
}
