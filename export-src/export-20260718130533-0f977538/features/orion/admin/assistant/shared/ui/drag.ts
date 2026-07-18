import type { OrionAssistantState } from '../../../../core/types';
import type { AssistantElements } from './elements';
import { clampPanelPosition } from './panel';

type DragOptions = {
	elements: AssistantElements;
	getState: () => OrionAssistantState;
	saveState: () => void;
	applyState: () => void;
};

export function bindPanelDrag({ elements, getState, saveState, applyState }: DragOptions): void {
	let dragging = false;
	let dragOffset = { x: 0, y: 0 };

	elements.header?.addEventListener('pointerdown', (event) => {
		if (!elements.panel || window.innerWidth <= 640) return;
		const target = event.target as HTMLElement;
		if (target.closest('button')) return;
		const rect = elements.panel.getBoundingClientRect();
		dragging = true;
		dragOffset = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
		elements.header?.setPointerCapture(event.pointerId);
	});

	elements.header?.addEventListener('pointermove', (event) => {
		if (!dragging || !elements.panel) return;
		const state = getState();
		const next = clampPanelPosition(elements, event.clientX - dragOffset.x, event.clientY - dragOffset.y);
		state.position = next;
		elements.panel.style.left = `${next.left}px`;
		elements.panel.style.top = `${next.top}px`;
		elements.panel.style.right = 'auto';
		elements.panel.style.bottom = 'auto';
	});

	elements.header?.addEventListener('pointerup', (event) => {
		if (!dragging) return;
		dragging = false;
		elements.header?.releasePointerCapture(event.pointerId);
		saveState();
	});

	window.addEventListener('resize', () => {
		const state = getState();
		if (state.position && elements.panel && window.innerWidth > 640) {
			state.position = clampPanelPosition(elements, state.position.left, state.position.top);
		}
		applyState();
	});
}
