import type { OrionMessageAction, OrionWorkflowHandoff } from '../../../../core/types';
import { renderOrionMessageActions } from './actionRenderer';

export function renderWorkflowHandoffCard(
	handoff: OrionWorkflowHandoff,
	actions?: OrionMessageAction[],
): HTMLElement {
	const card = document.createElement('div');
	card.className = `orion-workflow-handoff orion-workflow-handoff--${handoff.scope}`;

	if (handoff.label) {
		const label = document.createElement('div');
		label.className = 'orion-workflow-handoff__label';
		label.textContent = handoff.label;
		card.appendChild(label);
	}

	const headline = document.createElement('h3');
	headline.className = 'orion-workflow-handoff__headline';
	headline.textContent = handoff.headline;
	card.appendChild(headline);

	const body = document.createElement('p');
	body.className = 'orion-workflow-handoff__body';
	body.textContent = handoff.body;
	card.appendChild(body);

	if (actions?.length) {
		const actionBlock = renderOrionMessageActions(actions);
		actionBlock.classList.add('orion-workflow-handoff__actions');
		card.appendChild(actionBlock);
	}

	return card;
}
