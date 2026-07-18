import { ORION_STATE_CHANGED_EVENT, loadOrionState } from '../../../../orion/core/storage';
import {
	getStagedSiteConfigDisplay,
	siteConfigDisplayFromProposal,
	siteConfigDisplayFromSummary,
	type OrionSiteProposal,
} from '../../../../orion/core/workflow/siteConfig';
import {
	DEFAULT_SITE_FONT_KEY,
	resolveSiteFontKey,
	resolveSiteTheme,
	siteFontLabelForValue,
	siteThemeStyleVars,
} from '../../../core/theme';
import {
	SITE_THEME_COLOR_KEYS,
	SITE_THEME_LAYOUT_KEYS,
	SITE_THEME_RADIUS_KEYS,
} from '../../forms/themeFields';
import type {
	DisplayElements,
	DisplayLabels,
	SavedDisplay,
	SiteConfigDisplayRuntime,
	SiteConfigSummary,
} from './types';
import type { SiteConfig } from '../../../core/types';

const SITE_CONFIG_CARD_SELECTORS: Record<string, string> = {
	branding: '.site-config-branding-card',
	typography: '.site-config-typography-card',
	theme: '.site-config-theme-card',
	components: '.site-config-components-card',
	seo: '.site-config-seo-card',
};

export const SITE_CONFIG_CARD_FOCUS_OFFSET_PX = 96;

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isSiteConfigSummary(value: unknown): value is SiteConfigSummary {
	return isRecord(value) && typeof value.site_name === 'string' && Array.isArray(value.missing_fields);
}

export function emptySiteConfigSummary(): SiteConfigSummary {
	return {
		site_name: 'My Site',
		short_description: '',
		logo_preference: '',
		logo_path: '',
		logo_alt_text: '',
		site_name_font: '',
		brand_font: '',
		style_words: [],
		color_preferences: [],
		font_preference: '',
		primary_font: '',
		nav_font: '',
		primary_color: '',
		accent_color: '',
		theme_mode: '',
		page_bg: '',
		page_panel: '',
		page_text: '',
		page_text_muted: '',
		page_border: '',
		header_bg: '',
		header_text: '',
		header_border: '',
		footer_bg: '',
		footer_text: '',
		footer_border: '',
		button_bg: '',
		button_bg_hover: '',
		button_text: '',
		button_text_hover: '',
		corner_style: 'soft',
		container_width: '',
		content_width: '',
		card_radius: '',
		button_radius: '',
		input_radius: '',
		seo_title: '',
		seo_description: '',
		missing_fields: [],
	};
}

export function committedSiteConfigSummary(
	summary: unknown,
): SiteConfigSummary {
	return isSiteConfigSummary(summary) ? summary : emptySiteConfigSummary();
}

