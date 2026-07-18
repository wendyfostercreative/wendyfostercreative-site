import { DEFAULT_SITE_THEME } from '../../../../../../siteConfig/core/theme';
import type { SiteConfig, SiteThemeColors } from '../../../../../../siteConfig/core/types';
import type { OrionSiteSummary } from '../../types';
import {
	SITE_CONFIG_COMPONENTS_CARD_KEY,
	SITE_CONFIG_THEME_CARD_KEY,
	type SiteConfigCard,
} from '../types';
import type { OrionSiteConfigThemeDraft } from './types';

type ThemePalette = {
	base: string;
	hover: string;
	soft: string;
};

const COLOR_PALETTES: Record<string, ThemePalette> = {
	blue: { base: '#1d4ed8', hover: '#1e40af', soft: '#dbeafe' },
	red: { base: '#dc2626', hover: '#b91c1c', soft: '#fee2e2' },
	green: { base: '#15803d', hover: '#166534', soft: '#dcfce7' },
	yellow: { base: '#ca8a04', hover: '#a16207', soft: '#fef9c3' },
	gold: { base: '#b45309', hover: '#92400e', soft: '#fef3c7' },
	pink: { base: '#db2777', hover: '#be185d', soft: '#fce7f3' },
	purple: { base: '#7e22ce', hover: '#6b21a8', soft: '#f3e8ff' },
	orange: { base: '#ea580c', hover: '#c2410c', soft: '#ffedd5' },
	white: { base: '#ffffff', hover: '#f8fafc', soft: '#f1f5f9' },
	'light-gray': { base: '#d1d5db', hover: '#9ca3af', soft: '#f3f4f6' },
	'light-grey': { base: '#d1d5db', hover: '#9ca3af', soft: '#f3f4f6' },
	black: { base: '#111827', hover: '#030712', soft: '#e5e7eb' },
	gray: { base: '#475569', hover: '#334155', soft: '#e2e8f0' },
	grey: { base: '#475569', hover: '#334155', soft: '#e2e8f0' },
};

const COLOR_ALIASES: Record<string, string> = {
	'light gray': 'light-gray',
	'light grey': 'light-grey',
	'very light gray': 'light-gray',
	'very light grey': 'light-grey',
	'pale gray': 'light-gray',
	'pale grey': 'light-grey',
	'soft gray': 'light-gray',
	'soft grey': 'light-grey',
	'cool gray': 'gray',
	'cool grey': 'grey',
	'charcoal': 'black',
	'off white': 'white',
	'off-white': 'white',
};

export function themeDraftFromSiteSummary(
	summary: OrionSiteSummary | null,
): OrionSiteConfigThemeDraft | null {
	if (!summary) return null;
	return themeDraftFromModelInput(summary.model_input);
}

export function isThemeSummary(summary: OrionSiteSummary | null): summary is OrionSiteSummary {
	return Boolean(summary?.model_input && summary.model_input.card_key === SITE_CONFIG_THEME_CARD_KEY);
}

export function themePatchFromSiteSummary(summary: OrionSiteSummary): Partial<SiteConfig> {
	const draft = themeDraftFromSiteSummary(summary);
	if (!draft) return {};

	return {
		theme: {
			colors: colorsFromThemeDraft(draft),
		},
	};
}

export const themeCard: SiteConfigCard = {
	cardKey: SITE_CONFIG_THEME_CARD_KEY,
	nextCardKey: SITE_CONFIG_COMPONENTS_CARD_KEY,
	draftFromSummary: themeDraftFromSiteSummary,
	isSummary: isThemeSummary,
	patchFromSummary: themePatchFromSiteSummary,
};

export function colorsFromThemeDraft(draft: OrionSiteConfigThemeDraft): SiteThemeColors {
	const mode = draft.theme_mode === 'dark' ? 'dark' : 'light';
	const primaryColorName = normalizeThemeColorName(draft.primary_color);
	const primary = paletteForColor(draft.primary_color);
	const accent = draft.accent_color ? paletteForColor(draft.accent_color) : primary;
	const action = draft.accent_color ? accent : primary;

	if (mode === 'dark') {
		const surfaces = darkSurfaceTheme(primaryColorName);
		return {
			page: {
				bg: surfaces.pageBg,
				panel: surfaces.pagePanel,
				text: surfaces.text,
				text_muted: surfaces.textMuted,
				border: accent.base,
			},
			header: {
				bg: surfaces.headerBg,
				text: surfaces.text,
				border: accent.hover,
			},
			footer: {
				bg: surfaces.footerBg,
				text: surfaces.footerText,
				border: accent.base,
			},
			button: {
				bg: action.base,
				bg_hover: action.hover,
				text: '#ffffff',
				text_hover: '#ffffff',
			},
			bg: surfaces.pageBg,
			panel: surfaces.pagePanel,
			text: surfaces.text,
			text_muted: surfaces.textMuted,
			border: accent.base,
			border_soft: accent.hover,
			button_bg: action.base,
			button_bg_hover: action.hover,
			button_text: '#ffffff',
			button_text_hover: '#ffffff',
		};
	}

	const surfaces = lightSurfaceTheme(primaryColorName);
	return {
		page: {
			bg: surfaces.pageBg,
			panel: surfaces.pagePanel,
			text: surfaces.text,
			text_muted: surfaces.textMuted,
			border: accent.base,
		},
		header: {
			bg: surfaces.headerBg,
			text: surfaces.text,
			border: accent.soft,
		},
		footer: {
			bg: surfaces.footerBg,
			text: surfaces.footerText,
			border: accent.soft,
		},
		button: {
			bg: action.base,
			bg_hover: action.hover,
			text: '#ffffff',
			text_hover: '#ffffff',
		},
		bg: surfaces.pageBg,
		panel: surfaces.pagePanel,
		text: surfaces.text,
		text_muted: surfaces.textMuted,
		border: accent.base,
		border_soft: accent.soft,
		button_bg: action.base,
		button_bg_hover: action.hover,
		button_text: '#ffffff',
		button_text_hover: '#ffffff',
	};
}

