export type OrionSiteConfigComponentsCardKey = 'components';

export type OrionSiteConfigComponentsDraft = {
	container_width: string | null;
	content_width: string | null;
	card_radius: string | null;
	button_radius: string | null;
	input_radius: string | null;
};

export type OrionSiteConfigComponentsField = keyof OrionSiteConfigComponentsDraft;
