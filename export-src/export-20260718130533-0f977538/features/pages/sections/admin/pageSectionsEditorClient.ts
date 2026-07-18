type RegistryLayout = {
	key: string;
	label: string;
	description?: string;
};

type RegistryEntry = {
	type: string;
	label: string;
	description: string;
	defaultLayout: string;
	layouts: RegistryLayout[];
	defaultContent: Record<string, any>;
};

function sectionId(): string {
	return `sec_${Math.random().toString(36).slice(2, 10)}`;
}

function escapeHtml(value: unknown): string {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function inputValue(el: Element | null): string {
	if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return el.value.trim();
	return '';
}

function actionLabel(action: unknown): string {
	if (!action || typeof action !== 'object') return '';
	const raw = action as Record<string, unknown>;
	return raw.label && raw.href ? String(raw.label) : '';
}

function linkHref(link: unknown): string {
	if (!link || typeof link !== 'object') return '';
	const raw = link as Record<string, unknown>;
	return raw.href ? String(raw.href) : '';
}

function readAction(root: Element): Record<string, unknown> {
	const pageIdRaw = inputValue(root.querySelector('[data-section-action-field="page_id"]'));
	const pageId = pageIdRaw ? Number(pageIdRaw) : null;
	return {
		label: inputValue(root.querySelector('[data-section-action-field="label"]')),
		target_type: inputValue(root.querySelector('[data-section-action-field="target_type"]')) === 'cms_page' ? 'cms_page' : 'external_url',
		page_id: Number.isFinite(pageId) ? pageId : null,
		href: inputValue(root.querySelector('[data-section-action-field="href"]')),
	};
}

function readContent(card: Element): Record<string, unknown> {
	const content: Record<string, unknown> = {};
	card.querySelectorAll('[data-section-field]').forEach((field) => {
		const key = (field as HTMLElement).dataset.sectionField || '';
		if (key) content[key] = inputValue(field);
	});
	const imagePath = inputValue(card.querySelector('[data-section-image-field="path"]'));
	const imageAlt = inputValue(card.querySelector('[data-section-image-field="alt"]'));
	const imageShape = inputValue(card.querySelector('[data-section-image-field="shape"]'));
	if (card.querySelector('[data-section-image-field]')) {
		const image: Record<string, unknown> = { source: 'path', path: imagePath, alt: imageAlt };
		if (['natural', 'square', 'wide'].includes(imageShape)) image.shape = imageShape;
		const imageLinkRoot = card.querySelector('[data-section-image-link]');
		if (imageLinkRoot) image.link = readAction(imageLinkRoot);
		content.image = image;
	}
	if (card.querySelector('[data-section-thumbnails]')) {
		content.thumbnails = Array.from(card.querySelectorAll('[data-section-thumbnail-item]')).slice(0, 10).map((item) => {
			const imagePath = inputValue(item.querySelector('[data-image-path-input]'));
			const thumbPath = inputValue(item.querySelector('[data-image-thumb-path-input]'));
			const imageAlt = inputValue(item.querySelector('[data-thumbnail-image-field="alt"]'));
			const linkRoot = item.querySelector('[data-thumbnail-link]');
			const image: Record<string, unknown> = { source: 'path', path: imagePath, alt: imageAlt, shape: 'square' };
			if (thumbPath) image.thumb_path = thumbPath;
			return {
				image,
				link: linkRoot ? readAction(linkRoot) : { label: '', target_type: 'external_url', page_id: null, href: '' },
			};
		});
	}
	card.querySelectorAll('[data-section-action]').forEach((actionRoot) => {
		const key = (actionRoot as HTMLElement).dataset.sectionAction || '';
		if (key) content[key] = readAction(actionRoot);
	});
	return content;
}

function readSections(editor: HTMLElement): Array<Record<string, unknown>> {
	return Array.from(editor.querySelectorAll('[data-section-editor-card]')).map((card) => ({
		id: (card as HTMLElement).dataset.sectionId || sectionId(),
		type: (card as HTMLElement).dataset.sectionType || 'hero',
		layout: inputValue(card.querySelector('[data-section-layout-select]')) || (card as HTMLElement).dataset.sectionLayout || 'hero.centered',
		content: readContent(card),
	}));
}

function registryData(editor: HTMLElement): Record<string, RegistryEntry> {
	return JSON.parse(editor.dataset.sectionRegistry || '{}') as Record<string, RegistryEntry>;
}

function matchingEditor(editor: HTMLElement, id: string): HTMLElement | null {
	return editor.querySelector(`[data-section-editor-card][data-section-id="${CSS.escape(id)}"]`);
}

function layoutLabel(entry: RegistryEntry | undefined, key: string): string {
	return entry?.layouts.find((layout) => layout.key === key)?.label || key;
}

function sectionSummary(card: Element): string {
	const type = (card as HTMLElement).dataset.sectionType || '';
	const content = readContent(card);
	if (type === 'contact_details') return String(content.email || content.phone || content.location || 'Contact details section');
	if (type === 'contact_form_block') return String(content.heading || content.body || 'Contact form block');
	if (type === 'contact_intro') return String(content.heading || content.body || 'Contact intro section');
	if (type === 'rich_text') return String(content.heading || content.body || 'Rich text section');
	if (type === 'content_hero') return String(content.headline || content.body || 'Content hero section');
	if (type === 'thumbnail_grid') {
		const thumbnails = Array.isArray(content.thumbnails) ? content.thumbnails : [];
		const count = thumbnails.filter((item) => {
			const raw = item && typeof item === 'object' ? item as Record<string, unknown> : {};
			const image = raw.image && typeof raw.image === 'object' ? raw.image as Record<string, unknown> : {};
			return Boolean(image.path);
		}).length;
		return String(content.heading || `${count || 'No'} thumbnail${count === 1 ? '' : 's'}`);
	}
	if (type === 'image_link_text') return String(content.heading || content.body || 'Image, link, and text section');
	return String(content.headline || content.body || 'Hero section');
}

function sectionImageStatus(card: Element): string {
	const content = readContent(card);
	const thumbnails = Array.isArray(content.thumbnails) ? content.thumbnails : [];
	if (thumbnails.length) {
		const count = thumbnails.filter((item) => {
			const raw = item && typeof item === 'object' ? item as Record<string, unknown> : {};
			const image = raw.image && typeof raw.image === 'object' ? raw.image as Record<string, unknown> : {};
			return Boolean(image.path);
		}).length;
		return count ? `${count} thumbnail${count === 1 ? '' : 's'}` : 'No thumbnails';
	}
	const image = content.image as Record<string, unknown> | undefined;
	return image?.path ? 'Image set' : 'No image';
}

function sectionActionStatus(card: Element): string {
	const content = readContent(card);
	const image = content.image && typeof content.image === 'object' ? content.image as Record<string, unknown> : {};
	const thumbnailLinks = Array.isArray(content.thumbnails) ? content.thumbnails.filter((item) => {
		const raw = item && typeof item === 'object' ? item as Record<string, unknown> : {};
		const link = raw.link && typeof raw.link === 'object' ? raw.link as Record<string, unknown> : {};
		return Boolean(link.href);
	}).length : 0;
	const labels = [actionLabel(content.primary_action), actionLabel(content.secondary_action), linkHref(image.link)].filter(Boolean);
	const count = labels.length + thumbnailLinks;
	return count ? `${count} link${count === 1 ? '' : 's'}` : 'No link';
}

function refreshSummaries(editor: HTMLElement): void {
	const registry = registryData(editor);
	const items = Array.from(editor.querySelectorAll('[data-page-section]')) as HTMLElement[];
	items.forEach((item, index) => {
		const card = matchingEditor(editor, item.dataset.sectionId || '');
		const type = item.dataset.sectionType || card?.dataset.sectionType || '';
		const layout = inputValue(card?.querySelector('[data-section-layout-select]') || null) || item.dataset.sectionLayout || '';
		const entry = registry[type];
		item.dataset.sectionLayout = layout;
		if (card) card.dataset.sectionLayout = layout;
		item.querySelector('[data-section-number]')!.textContent = String(index + 1);
		item.querySelector('[data-section-label]')!.textContent = entry?.label || type;
		item.querySelector('[data-section-layout-label]')!.textContent = layoutLabel(entry, layout);
		if (card) {
			item.querySelector('[data-section-summary]')!.textContent = sectionSummary(card);
			item.querySelector('[data-section-image-status]')!.textContent = sectionImageStatus(card);
			item.querySelector('[data-section-action-status]')!.textContent = sectionActionStatus(card);
		}
	});
}

function sync(editor: HTMLElement): void {
	const hidden = editor.querySelector('#contentJson') as HTMLTextAreaElement | null;
	if (!hidden) return;
	hidden.value = JSON.stringify({ schema: 'page.sections.v1', sections: readSections(editor) }, null, 2);
	refreshSummaries(editor);
}

function updateMoveButtons(editor: HTMLElement): void {
	const items = Array.from(editor.querySelectorAll('[data-page-section]'));
	items.forEach((item, index) => {
		(item.querySelector('[data-section-move="up"]') as HTMLButtonElement | null)?.toggleAttribute('disabled', index === 0);
		(item.querySelector('[data-section-move="down"]') as HTMLButtonElement | null)?.toggleAttribute('disabled', index === items.length - 1);
	});
}

function updateThumbnailControls(root: ParentNode): void {
	root.querySelectorAll?.('[data-section-thumbnails]').forEach((group) => {
		const items = Array.from(group.querySelectorAll('[data-section-thumbnail-item]')) as HTMLElement[];
		items.forEach((item, index) => {
			item.dataset.thumbnailIndex = String(index);
			(item.querySelector('[data-thumbnail-number]') as HTMLElement | null)!.textContent = String(index + 1);
			(item.querySelector('[data-thumbnail-move="up"]') as HTMLButtonElement | null)?.toggleAttribute('disabled', index === 0);
			(item.querySelector('[data-thumbnail-move="down"]') as HTMLButtonElement | null)?.toggleAttribute('disabled', index === items.length - 1);
		});
	});
}

function setEmptyState(editor: HTMLElement): void {
	const hasSections = Boolean(editor.querySelector('[data-page-section]'));
	(editor.querySelector('[data-section-empty-state]') as HTMLElement | null)?.classList.toggle('hidden', hasSections);
}

function selectSection(editor: HTMLElement, id: string): void {
	editor.querySelectorAll('[data-page-section]').forEach((item) => {
		const active = (item as HTMLElement).dataset.sectionId === id;
		(item as HTMLElement).dataset.active = active ? 'true' : 'false';
		item.classList.toggle('border-[var(--site-color-text)]', active);
		item.classList.toggle('shadow-sm', active);
		item.classList.toggle('border-[var(--site-color-border-soft)]', !active);
	});
	editor.querySelectorAll('[data-section-editor-card]').forEach((card) => {
		const active = (card as HTMLElement).dataset.sectionId === id;
		(card as HTMLElement).dataset.active = active ? 'true' : 'false';
		card.classList.toggle('hidden', !active);
	});
	setEmptyState(editor);
}

function selectedPickerType(editor: HTMLElement): string {
	return inputValue(editor.querySelector('[data-section-type-select]')) || 'hero';
}

function selectedPickerLayout(editor: HTMLElement): string {
	return inputValue(editor.querySelector('[data-section-picker-card] [data-section-layout-select]'));
}

function updatePicker(editor: HTMLElement): void {
	const registry = registryData(editor);
	const entry = registry[selectedPickerType(editor)];
	const layoutSelect = editor.querySelector('[data-section-picker-card] [data-section-layout-select]') as HTMLSelectElement | null;
	if (!entry || !layoutSelect) return;
	layoutSelect.innerHTML = entry.layouts.map((layout) => `<option value="${escapeHtml(layout.key)}">${escapeHtml(layout.label)}</option>`).join('');
	layoutSelect.value = entry.defaultLayout;
	(editor.querySelector('[data-section-description]') as HTMLElement | null)!.textContent = entry.description;
	updateLayoutPreview(editor);
}

function updateLayoutPreview(editor: HTMLElement): void {
	const registry = registryData(editor);
	const entry = registry[selectedPickerType(editor)];
	const layoutKey = selectedPickerLayout(editor);
	const layout = entry?.layouts.find((candidate) => candidate.key === layoutKey);
	const description = editor.querySelector('[data-layout-description]') as HTMLElement | null;
	if (description) description.textContent = layout?.description || '';
	const art = editor.querySelector('[data-layout-preview-art]') as HTMLElement | null;
	if (!art) return;
	const imageRight = layoutKey.includes('right');
	const imageLeft = layoutKey.includes('left');
	if (imageLeft || imageRight) {
		art.innerHTML = `<div class="grid w-full grid-cols-2 gap-3"><div class="${imageRight ? 'order-2 ' : ''}h-20 rounded bg-[var(--site-color-border-soft)]"></div><div class="grid content-center gap-2"><div class="h-3 rounded bg-[var(--site-color-text)] opacity-20"></div><div class="h-2 rounded bg-[var(--site-color-border-soft)]"></div><div class="h-6 w-16 rounded bg-[var(--site-color-button-bg)] opacity-60"></div></div></div>`;
		return;
	}
	art.innerHTML = `<div class="grid w-full max-w-44 gap-2 text-center"><div class="mx-auto h-3 w-16 rounded bg-[var(--site-color-border-soft)]"></div><div class="h-4 rounded bg-[var(--site-color-text)] opacity-20"></div><div class="mx-auto h-3 w-24 rounded bg-[var(--site-color-border-soft)]"></div><div class="mx-auto h-7 w-20 rounded bg-[var(--site-color-button-bg)] opacity-60"></div></div>`;
}

function actionFields(key: string, label: string, action: Record<string, unknown> = {}): string {
	return `<div class="grid gap-2 rounded border p-3" data-section-action="${key}"><div class="text-sm font-semibold">${label}</div><label class="grid gap-1 text-sm">Label<input class="rounded border px-3 py-2" data-section-action-field="label" value="${escapeHtml(action.label)}" /></label><label class="grid gap-1 text-sm">Target<select class="rounded border px-3 py-2" data-section-action-field="target_type"><option value="external_url" ${action.target_type !== 'cms_page' ? 'selected' : ''}>External URL</option><option value="cms_page" ${action.target_type === 'cms_page' ? 'selected' : ''}>CMS page</option></select></label><label class="grid gap-1 text-sm">CMS page ID<input class="rounded border px-3 py-2" type="number" data-section-action-field="page_id" value="${escapeHtml(action.page_id)}" /></label><label class="grid gap-1 text-sm">Href<input class="rounded border px-3 py-2" data-section-action-field="href" value="${escapeHtml(action.href)}" /></label></div>`;
}

function mediaLabel(template: string): string {
	if (template === 'home') return 'Home media';
	if (template === 'content') return 'Content media';
	if (template === 'contact') return 'Contact media';
	return 'Page media';
}

function uploadMediaRole(template: string): string {
	if (template === 'home') return 'home_image';
	if (template === 'content') return 'content_image';
	if (template === 'contact') return 'contact_image';
	return '';
}

function uploadCollection(template: string): string {
	if (template === 'home') return 'home_section';
	if (template === 'content') return 'content_section';
	if (template === 'contact') return 'contact_section';
	return '';
}

function imageFields(image: Record<string, unknown> = {}, libraryLabel = 'Page media', mediaRole = '', collection = '', category = '', includeShape = false): string {
	const link = image.link && typeof image.link === 'object' ? image.link as Record<string, unknown> : {};
	const shape = ['natural', 'square', 'wide'].includes(String(image.shape)) ? String(image.shape) : 'natural';
	const shapeField = includeShape ? `<label class="grid gap-1 text-sm">Image shape<select class="rounded border px-3 py-2" data-section-image-field="shape"><option value="natural" ${shape === 'natural' ? 'selected' : ''}>Natural image shape</option><option value="square" ${shape === 'square' ? 'selected' : ''}>Square crop</option><option value="wide" ${shape === 'wide' ? 'selected' : ''}>Wide crop</option></select></label>` : '';
	return `<div class="grid gap-2 rounded border p-3">
		<div class="text-sm font-semibold">Image</div>
		<div class="grid gap-3" data-image-path-picker data-image-picker-loading="Loading..." data-image-picker-failed-to-load="Failed to load" data-image-picker-uploading="Uploading..." data-image-picker-upload-failed="Upload failed" data-image-media-role="${escapeHtml(mediaRole)}" data-image-upload-collection="${escapeHtml(collection)}" data-image-upload-category="${escapeHtml(category)}">
			<div class="grid gap-3 sm:grid-cols-[180px_1fr] sm:items-start">
				<div class="overflow-hidden rounded-[var(--site-radius-input)] border border-[var(--site-color-border-soft)] bg-[var(--site-color-panel)]" style="aspect-ratio: 1 / 1;" data-image-preview-wrap>
					<img class="h-full w-full object-cover hidden" alt="Selected image" loading="lazy" data-image-preview />
					<div class="h-full w-full flex items-center justify-center text-xs text-[var(--site-color-text-muted)]" data-image-preview-empty>No image selected</div>
				</div>
				<div class="grid gap-2">
					<input type="hidden" name="section-image-path" value="${escapeHtml(image.path)}" data-image-path-input data-section-image data-section-image-field="path" />
					<div class="flex flex-wrap items-center gap-2">
						<input class="hidden" type="file" accept="image/jpeg,image/png,image/webp" data-image-file-input />
						<button class="rounded-[var(--site-radius-button)] border border-[var(--site-color-border-soft)] bg-[var(--site-color-button-bg)] px-3 py-2 text-sm text-[var(--site-color-button-text)]" type="button" data-image-upload>Upload image</button>
						<button class="rounded-[var(--site-radius-button)] border border-[var(--site-color-border-soft)] bg-white px-3 py-2 text-sm text-[var(--site-color-text)]" type="button" data-image-choose>Choose existing</button>
						<button class="rounded-[var(--site-radius-button)] border border-[var(--site-color-border-soft)] bg-white px-3 py-2 text-sm text-[var(--site-color-text)]" type="button" data-image-clear>Clear</button>
						<div class="text-xs text-[var(--site-color-text-muted)]" data-image-status></div>
					</div>
				</div>
			</div>
			<div class="hidden" data-image-library>
				<div class="mt-2 flex flex-col gap-3 overflow-hidden rounded-[var(--site-radius-card)] border border-[var(--site-color-border-soft)] bg-white p-3">
					<div class="flex items-center justify-between gap-2">
						<div class="text-sm font-medium text-[var(--site-color-text)]">${escapeHtml(libraryLabel)}</div>
						<button class="rounded-[var(--site-radius-button)] border border-[var(--site-color-border-soft)] bg-white px-2 py-1 text-xs text-[var(--site-color-text)]" type="button" data-image-library-close>Close</button>
					</div>
					<div class="grid max-h-[32rem] gap-3 overflow-y-auto pb-1 pr-1 sm:grid-cols-2 lg:grid-cols-3" data-image-library-grid></div>
				</div>
			</div>
		</div>
		<label class="grid gap-1 text-sm">Alt text<input class="rounded border px-3 py-2" data-section-image-field="alt" value="${escapeHtml(image.alt)}" /></label>
		${shapeField}
		<div class="grid gap-2 rounded border border-[var(--site-color-border-soft)] p-3" data-section-image-link>
			<div class="text-sm font-semibold">Image click target</div>
			<label class="grid gap-1 text-sm">Target<select class="rounded border px-3 py-2" data-section-action-field="target_type"><option value="external_url" ${link.target_type !== 'cms_page' ? 'selected' : ''}>External URL</option><option value="cms_page" ${link.target_type === 'cms_page' ? 'selected' : ''}>CMS page</option></select></label>
			<label class="grid gap-1 text-sm">CMS page ID<input class="rounded border px-3 py-2" type="number" data-section-action-field="page_id" value="${escapeHtml(link.page_id)}" /></label>
			<label class="grid gap-1 text-sm">Href<input class="rounded border px-3 py-2" data-section-action-field="href" value="${escapeHtml(link.href)}" placeholder="/gallery" /></label>
		</div>
	</div>`;
}

function thumbnailFields(thumbnails: Array<Record<string, unknown>> = [], libraryLabel = 'Page media', mediaRole = '', collection = '', category = ''): string {
	const items = Array.from({ length: 10 }, (_, index) => {
		const item = thumbnails[index] && typeof thumbnails[index] === 'object' ? thumbnails[index] as Record<string, unknown> : {};
		const image = item.image && typeof item.image === 'object' ? item.image as Record<string, unknown> : {};
		const link = item.link && typeof item.link === 'object' ? item.link as Record<string, unknown> : {};
		return `<div class="grid gap-3 rounded border border-[var(--site-color-border-soft)] p-3" data-section-thumbnail-item data-thumbnail-index="${index}">
			<div class="flex flex-wrap items-center justify-between gap-2"><div class="text-sm font-semibold">Thumbnail <span data-thumbnail-number>${index + 1}</span></div><div class="flex flex-wrap gap-2"><button class="rounded border px-2 py-1 text-xs" type="button" data-thumbnail-move="up">Move up</button><button class="rounded border px-2 py-1 text-xs" type="button" data-thumbnail-move="down">Move down</button></div></div>
			<div class="grid gap-3" data-image-path-picker data-image-picker-loading="Loading..." data-image-picker-failed-to-load="Failed to load" data-image-picker-uploading="Uploading..." data-image-picker-upload-failed="Upload failed" data-image-media-role="${escapeHtml(mediaRole)}" data-image-upload-collection="${escapeHtml(collection)}" data-image-upload-category="${escapeHtml(category)}">
				<div class="grid gap-3 sm:grid-cols-[180px_1fr] sm:items-start">
					<div class="overflow-hidden rounded-[var(--site-radius-input)] border border-[var(--site-color-border-soft)] bg-[var(--site-color-panel)]" style="aspect-ratio: 1 / 1;" data-image-preview-wrap><img class="h-full w-full object-cover hidden" alt="Selected image" loading="lazy" data-image-preview /><div class="h-full w-full flex items-center justify-center text-xs text-[var(--site-color-text-muted)]" data-image-preview-empty>No image selected</div></div>
					<div class="grid gap-2"><input type="hidden" name="section-thumbnail-${index}-path" value="${escapeHtml(image.path)}" data-image-path-input /><input type="hidden" name="section-thumbnail-${index}-thumb-path" value="${escapeHtml(image.thumb_path)}" data-image-thumb-path-input /><div class="flex flex-wrap items-center gap-2"><input class="hidden" type="file" accept="image/jpeg,image/png,image/webp" data-image-file-input /><button class="rounded-[var(--site-radius-button)] border border-[var(--site-color-border-soft)] bg-[var(--site-color-button-bg)] px-3 py-2 text-sm text-[var(--site-color-button-text)]" type="button" data-image-upload>Upload image</button><button class="rounded-[var(--site-radius-button)] border border-[var(--site-color-border-soft)] bg-white px-3 py-2 text-sm text-[var(--site-color-text)]" type="button" data-image-choose>Choose existing</button><button class="rounded-[var(--site-radius-button)] border border-[var(--site-color-border-soft)] bg-white px-3 py-2 text-sm text-[var(--site-color-text)]" type="button" data-image-clear>Clear</button><div class="text-xs text-[var(--site-color-text-muted)]" data-image-status></div></div></div>
				</div>
				<div class="hidden" data-image-library><div class="mt-2 flex flex-col gap-3 overflow-hidden rounded-[var(--site-radius-card)] border border-[var(--site-color-border-soft)] bg-white p-3"><div class="flex items-center justify-between gap-2"><div class="text-sm font-medium text-[var(--site-color-text)]">${escapeHtml(libraryLabel)}</div><button class="rounded-[var(--site-radius-button)] border border-[var(--site-color-border-soft)] bg-white px-2 py-1 text-xs text-[var(--site-color-text)]" type="button" data-image-library-close>Close</button></div><div class="grid max-h-[32rem] gap-3 overflow-y-auto pb-1 pr-1 sm:grid-cols-2 lg:grid-cols-3" data-image-library-grid></div></div></div>
			</div>
			<label class="grid gap-1 text-sm">Alt text<input class="rounded border px-3 py-2" data-thumbnail-image-field="alt" value="${escapeHtml(image.alt)}" /></label>
			<div class="grid gap-2 rounded border border-[var(--site-color-border-soft)] p-3" data-thumbnail-link>
				<div class="text-sm font-semibold">Thumbnail link</div>
				<label class="grid gap-1 text-sm">Target<select class="rounded border px-3 py-2" data-section-action-field="target_type"><option value="external_url" ${link.target_type !== 'cms_page' ? 'selected' : ''}>External URL</option><option value="cms_page" ${link.target_type === 'cms_page' ? 'selected' : ''}>CMS page</option></select></label>
				<label class="grid gap-1 text-sm">CMS page ID<input class="rounded border px-3 py-2" type="number" data-section-action-field="page_id" value="${escapeHtml(link.page_id)}" /></label>
				<label class="grid gap-1 text-sm">Href<input class="rounded border px-3 py-2" data-section-action-field="href" value="${escapeHtml(link.href)}" placeholder="/gallery" /></label>
			</div>
		</div>`;
	}).join('');
	return `<div class="grid gap-3 rounded border p-3" data-section-thumbnails><div><div class="text-sm font-semibold">Thumbnails</div><p class="text-xs text-[var(--site-color-text-muted)]">Add up to ten linked thumbnails. Empty thumbnail slots will not render publicly.</p></div>${items}</div>`;
}

function editorCard(section: Record<string, any>, registry: Record<string, RegistryEntry>, template: string): HTMLElement {
	const entry = registry[section.type];
	const content = section.content || {};
	const image = content.image || {};
	const libraryLabel = mediaLabel(template);
	const mediaRole = uploadMediaRole(template);
	const collection = uploadCollection(template);
	const card = document.createElement('div');
	card.className = 'grid gap-4 border-t border-[var(--site-color-border-soft)] pt-4 hidden';
	card.dataset.sectionEditorCard = '';
	card.dataset.sectionId = section.id;
	card.dataset.sectionType = section.type;
	card.dataset.sectionLayout = section.layout;
	card.dataset.active = 'false';
	const options = (entry?.layouts || [{ key: section.layout, label: section.layout }])
		.map((layout) => `<option value="${escapeHtml(layout.key)}" ${layout.key === section.layout ? 'selected' : ''}>${escapeHtml(layout.label)}</option>`)
		.join('');
	const header = `<div class="grid gap-2 md:grid-cols-[1fr_14rem] md:items-end"><div><div class="text-sm font-semibold">Edit ${escapeHtml(entry?.label || section.type)}</div><div class="text-xs text-[var(--site-color-text-muted)]">Section ID: ${escapeHtml(section.id)}</div></div><label class="grid gap-1 text-sm">Layout<select class="rounded border px-3 py-2" data-section-layout-select>${options}</select></label></div>`;
	if (section.type === 'contact_intro') {
		card.innerHTML = `${header}<div class="grid gap-4" data-section-editor data-section-id="${escapeHtml(section.id)}" data-section-type="contact_intro"><label class="grid gap-1 text-sm font-medium">Eyebrow<input class="rounded border px-3 py-2" data-section-field="eyebrow" value="${escapeHtml(content.eyebrow)}" /></label><label class="grid gap-1 text-sm font-medium">Heading<input class="rounded border px-3 py-2" data-section-field="heading" value="${escapeHtml(content.heading)}" /></label><label class="grid gap-1 text-sm font-medium">Body<textarea class="rounded border px-3 py-2" rows="4" data-section-field="body">${escapeHtml(content.body)}</textarea></label></div>`;
		return card;
	}
	if (section.type === 'contact_details') {
		card.innerHTML = `${header}<div class="grid gap-4" data-section-editor data-section-id="${escapeHtml(section.id)}" data-section-type="contact_details"><label class="grid gap-1 text-sm font-medium">Email<input class="rounded border px-3 py-2" type="email" data-section-field="email" value="${escapeHtml(content.email)}" /></label><label class="grid gap-1 text-sm font-medium">Phone<input class="rounded border px-3 py-2" data-section-field="phone" value="${escapeHtml(content.phone)}" /></label><label class="grid gap-1 text-sm font-medium">Location<textarea class="rounded border px-3 py-2" rows="3" data-section-field="location">${escapeHtml(content.location)}</textarea></label></div>`;
		return card;
	}
	if (section.type === 'contact_form_block') {
		card.innerHTML = `${header}<div class="grid gap-4" data-section-editor data-section-id="${escapeHtml(section.id)}" data-section-type="contact_form_block"><label class="grid gap-1 text-sm font-medium">Heading<input class="rounded border px-3 py-2" data-section-field="heading" value="${escapeHtml(content.heading)}" /></label><label class="grid gap-1 text-sm font-medium">Body<textarea class="rounded border px-3 py-2" rows="4" data-section-field="body">${escapeHtml(content.body)}</textarea></label><label class="grid gap-1 text-sm font-medium">Submit label<input class="rounded border px-3 py-2" data-section-field="submit_label" value="${escapeHtml(content.submit_label)}" /></label></div>`;
		return card;
	}
	if (section.type === 'rich_text') {
		card.innerHTML = `${header}<div class="grid gap-4" data-section-editor data-section-id="${escapeHtml(section.id)}" data-section-type="rich_text"><label class="grid gap-1 text-sm font-medium">Heading<input class="rounded border px-3 py-2" data-section-field="heading" value="${escapeHtml(content.heading)}" /></label><label class="grid gap-1 text-sm font-medium">Body<textarea class="rounded border px-3 py-2" rows="8" data-section-field="body">${escapeHtml(content.body)}</textarea></label></div>`;
		return card;
	}
	if (section.type === 'content_hero') {
		card.innerHTML = `${header}<div class="grid gap-4" data-section-editor data-section-id="${escapeHtml(section.id)}" data-section-type="content_hero"><label class="grid gap-1 text-sm font-medium">Eyebrow<input class="rounded border px-3 py-2" data-section-field="eyebrow" value="${escapeHtml(content.eyebrow)}" /></label><label class="grid gap-1 text-sm font-medium">Headline<input class="rounded border px-3 py-2" data-section-field="headline" value="${escapeHtml(content.headline)}" /></label><label class="grid gap-1 text-sm font-medium">Body<textarea class="rounded border px-3 py-2" rows="4" data-section-field="body">${escapeHtml(content.body)}</textarea></label>${imageFields(image, libraryLabel, mediaRole, collection, section.type, true)}${actionFields('primary_action', 'Primary action', content.primary_action)}</div>`;
		return card;
	}
	if (section.type === 'image_link_text') {
		card.innerHTML = `${header}<div class="grid gap-4" data-section-editor data-section-id="${escapeHtml(section.id)}" data-section-type="image_link_text"><label class="grid gap-1 text-sm font-medium">Heading<input class="rounded border px-3 py-2" data-section-field="heading" value="${escapeHtml(content.heading)}" /></label><label class="grid gap-1 text-sm font-medium">Body<textarea class="rounded border px-3 py-2" rows="4" data-section-field="body">${escapeHtml(content.body)}</textarea></label>${imageFields(image, libraryLabel, mediaRole, collection, section.type, true)}</div>`;
		return card;
	}
	if (section.type === 'thumbnail_grid') {
		const thumbnails = Array.isArray(content.thumbnails) ? content.thumbnails as Array<Record<string, unknown>> : [];
		const thumbnailShape = ['natural', 'square', 'wide'].includes(String(content.thumbnail_shape)) ? String(content.thumbnail_shape) : 'square';
		const shapeField = `<label class="grid gap-1 text-sm font-medium">Thumbnail shape<select class="rounded border px-3 py-2" data-section-field="thumbnail_shape"><option value="natural" ${thumbnailShape === 'natural' ? 'selected' : ''}>Fit image</option><option value="square" ${thumbnailShape === 'square' ? 'selected' : ''}>Square crop</option><option value="wide" ${thumbnailShape === 'wide' ? 'selected' : ''}>Wide crop</option></select></label>`;
		card.innerHTML = `${header}<div class="grid gap-4" data-section-editor data-section-id="${escapeHtml(section.id)}" data-section-type="thumbnail_grid"><label class="grid gap-1 text-sm font-medium">Heading<input class="rounded border px-3 py-2" data-section-field="heading" value="${escapeHtml(content.heading)}" /></label><label class="grid gap-1 text-sm font-medium">Body<textarea class="rounded border px-3 py-2" rows="3" data-section-field="body">${escapeHtml(content.body)}</textarea></label>${shapeField}${thumbnailFields(thumbnails, libraryLabel, mediaRole, collection, section.type)}</div>`;
		return card;
	}
	card.innerHTML = `${header}<div class="grid gap-4" data-section-editor data-section-id="${escapeHtml(section.id)}" data-section-type="hero"><label class="grid gap-1 text-sm font-medium">Eyebrow<input class="rounded border px-3 py-2" data-section-field="eyebrow" value="${escapeHtml(content.eyebrow)}" /></label><label class="grid gap-1 text-sm font-medium">Headline<input class="rounded border px-3 py-2" data-section-field="headline" value="${escapeHtml(content.headline)}" /></label><label class="grid gap-1 text-sm font-medium">Body<textarea class="rounded border px-3 py-2" rows="4" data-section-field="body">${escapeHtml(content.body)}</textarea></label>${imageFields(image, libraryLabel, mediaRole, collection, section.type, true)}<div class="grid gap-3 md:grid-cols-2">${actionFields('primary_action', 'Primary action', content.primary_action)}${actionFields('secondary_action', 'Secondary action', content.secondary_action)}</div></div>`;
	return card;
}

function sectionItem(section: Record<string, any>, registry: Record<string, RegistryEntry>, template: string): HTMLElement {
	const entry = registry[section.type];
	const item = document.createElement('div');
	item.className = 'grid gap-3 rounded-[var(--site-radius-card)] border border-[var(--site-color-border-soft)] bg-white p-4 text-left transition';
	item.setAttribute('role', 'button');
	item.tabIndex = 0;
	item.dataset.pageSection = '';
	item.dataset.sectionId = section.id;
	item.dataset.sectionType = section.type;
	item.dataset.sectionLayout = section.layout;
	item.dataset.active = 'false';
	item.innerHTML = `<div class="grid gap-2" data-section-summary-panel><div class="flex flex-wrap items-start justify-between gap-3"><div><div class="text-sm font-semibold"><span data-section-number></span>. <span data-section-label>${escapeHtml(entry?.label || section.type)}</span></div><div class="text-xs text-[var(--site-color-text-muted)]" data-section-layout-label>${escapeHtml(layoutLabel(entry, section.layout))}</div></div><div class="flex flex-wrap gap-2"><button type="button" class="rounded border px-2 py-1 text-xs" data-section-move="up">Move up</button><button type="button" class="rounded border px-2 py-1 text-xs" data-section-move="down">Move down</button><button type="button" class="rounded border border-red-200 px-2 py-1 text-xs text-red-700" data-section-delete>Delete</button></div></div><div class="text-sm text-[var(--site-color-text-muted)]" data-section-summary>New section</div><div class="flex flex-wrap gap-2 text-xs text-[var(--site-color-text-muted)]"><span class="rounded-full border border-[var(--site-color-border-soft)] px-2 py-1" data-section-image-status>No image</span><span class="rounded-full border border-[var(--site-color-border-soft)] px-2 py-1" data-section-action-status>No link</span></div></div>`;
	item.appendChild(editorCard(section, registry, template));
	return item;
}

export function initPageSectionsEditor(root: ParentNode | null = document): void {
	root?.querySelectorAll?.('[data-page-sections-editor]').forEach((node) => {
		const editor = node as HTMLElement;
		if (editor.dataset.initialized === 'true') return;
		editor.dataset.initialized = 'true';
		const registry = registryData(editor);
		const template = editor.dataset.sectionTemplate || '';
		const form = editor.closest('form');
		const list = editor.querySelector('[data-page-section-list]') as HTMLElement | null;
		const typeSelect = editor.querySelector('[data-section-type-select]');
		const pickerLayoutSelect = editor.querySelector('[data-section-picker-card] [data-section-layout-select]');
		if (!list) return;

		typeSelect?.addEventListener('change', () => updatePicker(editor));
		pickerLayoutSelect?.addEventListener('change', () => updateLayoutPreview(editor));
		editor.addEventListener('input', () => sync(editor));
		editor.addEventListener('change', () => sync(editor));
		form?.addEventListener('submit', () => sync(editor));

		editor.addEventListener('click', (event) => {
			const target = event.target as HTMLElement | null;
			if (!target) return;
			if (target.closest('[data-add-page-section]')) {
				const entry = registry[selectedPickerType(editor)] || Object.values(registry)[0];
				if (!entry) return;
				const section = { id: sectionId(), type: entry.type, layout: selectedPickerLayout(editor) || entry.defaultLayout, content: entry.defaultContent || {} };
				list.appendChild(sectionItem(section, registry, template));
				(window as any).initImagePathPickers?.(list);
				updateMoveButtons(editor);
				updateThumbnailControls(editor);
				refreshSummaries(editor);
				selectSection(editor, section.id);
				sync(editor);
				return;
			}

			const item = target.closest('[data-page-section]') as HTMLElement | null;
			if (!item) return;
			const id = item.dataset.sectionId || '';
			const thumbnailMove = target.closest('[data-thumbnail-move]') as HTMLElement | null;
			if (thumbnailMove) {
				const thumbnail = thumbnailMove.closest('[data-section-thumbnail-item]') as HTMLElement | null;
				if (!thumbnail) return;
				if (thumbnailMove.dataset.thumbnailMove === 'up') thumbnail.previousElementSibling?.before(thumbnail);
				else thumbnail.nextElementSibling?.after(thumbnail);
				updateThumbnailControls(item);
				refreshSummaries(editor);
				sync(editor);
				return;
			}
			if (target.closest('[data-section-delete]')) {
				const next = item.nextElementSibling || item.previousElementSibling;
				item.remove();
				updateMoveButtons(editor);
				if (next instanceof HTMLElement) selectSection(editor, next.dataset.sectionId || '');
				else setEmptyState(editor);
				sync(editor);
				return;
			}
			const move = target.closest('[data-section-move]') as HTMLElement | null;
			if (move) {
				if (move.dataset.sectionMove === 'up') item.previousElementSibling?.before(item);
				else item.nextElementSibling?.after(item);
				updateMoveButtons(editor);
				refreshSummaries(editor);
				selectSection(editor, id);
				sync(editor);
				return;
			}
			selectSection(editor, id);
		});

		list.addEventListener('keydown', (event) => {
			if (event.key !== 'Enter' && event.key !== ' ') return;
			const target = event.target as HTMLElement | null;
			if (!target || target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
			const item = target.closest('[data-page-section]') as HTMLElement | null;
			if (!item) return;
			event.preventDefault();
			selectSection(editor, item.dataset.sectionId || '');
		});

		updatePicker(editor);
		updateMoveButtons(editor);
		updateThumbnailControls(editor);
		refreshSummaries(editor);
		const first = editor.querySelector('[data-page-section]') as HTMLElement | null;
		if (first) selectSection(editor, first.dataset.sectionId || '');
		else setEmptyState(editor);
		sync(editor);
	});
}