export function siteConfigSummaryFromSite(site: SiteConfig): SiteConfigSummary {
	const identity = isRecord(site.identity) ? site.identity : {};
	const brand = isRecord(site.brand) ? site.brand : {};
	const theme = isRecord(site.theme) ? site.theme : {};
	const themeFonts = isRecord(theme.fonts) ? theme.fonts : {};
	const seoDefaults = isRecord(site.seo_defaults) ? site.seo_defaults : {};
	const resolvedTheme = resolveSiteTheme(theme);
	return {
		...emptySiteConfigSummary(),
		site_name: typeof identity.site_name === 'string' && identity.site_name.trim() ? identity.site_name : 'My Site',
		logo_path: typeof identity.logo_path === 'string' ? identity.logo_path.trim() : '',
		logo_alt_text: typeof identity.logo_alt_text === 'string' ? identity.logo_alt_text.trim() : '',
		site_name_font: typeof brand.site_name_font === 'string' ? brand.site_name_font.trim() : '',
		brand_font:
			(typeof themeFonts.brand === 'string' ? themeFonts.brand.trim() : '') ||
			(typeof brand.site_name_font === 'string' ? brand.site_name_font.trim() : ''),
		font_preference:
			(typeof theme.primary_font === 'string' ? theme.primary_font.trim() : '') ||
			(typeof themeFonts.primary === 'string' ? themeFonts.primary.trim() : ''),
		primary_font:
			(typeof themeFonts.primary === 'string' ? themeFonts.primary.trim() : '') ||
			(typeof theme.primary_font === 'string' ? theme.primary_font.trim() : ''),
		nav_font: typeof themeFonts.nav === 'string' ? themeFonts.nav.trim() : '',
		page_bg: resolvedTheme.colors.page.bg,
		page_panel: resolvedTheme.colors.page.panel,
		page_text: resolvedTheme.colors.page.text,
		page_text_muted: resolvedTheme.colors.page.text_muted,
		page_border: resolvedTheme.colors.page.border,
		header_bg: resolvedTheme.colors.header.bg,
		header_text: resolvedTheme.colors.header.text,
		header_border: resolvedTheme.colors.header.border,
		footer_bg: resolvedTheme.colors.footer.bg,
		footer_text: resolvedTheme.colors.footer.text,
		footer_border: resolvedTheme.colors.footer.border,
		button_bg: resolvedTheme.colors.button.bg,
		button_bg_hover: resolvedTheme.colors.button.bg_hover,
		button_text: resolvedTheme.colors.button.text,
		button_text_hover: resolvedTheme.colors.button.text_hover,
		container_width: resolvedTheme.layout.container_width,
		content_width: resolvedTheme.layout.content_width,
		card_radius: resolvedTheme.radius.card,
		button_radius: resolvedTheme.radius.button,
		input_radius: resolvedTheme.radius.input,
		seo_title: typeof seoDefaults.title === 'string' ? seoDefaults.title.trim() : '',
		seo_description: typeof seoDefaults.description === 'string' ? seoDefaults.description.trim() : '',
	};
}

export function isSiteConfigProposal(value: unknown): value is OrionSiteProposal {
	return isRecord(value) && typeof value.site_name === 'string' && 'metadata' in value;
}

export function setInputValue(
	element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null,
	value: string,
): void {
	if (!element) return;
	element.value = value;
}

export function setColorFieldValue(element: HTMLInputElement | null, value: string): void {
	if (!element) return;
	element.value = value;

	const wrapper = element.closest<HTMLElement>('[data-admin-color-field]');
	const picker = wrapper?.querySelector<HTMLInputElement>('[data-admin-color-picker]');
	if (picker && /^#[0-9a-fA-F]{6}$/.test(value.trim())) {
		picker.value = value.trim().toLowerCase();
	}
}

export function setTextValue(element: HTMLElement | null, value: string): void {
	if (!element) return;
	element.textContent = value;
}

export function primaryFontValue(value: string | null | undefined): string {
	return resolveSiteFontKey(value) ?? DEFAULT_SITE_FONT_KEY;
}

export function optionalFontValue(value: string | null | undefined): string {
	return resolveSiteFontKey(value) ?? '';
}

export function applyThemeVars(themeVars: string): void {
	const root = document.documentElement;
	for (const part of themeVars.split(';')) {
		const trimmed = part.trim();
		if (!trimmed) continue;
		const separator = trimmed.indexOf(':');
		if (separator === -1) continue;
		const key = trimmed.slice(0, separator).trim();
		const value = trimmed.slice(separator + 1).trim();
		root.style.setProperty(key, value);
	}
}

export function updateBrandingPreview(siteName: string, logoPath: string, logoAltText: string): void {
	const resolvedSiteName = siteName.trim() || 'My Site';
	for (const element of document.querySelectorAll<HTMLElement>('[data-site-brand-name]')) {
		element.textContent = resolvedSiteName;
	}

	for (const element of document.querySelectorAll<HTMLImageElement>('[data-site-brand-logo]')) {
		const nextLogoPath = logoPath.trim();
		if (!nextLogoPath) continue;
		element.src = nextLogoPath;
		element.alt = logoAltText.trim() || resolvedSiteName;
	}
}

