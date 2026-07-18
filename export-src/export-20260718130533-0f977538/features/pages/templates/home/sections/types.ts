import type { PageSectionAction, PageSectionImage } from '../../../sections/core/types';

export type HomeHeroSectionContent = {
	eyebrow: string;
	headline: string;
	body: string;
	image: PageSectionImage;
	primary_action: PageSectionAction;
	secondary_action: PageSectionAction;
};

export type HomeImageLinkTextSectionContent = {
	heading: string;
	body: string;
	image: PageSectionImage;
	action: PageSectionAction;
};
