import ContentTemplate from '../templates/content/public/template.astro';
import ContactTemplate from '../templates/contact/public/template.astro';
import HomeTemplate from '../templates/home/public/template.astro';
import MediaTemplate from '../templates/media/public/template.astro';

export const cmsTemplateRegistry = {
	content: ContentTemplate,
	contact: ContactTemplate,
	home: HomeTemplate,
	media: MediaTemplate,
};
