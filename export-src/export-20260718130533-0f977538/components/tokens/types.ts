export type TokenCssVariableName = `--${string}`;
export type TokenCssVarMap = Record<TokenCssVariableName, string>;

export type ButtonHoverStyle = 'none' | 'underline';

export type SiteColorTokens = {
	background: string;
	backgroundSoft: string;
	surface: string;
	surfaceSoft: string;
	text: string;
	textMuted: string;
	border: string;
	borderSoft: string;
	accent: string;
	accentHover: string;
	accentContrast: string;
	headerBackground: string;
	headerText: string;
	headerBorder: string;
	footerBackground: string;
	footerText: string;
	footerBorder: string;
	success: string;
	warning: string;
	danger: string;
};

export type SiteTypographyTokens = {
	bodyFont: string;
	headingFont: string;
	brandFont: string;
	navFont: string;
	bodySize: string;
	smallSize: string;
	headingLineHeight: string;
	bodyLineHeight: string;
	regularWeight: string;
	mediumWeight: string;
	semiboldWeight: string;
};

export type SiteRadiusTokens = {
	panel: string;
	card: string;
	button: string;
	input: string;
};

export type SiteSpacingTokens = {
	section: string;
	pageGutter: string;
	cardPadding: string;
	fieldGap: string;
	stackGap: string;
	inlineGap: string;
};

export type SiteLayoutTokens = {
	containerWidth: string;
	contentWidth: string;
	formWidth: string;
};

export type SiteButtonTokens = {
	background: string;
	backgroundHover: string;
	text: string;
	textHover: string;
	border: string;
	radius: string;
	paddingX: string;
	paddingY: string;
	hoverStyle: ButtonHoverStyle;
	hoverDecoration: 'none' | 'underline';
	focusRing: string;
};

export type SiteInputTokens = {
	background: string;
	text: string;
	placeholder: string;
	border: string;
	radius: string;
	paddingX: string;
	paddingY: string;
	focusRing: string;
};

export type SiteTokens = {
	colors: SiteColorTokens;
	typography: SiteTypographyTokens;
	radii: SiteRadiusTokens;
	spacing: SiteSpacingTokens;
	layout: SiteLayoutTokens;
	buttons: SiteButtonTokens;
	inputs: SiteInputTokens;
};
