export function focusSiteConfigCard(cardKey: string): void {
	window.dispatchEvent(
		new CustomEvent('orion:site-config-focus-card', {
			detail: { cardKey },
		}),
	);
}
