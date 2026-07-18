import type { OrionMessageAction } from '../../../../core/types';

export function renderOrionMessageActions(actions: OrionMessageAction[]): HTMLElement {
	const wrapper = document.createElement('div');
	wrapper.className = 'orion-message-actions';

	for (const action of actions) {
		const button = document.createElement('button');
		button.className = 'orion-message-action';
		button.type = 'button';
		button.dataset.orionAction = action.id;
		button.textContent = action.label;
		wrapper.appendChild(button);
	}

	return wrapper;
}