export function summaryValueMap(site: SiteConfig, labels: DisplayLabels): Record<string, string> {
	const fonts = site.theme.fonts ?? {};
	return {
		site_name: site.identity.site_name || 'My Site',
		logo_configured: site.identity.logo_path?.trim() ? labels.yes : labels.no,
		body_font: siteFontLabelForValue(fonts.primary?.trim() || site.theme.primary_font?.trim(), labels.defaultValue),
		brand_font: siteFontLabelForValue(fonts.brand?.trim() || site.brand.site_name_font?.trim(), labels.defaultValue),
		nav_font: siteFontLabelForValue(fonts.nav?.trim(), labels.defaultValue),
		theme_configured: site.theme ? labels.yes : labels.no,
	};
}

export function collectDisplayElements(root: HTMLElement): DisplayElements {
	return {
		statusEl: root.querySelector('[data-site-config-display-status]'),
		summaryValueEls: Array.from(root.querySelectorAll<HTMLElement>('[data-site-config-summary-value]')),
		formEl: root.querySelector('form'),
		saveButton: root.querySelector('form button[type="submit"]'),
		brandingApplyButton: root.querySelector('.site-config-branding-apply button'),
		typographyApplyButton: root.querySelector('.site-config-typography-apply button'),
		themeApplyButton: root.querySelector('.site-config-theme-apply button'),
		componentsApplyButton: root.querySelector('.site-config-components-apply button'),
		siteNameInput: root.querySelector('#site_name'),
		logoPathInput: root.querySelector('#logo_path'),
		logoAltTextInput: root.querySelector('#logo_alt_text'),
		primaryFontInput: root.querySelector('#primary_font'),
		brandFontInput: root.querySelector('#brand_font'),
		navFontInput: root.querySelector('#nav_font'),
		seoTitleInput: root.querySelector('#default_seo_title'),
		seoDescriptionInput: root.querySelector('#default_seo_description'),
	};
}

export function scrollToSiteConfigCard(root: HTMLElement, cardKey: string): void {
	const selector = SITE_CONFIG_CARD_SELECTORS[cardKey];
	if (!selector) return;
	const card = root.querySelector<HTMLElement>(selector);
	if (!card) return;

	const targetTop = Math.max(window.scrollY + card.getBoundingClientRect().top - SITE_CONFIG_CARD_FOCUS_OFFSET_PX, 0);
	window.scrollTo({
		top: targetTop,
		behavior: 'smooth',
	});
}

