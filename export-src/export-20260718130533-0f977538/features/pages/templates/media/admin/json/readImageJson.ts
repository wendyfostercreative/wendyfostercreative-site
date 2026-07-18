import { DEFAULT_IMAGE_TEMPLATE_CONTENT, normalizeImageTemplateContent } from '../../schema/content';

import { asInputValue, fieldValue, setPath } from './imageDom';

function readPageHeader(editor: HTMLElement): Record<string, unknown> {
	const header: Record<string, unknown> = {};
	Array.from(editor.querySelectorAll('[data-image-header-field]')).forEach((field) => {
		const key = String((field as HTMLElement).dataset.imageHeaderField || '');
		if (!key) return;
		header[key] = asInputValue(field);
	});
	return header;
}

function readShowPageHeader(editor: HTMLElement): boolean {
	const toggle = editor.querySelector('[data-image-header-toggle] input[type="checkbox"]') as HTMLInputElement | null;
	return Boolean(toggle?.checked);
}

function readLinks(editor: HTMLElement): Array<Record<string, unknown>> {
	return Array.from(editor.querySelectorAll('[data-image-link]')).map((linkEl) => {
		const next: Record<string, unknown> = { label: '', url: '' };
		Array.from(linkEl.querySelectorAll('[data-image-link-field]')).forEach((field) => {
			const key = String((field as HTMLElement).dataset.imageLinkField || '');
			if (!key) return;
			next[key] = asInputValue(field);
		});
		return next;
	});
}

function readLayoutVariant(editor: HTMLElement): string {
	const checkedRadio = editor.querySelector('input[type="radio"][name="images-display-layout_variant"]:checked');
	return asInputValue(checkedRadio);
}

export function readImageJson(editor: HTMLElement) {
	const next = structuredClone(DEFAULT_IMAGE_TEMPLATE_CONTENT) as Record<string, any>;

	Array.from(editor.querySelectorAll('[data-image-template-field]')).forEach((field) => {
		const path = String((field as HTMLElement).dataset.imageTemplateField || '');
		if (!path) return;
		setPath(next, path, fieldValue(field));
	});

	next.show_page_header = readShowPageHeader(editor);
	next.page_header = readPageHeader(editor);
	next.display.layout_variant = readLayoutVariant(editor) || DEFAULT_IMAGE_TEMPLATE_CONTENT.display.layout_variant;
	next.links = readLinks(editor);

	return normalizeImageTemplateContent(next);
}
