import { getDomainController } from '../../state/registry';
import type { OrionMessageAction } from '../../../../core/types';
import { isConfirmationIntent } from '../../../../core/workflow';
import type { AssistantControllerStore } from './state';

export async function handleAssistantAction(
	store: AssistantControllerStore,
	action: OrionMessageAction['id'],
): Promise<void> {
	if (action === 'route_to_step') {
		const latestRouteAction = [...store.messages()]
			.reverse()
			.flatMap((message) => message.actions ?? [])
			.find((messageAction) => messageAction.id === 'route_to_step' && messageAction.href);
		if (latestRouteAction?.href) {
			window.location.href = latestRouteAction.href;
		}
		return;
	}

	const nextWorkflow = store.workflow();
	const controller = getDomainController(nextWorkflow.domain);
	if (!controller) return;

	const handled = await controller.handleAction({
		action,
		workflow: nextWorkflow,
		labels: store.labels,
		pathname: store.pathname,
		setWorkflow(next) {
			store.setWorkflow(next);
		},
		appendMessage: store.appendMessage,
		updateVisibleWorkflowContext: store.updateVisibleWorkflowContext,
		state: store.getState(),
	});
	if (!handled) return;

	store.applyState();
}

export async function handleAssistantSubmit(
	store: AssistantControllerStore,
	text: string,
): Promise<void> {
	store.appendMessage({ role: 'user', text });

	const nextWorkflow = store.workflow();
	const nextController = getDomainController(nextWorkflow.domain);
	if (nextController?.handleTextIntent) {
		const handled = await nextController.handleTextIntent({
			text,
			workflow: nextWorkflow,
			labels: store.labels,
			pathname: store.pathname,
			setWorkflow(next) {
				store.setWorkflow(next);
			},
			appendMessage: store.appendMessage,
			state: store.getState(),
			updateVisibleWorkflowContext: store.updateVisibleWorkflowContext,
		});
		if (handled) return;
	}

	if (isConfirmationIntent(text)) {
		if ((nextWorkflow.step === 'summary_ready' || nextWorkflow.step === 'collecting') && nextWorkflow.summary) {
			await handleAssistantAction(store, 'confirm_summary');
			return;
		}
	}

	const activeWorkflow = store.workflow();
	const controller = getDomainController(activeWorkflow.domain);
	if (!controller) return;

	await controller.handleSubmit({
		text,
		workflow: activeWorkflow,
		labels: store.labels,
		pathname: store.pathname,
		setWorkflow(next) {
			store.setWorkflow(next);
		},
		appendMessage: store.appendMessage,
	});
}