export function renderDisplay(runtime: SiteConfigDisplayRuntime): void {
	const { root, savedSite, savedDisplay, labels, elements } = runtime;
	const workflow = loadOrionState().workflowsByPath['/admin/site'] ?? null;
	const staged = getStagedSiteConfigDisplay(workflow, savedSite);
	const formDisplay = staged?.display ?? savedDisplay;
	const committedDisplay =
		workflow?.domain === 'site_config' && isSiteConfigSummary(workflow.draftSummary)
			? siteConfigDisplayFromSummary(workflow.draftSummary, savedSite)
			: workflow?.domain === 'site_config' && isSiteConfigProposal(workflow.draftProposal)
				? siteConfigDisplayFromProposal(workflow.draftProposal, savedSite)
				: savedDisplay;
	applyThemeVars(siteThemeStyleVars(committedDisplay.resolvedTheme));

	if (elements.statusEl) {
		if (staged) {
			elements.statusEl.hidden = false;
			elements.statusEl.textContent =
				staged.source === 'preview_proposal' || staged.source === 'preview_summary'
					? labels.previewStatus
					: labels.stagedStatus;
		} else {
			elements.statusEl.textContent = labels.savedStatus;
			elements.statusEl.hidden = !labels.savedStatus;
		}
	}

	if (elements.saveButton) {
		elements.saveButton.disabled = false;
		elements.saveButton.classList.remove('cursor-not-allowed');
		elements.saveButton.classList.remove('opacity-60');
	}

	setInputValue(elements.siteNameInput, formDisplay.site.identity.site_name);
	setInputValue(elements.logoPathInput, formDisplay.site.identity.logo_path ?? '');
	setInputValue(elements.logoAltTextInput, formDisplay.site.identity.logo_alt_text ?? '');
	updateBrandingPreview(
		committedDisplay.site.identity.site_name,
		committedDisplay.site.identity.logo_path ?? '',
		committedDisplay.site.identity.logo_alt_text ?? '',
	);
	setInputValue(
		elements.primaryFontInput,
		primaryFontValue(formDisplay.site.theme.fonts?.primary ?? formDisplay.site.theme.primary_font ?? ''),
	);
	setInputValue(
		elements.brandFontInput,
		optionalFontValue(formDisplay.site.theme.fonts?.brand ?? formDisplay.site.brand.site_name_font ?? ''),
	);
	setInputValue(elements.navFontInput, optionalFontValue(formDisplay.site.theme.fonts?.nav ?? ''));
	setInputValue(elements.seoTitleInput, formDisplay.site.seo_defaults.title ?? '');
	setInputValue(elements.seoDescriptionInput, formDisplay.site.seo_defaults.description ?? '');

	for (const key of SITE_THEME_COLOR_KEYS) {
		const input = root.querySelector(`#theme_colors_${key}`) as HTMLInputElement | null;
		switch (key) {
			case 'page_bg':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.page.bg);
				break;
			case 'page_panel':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.page.panel);
				break;
			case 'page_text':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.page.text);
				break;
			case 'page_text_muted':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.page.text_muted);
				break;
			case 'page_border':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.page.border);
				break;
			case 'header_bg':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.header.bg);
				break;
			case 'header_text':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.header.text);
				break;
			case 'header_border':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.header.border);
				break;
			case 'footer_bg':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.footer.bg);
				break;
			case 'footer_text':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.footer.text);
				break;
			case 'footer_border':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.footer.border);
				break;
			case 'button_bg':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.button.bg);
				break;
			case 'button_bg_hover':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.button.bg_hover);
				break;
			case 'button_text':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.button.text);
				break;
			case 'button_text_hover':
				setColorFieldValue(input, formDisplay.resolvedTheme.colors.button.text_hover);
				break;
		}
	}

	for (const key of SITE_THEME_LAYOUT_KEYS) {
		const input = root.querySelector(`#theme_layout_${key}`) as HTMLInputElement | null;
		setInputValue(input, formDisplay.resolvedTheme.layout[key] ?? '');
	}

	for (const key of SITE_THEME_RADIUS_KEYS) {
		const input = root.querySelector(`#theme_radius_${key}`) as HTMLInputElement | null;
		setInputValue(input, formDisplay.resolvedTheme.radius[key] ?? '');
	}

	const summaryValues = summaryValueMap(committedDisplay.site, labels);
	for (const element of elements.summaryValueEls) {
		const key = element.dataset.siteConfigSummaryValue;
		if (!key) continue;
		setTextValue(element, summaryValues[key] ?? '');
	}
}

export function bindRenderListeners(runtime: SiteConfigDisplayRuntime): void {
	const { elements, labels, savedSite, render, root } = runtime;
	window.addEventListener(ORION_STATE_CHANGED_EVENT, render);
	window.addEventListener('storage', render);
	window.addEventListener('focus', render);
	window.addEventListener('orion:site-config-focus-card', (event) => {
		const cardKey = (event as CustomEvent<{ cardKey?: string }>).detail?.cardKey;
		if (!cardKey) return;
		scrollToSiteConfigCard(root, cardKey);
	});
}
