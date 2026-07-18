import type { FooterSettings } from '../core/types';
import {
	footerBorderThicknessToCssValue,
	footerLinkGapToCssValue,
	footerLogoHeightToCssValue,
} from '../core/presets';

function asNonEmptyString(v: unknown): string | undefined {
	if (typeof v !== 'string') return undefined;
	const s = v.trim();
	return s.length ? s : undefined;
}

export type FooterStyleSet = {
	footerStyle: Record<string, string | undefined | null>;
	containerStyle: Record<string, string | undefined | null>;
	brandStyle: Record<string, string | undefined | null>;
	logoStyle: Record<string, string | undefined | null>;
	linkListStyle: Record<string, string | undefined | null>;
	linkStyle: Record<string, string | undefined | null>;
};

function resolveContainerMaxWidth(content_width: FooterSettings['content_width'] | undefined): string {
	if (content_width === 'full') return '100%';
	if (content_width === 'wide') return '90rem';
	return '72rem';
}

function resolveContainerPadding(content_width: FooterSettings['content_width'] | undefined): string {
	if (content_width === 'full') return '2rem 1.5rem';
	return '2rem 1rem';
}

export function deriveFooterStyles(settings: FooterSettings | null): FooterStyleSet {
	const backgroundColor = asNonEmptyString(settings?.background_color) ?? 'var(--site-color-footer-bg)';
	const textColor = asNonEmptyString(settings?.text_color) ?? 'var(--site-color-footer-text)';
	const borderColor = asNonEmptyString(settings?.border_color) ?? 'var(--site-color-footer-border)';
	const borderThickness = footerBorderThicknessToCssValue(settings?.border_thickness);
	const borderTop =
		settings?.show_top_border && borderThickness !== '0px'
			? `${borderThickness} solid ${borderColor}`
			: undefined;

	return {
		footerStyle: {
			'background-color': backgroundColor,
			color: textColor,
			'border-top': borderTop,
			width: '100%',
		},

		containerStyle: {
			'max-width': resolveContainerMaxWidth(settings?.content_width),
			padding: resolveContainerPadding(settings?.content_width),
			width: '100%',
			margin: '0 auto',
		},

		brandStyle: {
			color: textColor,
		},

		logoStyle: {
			'max-height': footerLogoHeightToCssValue(settings?.logo_max_height),
			height: 'auto',
			width: 'auto',
		},

		linkListStyle: {
			display: 'flex',
			gap: footerLinkGapToCssValue(settings?.link_layout),
			margin: '0',
			padding: '0',
			'list-style': 'none',
		},

		linkStyle: {
			color: textColor,
			'text-decoration': 'none',
		},
	};
}
