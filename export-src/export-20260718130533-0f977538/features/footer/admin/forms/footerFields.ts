import type {
	FooterBorderThickness,
	FooterBrandLayout,
	FooterContentWidth,
	FooterLayoutPreset,
	FooterLinkLayout,
	FooterLogoHeight,
	FooterTextDirection,
} from '../../core/types';

export type FooterFieldOption<T extends string = string> = {
	value: T;
	label: string;
};

export const booleanOptions: readonly FooterFieldOption<'false' | 'true'>[] = [
	{ value: 'false', label: 'No' },
	{ value: 'true', label: 'Yes' },
] as const;

export const layoutPresetOptions: readonly FooterFieldOption<FooterLayoutPreset>[] = [
	{ value: 'minimal', label: 'Minimal' },
	{ value: 'brand-links-copyright', label: 'Brand, links, copyright' },
	{ value: 'columns', label: 'Columns' },
	{ value: 'centered', label: 'Centered' },
] as const;

export const contentWidthOptions: readonly FooterFieldOption<FooterContentWidth>[] = [
	{ value: 'site', label: 'Site' },
	{ value: 'wide', label: 'Wide' },
	{ value: 'full', label: 'Full' },
] as const;

export const textDirectionOptions: readonly FooterFieldOption<FooterTextDirection>[] = [
	{ value: 'ltr', label: 'Left to right' },
	{ value: 'rtl', label: 'Right to left' },
] as const;

export const brandLayoutOptions: readonly FooterFieldOption<FooterBrandLayout>[] = [
	{ value: 'inline', label: 'Inline' },
	{ value: 'stacked', label: 'Stacked' },
] as const;

export const logoHeightOptions: readonly FooterFieldOption<FooterLogoHeight>[] = [
	{ value: 'sm', label: 'Small' },
	{ value: 'md', label: 'Medium' },
	{ value: 'lg', label: 'Large' },
] as const;

export const linkLayoutOptions: readonly FooterFieldOption<FooterLinkLayout>[] = [
	{ value: 'inline', label: 'Inline' },
	{ value: 'columns', label: 'Columns' },
	{ value: 'stacked', label: 'Stacked' },
] as const;

export const borderThicknessOptions: readonly FooterFieldOption<FooterBorderThickness>[] = [
	{ value: 'none', label: 'None' },
	{ value: 'thin', label: 'Thin' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'thick', label: 'Thick' },
] as const;
