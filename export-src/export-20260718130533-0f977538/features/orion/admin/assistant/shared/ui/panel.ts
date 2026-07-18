import type { AssistantElements } from './elements';
import type { OrionAssistantState } from '../../../../core/types';

export function clampPanelPosition(
	elements: AssistantElements,
	left: number,
	top: number,
): { left: number; top: number } {
	const panelWidth = elements.panel?.offsetWidth || 420;
	const panelHeight = elements.panel?.offsetHeight || 640;
	return {
		left: Math.min(Math.max(12, left), Math.max(12, window.innerWidth - panelWidth - 12)),
		top: Math.min(Math.max(12, top), Math.max(12, window.innerHeight - panelHeight - 12)),
	};
}

export function applyPanelVisibility(
	elements: AssistantElements,
	state: OrionAssistantState,
): void {
	if (!elements.launcher || !elements.panel) return;
	if (!state.enabled) {
		state.open = false;
		elements.launcher.hidden = true;
		elements.panel.hidden = true;
		return;
	}

	const showPanel = state.open;
	elements.launcher.hidden = showPanel;
	elements.panel.hidden = !showPanel;
	elements.launcher.setAttribute('aria-expanded', showPanel ? 'true' : 'false');
	elements.panel.classList.toggle('is-expanded', Boolean(state.expanded));

	if (showPanel && state.position && window.innerWidth > 640) {
		const next = clampPanelPosition(elements, state.position.left, state.position.top);
		elements.panel.style.left = `${next.left}px`;
		elements.panel.style.top = `${next.top}px`;
		elements.panel.style.right = 'auto';
		elements.panel.style.bottom = 'auto';
	}
}
