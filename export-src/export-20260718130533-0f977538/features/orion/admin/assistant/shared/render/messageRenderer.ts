import type { OrionMessage } from '../../../../core/types';
import { renderOrionMessageActions } from './actionRenderer';
import { renderOrionReviewCard } from './reviewCardRenderer';
import { renderWorkflowHandoffCard } from './workflowHandoffRenderer';

export function renderOrionMessage(message: OrionMessage): HTMLElement {
	const item = document.createElement('div');
	item.className = `orion-message orion-message--${message.role}${message.review ? ' orion-message--review' : ''}${message.handoff ? ' orion-message--handoff' : ''}`;

	if (message.text) {
		const text = document.createElement('div');
		text.className = 'orion-message__text';
		text.textContent = message.text;
		item.appendChild(text);
	}

	if (message.review) {
		item.appendChild(renderOrionReviewCard(message.review));
	}

	if (message.handoff) {
		item.appendChild(renderWorkflowHandoffCard(message.handoff, message.actions));
	}

	if (message.actions?.length && !message.handoff) {
		item.appendChild(renderOrionMessageActions(message.actions));
	}

	return item;
}