type SurfaceTheme = {
	pageBg: string;
	pagePanel: string;
	headerBg: string;
	footerBg: string;
	text: string;
	textMuted: string;
	footerText: string;
};

function darkSurfaceTheme(primaryColorName: string): SurfaceTheme {
	if (primaryColorName === 'black') {
		return {
			pageBg: '#000000',
			pagePanel: '#0b0f19',
			headerBg: '#000000',
			footerBg: '#000000',
			text: '#f8fafc',
			textMuted: '#cbd5e1',
			footerText: '#e2e8f0',
		};
	}

	if (primaryColorName === 'gray' || primaryColorName === 'grey') {
		return {
			pageBg: '#111827',
			pagePanel: '#1f2937',
			headerBg: '#0f172a',
			footerBg: '#111827',
			text: '#f8fafc',
			textMuted: '#cbd5e1',
			footerText: '#e2e8f0',
		};
	}

	if (primaryColorName === 'light-gray' || primaryColorName === 'light-grey') {
		return {
			pageBg: '#111827',
			pagePanel: '#1f2937',
			headerBg: '#0f172a',
			footerBg: '#111827',
			text: '#f8fafc',
			textMuted: '#cbd5e1',
			footerText: '#e2e8f0',
		};
	}

	return {
		pageBg: '#0f172a',
		pagePanel: '#111827',
		headerBg: '#020617',
		footerBg: '#111827',
		text: '#f8fafc',
		textMuted: '#cbd5e1',
		footerText: '#e2e8f0',
	};
}

function lightSurfaceTheme(primaryColorName: string): SurfaceTheme {
	if (primaryColorName === 'white') {
		return {
			pageBg: '#ffffff',
			pagePanel: '#f8fafc',
			headerBg: '#ffffff',
			footerBg: '#f1f5f9',
			text: '#0f172a',
			textMuted: '#475569',
			footerText: '#0f172a',
		};
	}

	if (primaryColorName === 'gray' || primaryColorName === 'grey') {
		return {
			pageBg: '#f8fafc',
			pagePanel: '#e2e8f0',
			headerBg: '#f8fafc',
			footerBg: '#e2e8f0',
			text: '#0f172a',
			textMuted: '#475569',
			footerText: '#0f172a',
		};
	}

	if (primaryColorName === 'light-gray' || primaryColorName === 'light-grey') {
		return {
			pageBg: '#ffffff',
			pagePanel: '#f3f4f6',
			headerBg: '#ffffff',
			footerBg: '#f3f4f6',
			text: '#0f172a',
			textMuted: '#475569',
			footerText: '#0f172a',
		};
	}

	return {
		pageBg: '#ffffff',
		pagePanel: '#f8fafc',
		headerBg: '#ffffff',
		footerBg: '#e2e8f0',
		text: '#0f172a',
		textMuted: '#475569',
		footerText: '#0f172a',
	};
}

function paletteForColor(value: string): ThemePalette {
	const normalized = normalizeThemeColorName(value);
	const direct = COLOR_PALETTES[normalized];
	if (direct) return direct;
	if (normalized.startsWith('#')) return { base: normalized, hover: normalized, soft: '#e2e8f0' };
	return COLOR_PALETTES.blue;
}

function normalizeThemeColorName(value: string): string {
	const normalized = value.trim().toLowerCase().replace(/\s+/g, ' ');
	return COLOR_ALIASES[normalized] ?? normalized;
}

function themeDraftFromModelInput(value: unknown): OrionSiteConfigThemeDraft | null {
	if (!isRecord(value)) return null;
	const cardSummary = value.card_summary;
	if (!isRecord(cardSummary)) return null;

	return {
		primary_color: stringValue(cardSummary.primary_color),
		accent_color: stringValue(cardSummary.accent_color),
		theme_mode: themeModeValue(cardSummary.theme_mode),
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

function themeModeValue(value: unknown): 'light' | 'dark' | '' {
	return value === 'light' || value === 'dark' ? value : '';
}
