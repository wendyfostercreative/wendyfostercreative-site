import type { ResolvedSiteTheme } from '../../features/siteConfig/core/types';
import { DEFAULT_SITE_TOKENS } from './defaults';
import type { SiteTokens } from './types';

function softSurface(panel: string): string {
	return `color-mix(in srgb, ${panel} 42%, transparent)`;
}

export function siteThemeToTokens(theme: ResolvedSiteTheme): SiteTokens {
	const surfaceSoft = softSurface(theme.colors.page.panel);
	return {
		colors: {
			...DEFAULT_SITE_TOKENS.colors,
			background: theme.colors.page.bg,
			backgroundSoft: surfaceSoft,
			surface: theme.colors.page.panel,
			surfaceSoft,
			text: theme.colors.page.text,
			textMuted: theme.colors.page.text_muted,
			border: theme.colors.page.border,
			borderSoft: theme.colors.header.border || theme.colors.footer.border || theme.colors.page.border,
			accent: theme.colors.button.bg,
			accentHover: theme.colors.button.bg_hover,
			accentContrast: theme.colors.button.text,
			headerBackground: theme.colors.header.bg,
			headerText: theme.colors.header.text,
			headerBorder: theme.colors.header.border,
			footerBackground: theme.colors.footer.bg,
			footerText: theme.colors.footer.text,
			footerBorder: theme.colors.footer.border,
		},
		typography: {
			...DEFAULT_SITE_TOKENS.typography,
			bodyFont: theme.fonts.primary,
			headingFont: theme.fonts.primary,
			brandFont: theme.fonts.brand,
			navFont: theme.fonts.nav,
		},
		radii: {
			...DEFAULT_SITE_TOKENS.radii,
			panel: theme.radius.card,
			card: theme.radius.card,
			button: theme.radius.button,
			input: theme.radius.input,
		},
		spacing: DEFAULT_SITE_TOKENS.spacing,
		layout: {
			...DEFAULT_SITE_TOKENS.layout,
			containerWidth: theme.layout.container_width,
			contentWidth: theme.layout.content_width,
		},
		buttons: {
			...DEFAULT_SITE_TOKENS.buttons,
			background: theme.colors.button.bg,
			backgroundHover: theme.colors.button.bg_hover,
			text: theme.colors.button.text,
			textHover: theme.colors.button.text_hover,
			border: theme.colors.button.bg,
			radius: theme.radius.button,
			hoverStyle: 'underline',
			hoverDecoration: 'underline',
		},
		inputs: {
			...DEFAULT_SITE_TOKENS.inputs,
			radius: theme.radius.input,
		},
	};
}
