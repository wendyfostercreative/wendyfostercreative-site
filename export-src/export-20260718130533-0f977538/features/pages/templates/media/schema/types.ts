export type ImagePageHeader = {
	eyebrow: string;
	heading: string;
	intro: string;
};

export type ImageSourceMode = 'all' | 'filtered';
export type ImageGalleryLayout = 'grid';

export type ImageGallerySource = {
	mode: ImageSourceMode;
	media_role: string;
	collection: string;
};

export type ImageGalleryDisplay = {
	layout_variant: ImageGalleryLayout;
	show_title: boolean;
	show_description: boolean;
	show_price: boolean;
	show_collection: boolean;
	show_materials: boolean;
};

export type ImageGalleryLink = {
	label: string;
	url: string;
};

export type ImageTemplateContent = {
	show_page_header: boolean;
	page_header: ImagePageHeader;
	source: ImageGallerySource;
	display: ImageGalleryDisplay;
	links: ImageGalleryLink[];
};
