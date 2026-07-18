import type { OrionSiteSummary } from '../../../../orion/core/workflow/siteConfig';
import type { SiteConfig } from '../../../core/types';

export type DisplayLabels = {
	savedStatus: string;
	previewStatus: string;
	stagedStatus: string;
	goBack: string;
	yes: string;
	no: string;
	defaultValue: string;
};

export type SavedDisplay = {
	site: SiteConfig;
	resolvedTheme: ReturnType<typeof import('../../../core/theme').resolveSiteTheme>;
};

export type BrandingElements = {
	brandingApplyButton: HTMLButtonElement | null;
	siteNameInput: HTMLInputElement | null;
	logoPathInput: HTMLInputElement | null;
	logoAltTextInput: HTMLInputElement | null;
};

export type DisplayElements = BrandingElements & {
	typographyApplyButton: HTMLButtonElement | null;
	themeApplyButton: HTMLButtonElement | null;
	componentsApplyButton: HTMLButtonElement | null;
	statusEl: HTMLElement | null;
	summaryValueEls: HTMLElement[];
	formEl: HTMLFormElement | null;
	saveButton: HTMLButtonElement | null;
	primaryFontInput: HTMLSelectElement | null;
	brandFontInput: HTMLSelectElement | null;
	navFontInput: HTMLSelectElement | null;
	seoTitleInput: HTMLInputElement | null;
	seoDescriptionInput: HTMLTextAreaElement | null;
};

export type SiteConfigDisplayRuntime = {
	root: HTMLElement;
	savedSite: SiteConfig;
	savedDisplay: SavedDisplay;
	labels: DisplayLabels;
	elements: DisplayElements;
	render: () => void;
};

export type SiteConfigSummary = OrionSiteSummary;
