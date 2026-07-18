import type { OrionDefaultPageDefinition } from './types';

export const SITE_PROFILE_TYPE_DEFINITIONS = [
	{
		key: 'home_service',
		label: 'Home Service',
		starterPages: ['home', 'services', 'about', 'service_area', 'contact'],
		keywords: ['plumber', 'plumbing', 'hvac', 'heating', 'cooling', 'electrician', 'electrical', 'landscaper', 'landscaping', 'cleaner', 'cleaning', 'contractor', 'roofing', 'roofer', 'handyman', 'painter', 'remodeling', 'renovation'],
	},
	{
		key: 'food_service',
		label: 'Food Service',
		starterPages: ['home', 'menu', 'about', 'gallery', 'contact'],
		keywords: ['restaurant', 'cafe', 'coffee shop', 'bakery', 'catering', 'food truck', 'bistro', 'eatery', 'kitchen', 'chef'],
	},
	{
		key: 'legal_service',
		label: 'Legal Service',
		starterPages: ['home', 'services', 'about', 'faqs', 'contact'],
		keywords: ['lawyer', 'attorney', 'law office', 'legal', 'law firm', 'firm', 'estate planning', 'family law'],
	},
	{
		key: 'financial_service',
		label: 'Financial Service',
		starterPages: ['home', 'services', 'about', 'resources', 'contact'],
		keywords: ['accountant', 'bookkeeper', 'bookkeeping', 'tax prep', 'tax preparation', 'financial advisor', 'insurance', 'wealth', 'cpa', 'payroll'],
	},
	{
		key: 'real_estate_service',
		label: 'Real Estate Service',
		starterPages: ['home', 'services', 'about', 'listings', 'contact'],
		keywords: ['realtor', 'real estate agent', 'brokerage', 'property management', 'real estate', 'listing', 'listings', 'broker'],
	},
	{
		key: 'health_service',
		label: 'Health Service',
		starterPages: ['home', 'services', 'about', 'faqs', 'contact'],
		keywords: ['doctor', 'dentist', 'clinic', 'therapy office', 'medical', 'healthcare', 'chiropractor', 'orthodontist', 'pediatrician', 'therapist'],
	},
	{
		key: 'wellness_service',
		label: 'Wellness Service',
		starterPages: ['home', 'services', 'about', 'offerings', 'contact'],
		keywords: ['massage', 'holistic care', 'meditation', 'wellness practice', 'wellness', 'reiki', 'breathwork', 'mindfulness'],
	},
	{
		key: 'beauty_service',
		label: 'Beauty Service',
		starterPages: ['home', 'services', 'about', 'gallery', 'contact'],
		keywords: ['salon', 'barber', 'spa', 'esthetician', 'nail studio', 'beauty', 'hair stylist', 'lash', 'makeup artist'],
	},
	{
		key: 'fitness_service',
		label: 'Fitness Service',
		starterPages: ['home', 'programs', 'about', 'schedule', 'contact'],
		keywords: ['gym', 'yoga', 'pilates', 'trainer', 'fitness studio', 'fitness', 'workout', 'personal training', 'crossfit'],
	},
	{
		key: 'hospitality_service',
		label: 'Hospitality Service',
		starterPages: ['home', 'stay', 'about', 'gallery', 'contact'],
		keywords: ['hotel', 'inn', 'lodge', 'bed and breakfast', 'hospitality', 'bnb', 'guest house', 'vacation rental'],
	},
	{
		key: 'professional_service',
		label: 'Professional Service',
		starterPages: ['home', 'services', 'about', 'process', 'contact'],
		keywords: ['consultant', 'consulting', 'agency', 'b2b services', 'business services', 'advisory', 'strategy', 'operations'],
	},
	{
		key: 'creative_service',
		label: 'Creative Service',
		starterPages: ['home', 'services', 'about', 'work', 'contact'],
		keywords: ['designer', 'illustrator', 'creative studio', 'artist for hire', 'creative', 'brand designer', 'copywriter'],
	},
	{
		key: 'service_portfolio',
		label: 'Service & Portfolio',
		starterPages: ['home', 'services', 'portfolio', 'about', 'contact'],
		keywords: ['photographer', 'videographer', 'architect', 'interior designer', 'tattoo artist', 'portfolio', 'studio portfolio'],
	},
	{
		key: 'event_service',
		label: 'Event Service',
		starterPages: ['home', 'services', 'packages', 'gallery', 'contact'],
		keywords: ['event planner', 'wedding planner', 'dj', 'venue styling', 'events', 'planner', 'coordinator', 'florist'],
	},
	{
		key: 'automotive_service',
		label: 'Automotive Service',
		starterPages: ['home', 'services', 'about', 'faqs', 'contact'],
		keywords: ['auto repair', 'mechanic', 'detailing', 'tire shop', 'automotive', 'oil change', 'car wash'],
	},
	{
		key: 'pet_service',
		label: 'Pet Service',
		starterPages: ['home', 'services', 'about', 'faqs', 'contact'],
		keywords: ['dog grooming', 'pet sitting', 'boarding', 'training', 'pet service', 'dog walker', 'groomer'],
	},
	{
		key: 'education_service',
		label: 'Education Service',
		starterPages: ['home', 'programs', 'about', 'faqs', 'contact'],
		keywords: ['tutor', 'academy', 'music lessons', 'coach', 'course business', 'education', 'classes', 'lessons'],
	},
	{
		key: 'nonprofit_or_community_organization',
		label: 'Nonprofit or Community Organization',
		starterPages: ['home', 'about', 'programs', 'get_involved', 'contact'],
		keywords: ['nonprofit', 'community organization', 'foundation', 'ministry', 'charity', 'community', 'church', 'mission'],
	},
	{
		key: 'product_business',
		label: 'Product Business',
		starterPages: ['home', 'shop', 'about', 'faqs', 'contact'],
		keywords: ['shop', 'boutique', 'store', 'ecommerce brand', 'product line', 'ecommerce', 'retail', 'products'],
	},
] as const;

