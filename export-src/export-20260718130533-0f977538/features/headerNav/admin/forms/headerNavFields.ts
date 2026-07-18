import type {
	HeaderNavBorderThickness,
	HeaderNavBrandFontSize,
	HeaderNavBrandFontWeight,
	HeaderNavBrandGap,
	HeaderNavBrandLetterSpacing,
	HeaderNavBrandLogoHeight,
	HeaderNavContentWidth,
	HeaderNavFontSize,
	HeaderNavFontWeight,
	HeaderNavHeaderHeight,
	HeaderNavLetterSpacing,
	HeaderNavLinkSpacing,
	HeaderNavTextDirection,
	HeaderNavTextTransform,
} from '../../core/types';

export type HeaderNavFieldOption<T extends string = string> = {
	value: T;
	label: string;
};

export const booleanOptions: readonly HeaderNavFieldOption<'false' | 'true'>[] = [
	{ value: 'false', label: 'No' },
	{ value: 'true', label: 'Yes' },
] as const;

export const contentWidthOptions: readonly HeaderNavFieldOption<HeaderNavContentWidth>[] = [
	{ value: 'site', label: 'Site' },
	{ value: 'wide', label: 'Wide' },
	{ value: 'full', label: 'Full' },
] as const;

export const textDirectionOptions: readonly HeaderNavFieldOption<HeaderNavTextDirection>[] = [
	{ value: 'ltr', label: 'Left to right' },
	{ value: 'rtl', label: 'Right to left' },
] as const;

export const headerHeightOptions: readonly HeaderNavFieldOption<HeaderNavHeaderHeight>[] = [
	{ value: 'compact', label: 'Compact' },
	{ value: 'standard', label: 'Standard' },
	{ value: 'tall', label: 'Tall' },
	{ value: 'xtall', label: 'Extra Tall' },
] as const;

export const brandFontSizeOptions: readonly HeaderNavFieldOption<HeaderNavBrandFontSize>[] = [
	{ value: 'sm', label: 'Small' },
	{ value: 'md', label: 'Medium' },
	{ value: 'lg', label: 'Large' },
	{ value: 'xl', label: 'Extra large' },
] as const;

export const fontSizeOptions: readonly HeaderNavFieldOption<HeaderNavFontSize>[] = [
	{ value: 'sm', label: 'Small' },
	{ value: 'md', label: 'Medium' },
	{ value: 'lg', label: 'Large' },
] as const;

export const fontWeightOptions: readonly HeaderNavFieldOption<HeaderNavBrandFontWeight | HeaderNavFontWeight>[] = [
	{ value: 'normal', label: 'Normal' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'semibold', label: 'Semibold' },
	{ value: 'bold', label: 'Bold' },
] as const;

export const letterSpacingOptions: readonly HeaderNavFieldOption<HeaderNavBrandLetterSpacing | HeaderNavLetterSpacing>[] = [
	{ value: 'narrow', label: 'Narrow' },
	{ value: 'normal', label: 'Normal' },
	{ value: 'wide', label: 'Wide' },
] as const;

export const gapOptions: readonly HeaderNavFieldOption<HeaderNavBrandGap | HeaderNavLinkSpacing>[] = [
	{ value: 'tight', label: 'Tight' },
	{ value: 'normal', label: 'Normal' },
	{ value: 'wide', label: 'Wide' },
] as const;

export const logoHeightOptions: readonly HeaderNavFieldOption<HeaderNavBrandLogoHeight>[] = [
	{ value: 'sm', label: 'Small' },
	{ value: 'md', label: 'Medium' },
	{ value: 'lg', label: 'Large' },
	{ value: 'xl', label: 'Extra Large' },
] as const;

export const textTransformOptions: readonly HeaderNavFieldOption<HeaderNavTextTransform>[] = [
	{ value: 'none', label: 'None' },
	{ value: 'uppercase', label: 'Uppercase' },
] as const;

export const borderThicknessOptions: readonly HeaderNavFieldOption<HeaderNavBorderThickness>[] = [
	{ value: 'none', label: 'None' },
	{ value: 'thin', label: 'Thin' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'thick', label: 'Thick' },
] as const;
