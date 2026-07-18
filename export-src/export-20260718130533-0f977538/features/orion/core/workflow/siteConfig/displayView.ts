import {
	DEFAULT_SITE_FONT_KEY,
	resolveSiteFontKey,
	resolveSiteTheme,
} from '../../../../siteConfig/core/theme';
import type { ResolvedSiteTheme, SiteConfig, SiteTheme } from '../../../../siteConfig/core/types';
import { colorsFromThemeDraft } from './cards/theme/definition';
import type { OrionSiteProposal, OrionSiteSummary } from './types';

export type SiteConfigDisplay = {
	site: SiteConfig;
	resolvedTheme: ResolvedSiteTheme;
	themeMode: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function baseSiteConfig(saved?: SiteConfig | null): SiteConfig {
	return saved ?? {
		id: 1,
		identity: {
			site_name: 'My Site',
			logo_path: null,
			logo_alt_text: null,
		},
		brand: {
			site_name_font: null,
		},
		theme: {},
		seo_defaults: {
			title: null,
			description: null,
		},
	};
}

function copyTheme(theme: SiteTheme | null | undefined): SiteTheme {
	return {
		...(theme ?? {}),
		fonts: theme?.fonts ? { ...theme.fonts } : undefined,
		colors: theme?.colors
			? {
				...theme.colors,
				page: theme.colors.page ? { ...theme.colors.page } : undefined,
				header: theme.colors.header ? { ...theme.colors.header } : undefined,
				footer: theme.colors.footer ? { ...theme.colors.footer } : undefined,
				button: theme.colors.button ? { ...theme.colors.button } : undefined,
			}
			: undefined,
		layout: theme?.layout ? { ...theme.layout } : undefined,
		radius: theme?.radius ? { ...theme.radius } : undefined,
	};
}

function currentSummaryCardKey(summary: OrionSiteSummary): string | null {
	return typeof summary.model_input?.card_key === 'string' ? summary.model_input.card_key : null;
}

function hasText(value: string): boolean {
	return Boolean(value.trim());
}

function hasAnyText(values: string[]): boolean {
	return values.some((value) => hasText(value));
}

function valueOrNull(value: string): string | null {
	const trimmed = value.trim();
	return trimmed || null;
}

function explicitThemeColorsFromSummary(summary: OrionSiteSummary): SiteTheme['colors'] | null {
	const page = {
		bg: valueOrNull(summary.page_bg),
		panel: valueOrNull(summary.page_panel),
		text: valueOrNull(summary.page_text),
		text_muted: valueOrNull(summary.page_text_muted),
		border: valueOrNull(summary.page_border),
	};
	const header = {
		bg: valueOrNull(summary.header_bg),
		text: valueOrNull(summary.header_text),
		border: valueOrNull(summary.header_border),
	};
	const footer = {
		bg: valueOrNull(summary.footer_bg),
		text: valueOrNull(summary.footer_text),
		border: valueOrNull(summary.footer_border),
	};
	const button = {
		bg: valueOrNull(summary.button_bg),
		bg_hover: valueOrNull(summary.button_bg_hover),
		text: valueOrNull(summary.button_text),
		text_hover: valueOrNull(summary.button_text_hover),
	};

	const hasPage = Object.values(page).some(Boolean);
	const hasHeader = Object.values(header).some(Boolean);
	const hasFooter = Object.values(footer).some(Boolean);
	const hasButton = Object.values(button).some(Boolean);

	if (!hasPage && !hasHeader && !hasFooter && !hasButton) return null;

	return {
		page: hasPage ? page : null,
		header: hasHeader ? header : null,
		footer: hasFooter ? footer : null,
		button: hasButton ? button : null,
		bg: page.bg,
		panel: page.panel,
		text: page.text,
		text_muted: page.text_muted,
		border: page.border,
		button_bg: button.bg,
		button_bg_hover: button.bg_hover,
		button_text: button.text,
		button_text_hover: button.text_hover,
	};
}

function summaryThemeMode(summary: OrionSiteSummary): string {
	return summary.theme_mode.trim();
}

function themeModeFromProposal(proposal: OrionSiteProposal): string {
	const summary = proposal.metadata?.orion_summary;
	if (!isRecord(summary)) return '';
	return typeof summary.theme_mode === 'string' ? summary.theme_mode.trim() : '';
}

function mergedThemeFromProposal(proposal: OrionSiteProposal, base: SiteConfig): SiteTheme {
	const theme = copyTheme(base.theme);
	const proposalTheme = isRecord(proposal.theme) ? (proposal.theme as SiteTheme) : {};
	const fonts = proposalTheme.fonts && isRecord(proposalTheme.fonts) ? proposalTheme.fonts : null;
	const colors = proposalTheme.colors && isRecord(proposalTheme.colors) ? proposalTheme.colors : null;
	const layout = proposalTheme.layout && isRecord(proposalTheme.layout) ? proposalTheme.layout : null;
	const radius = proposalTheme.radius && isRecord(proposalTheme.radius) ? proposalTheme.radius : null;

	const resolvedPrimaryFont =
		resolveSiteFontKey(proposal.primary_font ?? proposalTheme.primary_font ?? '') ??
		resolveSiteFontKey(theme.primary_font ?? '') ??
		DEFAULT_SITE_FONT_KEY;
	const resolvedBrandFont =
		resolveSiteFontKey(proposal.site_name_font ?? '') ??
		(fonts && typeof fonts.brand === 'string' ? resolveSiteFontKey(fonts.brand) : null) ??
		(resolveSiteFontKey(theme.fonts?.brand ?? '') ?? null);
	const resolvedNavFont =
		(fonts && typeof fonts.nav === 'string' ? resolveSiteFontKey(fonts.nav) : null) ??
		(resolveSiteFontKey(theme.fonts?.nav ?? '') ?? null);

	return {
		...theme,
		...proposalTheme,
		fonts: fonts
			? {
				...(theme.fonts ?? {}),
				...fonts,
				primary: resolvedPrimaryFont,
				brand: resolvedBrandFont,
				nav: resolvedNavFont,
			}
			: {
				...(theme.fonts ?? {}),
				primary: resolvedPrimaryFont,
				brand: resolvedBrandFont,
				nav: resolvedNavFont,
			},
		primary_font: resolvedPrimaryFont,
		colors: colors
			? {
				...(theme.colors ?? {}),
				...colors,
				page: colors.page ? { ...(theme.colors?.page ?? {}), ...colors.page } : theme.colors?.page,
				header: colors.header ? { ...(theme.colors?.header ?? {}), ...colors.header } : theme.colors?.header,
				footer: colors.footer ? { ...(theme.colors?.footer ?? {}), ...colors.footer } : theme.colors?.footer,
				button: colors.button ? { ...(theme.colors?.button ?? {}), ...colors.button } : theme.colors?.button,
			}
			: theme.colors,
		layout: layout ? { ...(theme.layout ?? {}), ...layout } : theme.layout,
		radius: radius ? { ...(theme.radius ?? {}), ...radius } : theme.radius,
	};
}

function mergedThemeFromSummary(summary: OrionSiteSummary, base: SiteConfig): SiteTheme {
	const cardKey = currentSummaryCardKey(summary);
	const theme = copyTheme(base.theme);

	if (cardKey === 'typography' || hasAnyText([summary.primary_font, summary.brand_font, summary.nav_font])) {
		const resolvedPrimaryFont =
			resolveSiteFontKey(summary.primary_font.trim() || summary.font_preference.trim()) ??
			resolveSiteFontKey(theme.fonts?.primary ?? theme.primary_font ?? '') ??
			DEFAULT_SITE_FONT_KEY;
		const resolvedBrandFont =
			cardKey === 'typography'
				? resolveSiteFontKey(summary.brand_font.trim() || summary.site_name_font.trim()) || null
				: resolveSiteFontKey(summary.brand_font.trim() || summary.site_name_font.trim()) ??
					(resolveSiteFontKey(theme.fonts?.brand ?? '') ?? null);
		const resolvedNavFont =
			cardKey === 'typography'
				? resolveSiteFontKey(summary.nav_font.trim()) || null
				: resolveSiteFontKey(summary.nav_font.trim()) ??
					(resolveSiteFontKey(theme.fonts?.nav ?? '') ?? null);
		theme.fonts = {
			...(theme.fonts ?? {}),
			primary: resolvedPrimaryFont,
			brand: resolvedBrandFont,
			nav: resolvedNavFont,
		};
		theme.primary_font = theme.fonts.primary ?? null;
	}

	if (
		cardKey === 'theme' ||
		hasAnyText([
			summary.primary_color,
			summary.accent_color,
			summary.theme_mode,
			summary.page_bg,
			summary.header_bg,
			summary.footer_bg,
			summary.button_bg,
		])
	) {
		const generatedColors = {
			...(theme.colors ?? {}),
			...colorsFromThemeDraft({
				primary_color: summary.primary_color,
				accent_color: summary.accent_color,
				theme_mode: summary.theme_mode === 'dark' ? 'dark' : summary.theme_mode === 'light' ? 'light' : '',
			}),
		};
		const explicitColors = explicitThemeColorsFromSummary(summary);
		theme.colors = explicitColors
			? {
				...generatedColors,
				...explicitColors,
				page: explicitColors.page ? { ...(generatedColors.page ?? {}), ...explicitColors.page } : generatedColors.page,
				header: explicitColors.header
					? { ...(generatedColors.header ?? {}), ...explicitColors.header }
					: generatedColors.header,
				footer: explicitColors.footer
					? { ...(generatedColors.footer ?? {}), ...explicitColors.footer }
					: generatedColors.footer,
				button: explicitColors.button
					? { ...(generatedColors.button ?? {}), ...explicitColors.button }
					: generatedColors.button,
			}
			: generatedColors;
	}

	if (
		cardKey === 'components' ||
		hasAnyText([
			summary.container_width,
			summary.content_width,
			summary.card_radius,
			summary.button_radius,
			summary.input_radius,
		])
	) {
		theme.layout = {
			container_width: summary.container_width.trim() || null,
			content_width: summary.content_width.trim() || null,
		};
		theme.radius = {
			card: summary.card_radius.trim() || null,
			button: summary.button_radius.trim() || null,
			input: summary.input_radius.trim() || null,
		};
	}

	return theme;
}

export function siteConfigDisplayFromProposal(
	proposal: OrionSiteProposal,
	saved?: SiteConfig | null,
): SiteConfigDisplay {
	const base = baseSiteConfig(saved);
	const theme = mergedThemeFromProposal(proposal, base);
	const brandFont = theme.fonts?.brand ?? proposal.site_name_font ?? base.brand.site_name_font ?? null;
	const site: SiteConfig = {
		...base,
		identity: {
			...base.identity,
			site_name: proposal.site_name || base.identity.site_name,
			logo_path: proposal.logo_path ?? base.identity.logo_path,
			logo_alt_text: proposal.logo_alt_text ?? base.identity.logo_alt_text,
		},
		brand: {
			...base.brand,
			site_name_font: brandFont,
		},
		theme,
		seo_defaults: {
			...base.seo_defaults,
			title: proposal.default_seo_title ?? base.seo_defaults.title,
			description: proposal.default_seo_description ?? base.seo_defaults.description,
		},
	};

	return {
		site,
		resolvedTheme: resolveSiteTheme(site.theme),
		themeMode: themeModeFromProposal(proposal),
	};
}

export function siteConfigDisplayFromSummary(
	summary: OrionSiteSummary,
	saved: SiteConfig,
): SiteConfigDisplay {
	const base = baseSiteConfig(saved);
	const cardKey = currentSummaryCardKey(summary);
	const theme = mergedThemeFromSummary(summary, base);
	const site: SiteConfig = {
		...base,
		identity: {
			...base.identity,
			site_name:
				cardKey === 'branding'
					? summary.site_name.trim()
					: summary.site_name.trim() || base.identity.site_name,
			logo_path:
				cardKey === 'branding' || hasText(summary.logo_path)
					? summary.logo_path.trim() || null
					: base.identity.logo_path,
			logo_alt_text:
				cardKey === 'branding' || hasText(summary.logo_alt_text)
					? summary.logo_alt_text.trim() || null
					: base.identity.logo_alt_text,
		},
		brand: {
			...base.brand,
			site_name_font:
				cardKey === 'typography' || hasText(summary.brand_font) || hasText(summary.site_name_font)
					? resolveSiteFontKey(summary.brand_font.trim() || summary.site_name_font.trim()) || null
					: base.brand.site_name_font,
		},
		theme,
		seo_defaults: {
			...base.seo_defaults,
			title:
				cardKey === 'seo' || hasText(summary.seo_title)
					? summary.seo_title.trim() || null
					: base.seo_defaults.title,
			description:
				cardKey === 'seo' || hasText(summary.seo_description)
					? summary.seo_description.trim() || null
					: base.seo_defaults.description,
		},
	};

	return {
		site,
		resolvedTheme: resolveSiteTheme(site.theme),
		themeMode: summaryThemeMode(summary),
	};
}