export type SiteProfileTypeDefinition = (typeof SITE_PROFILE_TYPE_DEFINITIONS)[number];
export type SiteProfileTypeKey = SiteProfileTypeDefinition['key'];

type StarterPageTemplate = 'home' | 'content' | 'media' | 'contact';

const MEDIA_PAGE_KEYS = new Set(['gallery', 'listings', 'portfolio', 'shop', 'stay', 'work']);

export const STARTER_PAGE_FALLBACK_LABELS: Record<string, string> = {
	home: 'Home',
	services: 'Services',
	about: 'About',
	service_area: 'Service Area',
	contact: 'Contact',
	menu: 'Menu',
	gallery: 'Gallery',
	faqs: 'FAQs',
	resources: 'Resources',
	listings: 'Listings',
	offerings: 'Offerings',
	programs: 'Programs',
	schedule: 'Schedule',
	stay: 'Stay',
	process: 'Process',
	work: 'Work',
	portfolio: 'Portfolio',
	packages: 'Packages',
	get_involved: 'Get Involved',
	shop: 'Shop',
};

export const STARTER_PAGE_FALLBACK_SLUGS: Record<string, string> = {
	home: '',
	services: 'services',
	about: 'about',
	service_area: 'service-area',
	contact: 'contact',
	menu: 'menu',
	gallery: 'gallery',
	faqs: 'faqs',
	resources: 'resources',
	listings: 'listings',
	offerings: 'offerings',
	programs: 'programs',
	schedule: 'schedule',
	stay: 'stay',
	process: 'process',
	work: 'work',
	portfolio: 'portfolio',
	packages: 'packages',
	get_involved: 'get-involved',
	shop: 'shop',
};

function normalizeText(value: string): string {
	return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ');
}

export function siteProfileTypeLabelKey(key: string): string {
	return `admin.site_profile.starter_setup.types.${key}.label`;
}

export function starterPageLabelKey(key: string): string {
	return `admin.site_profile.starter_setup.pages.${key}`;
}

export function starterPageSlugKey(key: string): string {
	return `admin.site_profile.starter_setup.pages.${key}.slug`;
}

export function starterPageFallbackLabel(key: string): string {
	return STARTER_PAGE_FALLBACK_LABELS[key] ?? key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (value) => value.toUpperCase());
}

export function starterTemplateForPageKey(key: string): StarterPageTemplate {
	const normalized = key.trim().toLowerCase();
	if (normalized === 'home') return 'home';
	if (normalized === 'contact') return 'contact';
	if (MEDIA_PAGE_KEYS.has(normalized)) return 'media';
	return 'content';
}

export function starterPathForPageKey(key: string, slugs: Record<string, string> = STARTER_PAGE_FALLBACK_SLUGS): string {
	const normalized = key.trim().toLowerCase();
	if (normalized === 'home') return '/';
	const slug = slugs[normalized] ?? STARTER_PAGE_FALLBACK_SLUGS[normalized] ?? normalized.replace(/_/g, '-');
	const compactSlug = slug.trim().replace(/^\/+|\/+$/g, '');
	return compactSlug ? `/${compactSlug}` : '/';
}

export function buildStarterPageDefinitions(keys: readonly string[], slugs?: Record<string, string>): OrionDefaultPageDefinition[] {
	return keys.map((key) => ({
		title: starterPageFallbackLabel(key),
		path: starterPathForPageKey(key, slugs),
		template: starterTemplateForPageKey(key),
	}));
}

export function getSiteProfileTypeDefinition(
	key: string | null | undefined,
): SiteProfileTypeDefinition | null {
	if (!key) return null;
	return SITE_PROFILE_TYPE_DEFINITIONS.find((definition) => definition.key === key) ?? null;
}

export function siteProfileTypeLabel(key: string | null | undefined): string {
	return getSiteProfileTypeDefinition(key)?.label ?? '';
}

export function starterPagesForSiteProfileType(
	key: string | null | undefined,
	slugs?: Record<string, string>,
): OrionDefaultPageDefinition[] {
	const definition = getSiteProfileTypeDefinition(key);
	return definition ? buildStarterPageDefinitions(definition.starterPages, slugs) : [];
}

export function starterTemplatesForPages(pages: readonly OrionDefaultPageDefinition[]): string[] {
	const templates: string[] = [];
	for (const page of pages) {
		if (!templates.includes(page.template)) templates.push(page.template);
	}
	return templates;
}

export function inferSiteProfileTypeKey(...values: Array<string | null | undefined>): SiteProfileTypeKey | '' {
	const haystack = normalizeText(values.filter(Boolean).join(' '));
	if (!haystack) return '';

	let bestKey: SiteProfileTypeKey | '' = '';
	let bestScore = 0;

	for (const definition of SITE_PROFILE_TYPE_DEFINITIONS) {
		let score = 0;
		for (const keyword of definition.keywords) {
			if (haystack.includes(normalizeText(keyword))) score += keyword.includes(' ') ? 3 : 1;
		}
		if (score > bestScore) {
			bestScore = score;
			bestKey = definition.key;
		}
	}

	return bestKey;
}
