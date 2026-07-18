export function renumberImageLinks(editor: HTMLElement): void {
	const titleTemplate = editor.dataset.imageLinkTitleTemplate || 'Link {number}';

	Array.from(editor.querySelectorAll('[data-image-link]')).forEach((linkEl, index) => {
		const title = linkEl.querySelector('[data-image-link-title]');
		if (title) title.textContent = titleTemplate.replace('{number}', String(index + 1));
	});
}

export function initImageLinksEditor(editor: HTMLElement, onChange: () => void): void {
	const list = editor.querySelector('[data-image-link-list]') as HTMLElement | null;
	const addButton = editor.querySelector('[data-add-image-link]') as HTMLButtonElement | null;
	const template = editor.querySelector('template[data-image-link-template]') as HTMLTemplateElement | null;
	if (!list || !addButton || !template) return;

	list.addEventListener('click', (event) => {
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;
		if (!target.hasAttribute('data-remove-image-link')) return;

		target.closest('[data-image-link]')?.remove();
		renumberImageLinks(editor);
		onChange();
	});

	addButton.addEventListener('click', () => {
		list.appendChild(template.content.cloneNode(true));
		renumberImageLinks(editor);
		onChange();
	});

	renumberImageLinks(editor);
}
