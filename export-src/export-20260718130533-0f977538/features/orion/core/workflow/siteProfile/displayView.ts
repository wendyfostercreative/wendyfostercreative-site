import type { SiteProfile, SiteLocalization } from '../../../../siteProfile/core/types';
import type {
	OrionDefaultPageDefinition,
	OrionSiteProfileProposal,
	OrionSummary,
} from './types';
import {
	buildStarterPageDefinitions,
	inferSiteProfileTypeKey,
	siteProfileTypeLabel,
	starterPagesForSiteProfileType,
	starterTemplatesForPages,
} from './siteProfileTypes';

export type SiteProfileDisplay = {
	profile: SiteProfile;
	starterPages: OrionDefaultPageDefinition[];
};

function defaultLocalization(): SiteLocalization {
	return {
		admin_locale: 'en',
		fallback_locale: 'en',
		enabled_locales: ['en'],
	};
}

const DEFAULT_SITE_PROFILE_TEMPLATES = ['home', 'content', 'media', 'contact'] as const;
const DEFAULT_SITE_PROFILE_PAGE_TITLES = ['Home', 'About', 'Contact'] as const;

function tokenizeValue(value: string): string {
	const compact = value
		.trim()
		.toLowerCase()
		.replace(/[-_/]+/g, ' ')
		.replace(/\s+/g, ' ');
	if (!compact) return '';
	return compact.split(' ').filter(Boolean).join('_');
}

function stringMetadataValue(metadata: Record<string, unknown> | null | undefined, key: string): string {
	return typeof metadata?.[key] === 'string' ? metadata[key] : '';
}

function siteProfileTypeMetadataValue(metadata: Record<string, unknown> | null | undefined): string {
	return stringMetadataValue(metadata, 'site_profile_type_key') || stringMetadataValue(metadata, 'starter_category_key');
}

function baseSiteProfile(saved?: SiteProfile | null): SiteProfile {
	return saved ?? {
		id: 1,
		profile_key: 'general_website',
		profile_version: '1',
		label: 'General Website',
		description: 'General website setup.',
		status: 'active',
		is_active: true,
		media_vocabulary: {
			roles: [],
			collections: [],
		},
		localization: defaultLocalization(),
		enabled_templates: [],
		default_pages: [],
		template_defaults: {},
		setup_questions: [],
		agent_notes: '',
		metadata: {},
		created_at: null,
		updated_at: null,
	};
}

function cleanSiteTypePhrase(value: string): string {
	return value.trim().replace(/\s+(site|website)$/i, '').trim();
}

function descriptionFromSummary(summary: OrionSummary): string {
	const primaryWork = summary.primary_work.trim().toLowerCase();
	const businessType = summary.business_type.trim();
	const audience = summary.audience.trim().toLowerCase();

	if (primaryWork && businessType && audience) {
		return `Website for a ${businessType} focused on ${primaryWork}, serving ${audience}.`;
	}
	if (primaryWork && businessType) {
		return `Website for a ${businessType} focused on ${primaryWork}.`;
	}
	if (primaryWork) {
		return `Website focused on ${primaryWork}.`;
	}
	if (businessType) {
		return `Website for a ${businessType}.`;
	}
	return '';
}

function labelFromProfileKey(profileKey: string): string {
	const compact = profileKey.trim().replace(/[_-]+/g, ' ');
	if (!compact) return 'General Website';

	const words = compact
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => {
			const lowered = part.toLowerCase();
			if (lowered === 'artist') return 'General';
			if (lowered === 'portfolio') return 'Website';
			return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
		});

	return words.join(' ') || 'General Website';
}

function baseAlreadyImpliesSiteType(base: string, siteType: string): boolean {
	if (!base || !siteType) return false;
	return base === siteType || base.endsWith(`_${siteType}`);
}

function derivedProfileKey(summary: OrionSummary, saved?: SiteProfile | null): string {
	const explicit = tokenizeValue(summary.suggested_profile_key);
	if (explicit) return explicit;

	const siteType = tokenizeValue(summary.site_type);
	const businessType = tokenizeValue(summary.business_type);
	const primaryWork = tokenizeValue(summary.primary_work);
	const base = businessType || primaryWork;

	if (siteType === 'services') return base ? `${base}_site` : 'services_site';
	if (siteType === 'portfolio') return base ? `${base}_portfolio` : 'portfolio_site';
	if (siteType) {
		if (baseAlreadyImpliesSiteType(base, siteType)) return base;
		return base && base !== siteType ? `${base}_${siteType}` : `${siteType}_site`;
	}
	if (base) return `${base}_site`;

	return saved?.profile_key || 'general_website';
}

function currentSummaryCardKey(summary: OrionSummary): string | null {
	return typeof summary.model_input?.card_key === 'string' ? summary.model_input.card_key : null;
}

function summarySiteProfileTypeKey(summary: OrionSummary, saved?: SiteProfile | null): string {
	return summary.site_profile_type_key
		|| inferSiteProfileTypeKey(summary.admin_message, summary.site_type, summary.business_type, summary.primary_work)
		|| siteProfileTypeMetadataValue(saved?.metadata as Record<string, unknown> | undefined);
}

function starterPagesFromSummary(summary: OrionSummary, saved?: SiteProfile | null): OrionDefaultPageDefinition[] {
	const cardKey = currentSummaryCardKey(summary);
	const siteProfileTypeKey = summarySiteProfileTypeKey(summary, saved);
	const siteProfileTypePages = starterPagesForSiteProfileType(siteProfileTypeKey);

	if (cardKey === 'starter_pages') {
		if (summary.suggested_default_pages.length) return buildStarterPageDefinitions(summary.suggested_default_pages);
		if (siteProfileTypePages.length) return siteProfileTypePages;
		return buildStarterPageDefinitions(DEFAULT_SITE_PROFILE_PAGE_TITLES);
	}

	if (cardKey === 'site_type' && siteProfileTypePages.length) return siteProfileTypePages;

	if (saved?.default_pages.length) return saved.default_pages;
	if (siteProfileTypePages.length) return siteProfileTypePages;
	return buildStarterPageDefinitions(DEFAULT_SITE_PROFILE_PAGE_TITLES);
}

function starterPagesFromProposal(proposal: OrionSiteProfileProposal, saved?: SiteProfile | null): OrionDefaultPageDefinition[] {
	if (proposal.default_pages.length) return proposal.default_pages;
	const proposalMetadata = proposal.metadata as Record<string, unknown> | undefined;
	const siteProfileTypeKey = siteProfileTypeMetadataValue(proposalMetadata)
		|| siteProfileTypeMetadataValue(saved?.metadata as Record<string, unknown> | undefined);
	const siteProfileTypePages = starterPagesForSiteProfileType(siteProfileTypeKey);
	if (siteProfileTypePages.length) return siteProfileTypePages;
	if (saved?.default_pages.length) return saved.default_pages;
	return buildStarterPageDefinitions(DEFAULT_SITE_PROFILE_PAGE_TITLES);
}

export function siteProfileDisplayFromProposal(
	proposal: OrionSiteProfileProposal,
	saved?: SiteProfile | null,
): SiteProfileDisplay {
	const base = baseSiteProfile(saved);
	const starterPages = starterPagesFromProposal(proposal, saved);
	const proposalMetadata = proposal.metadata as Record<string, unknown> | undefined;
	const siteProfileTypeKey = siteProfileTypeMetadataValue(proposalMetadata)
		|| siteProfileTypeMetadataValue(base.metadata as Record<string, unknown>);

	return {
		profile: {
			...base,
			profile_key: proposal.profile_key || base.profile_key,
			profile_version: proposal.profile_version || base.profile_version,
			label: proposal.label || base.label,
			description: proposal.description || base.description,
			status: proposal.status || base.status,
			is_active: proposal.is_active,
			enabled_templates: proposal.enabled_templates.length ? proposal.enabled_templates : starterTemplatesForPages(starterPages),
			default_pages: starterPages,
			agent_notes: proposal.agent_notes,
			metadata: {
				...base.metadata,
				...proposal.metadata,
				site_profile_type_key: siteProfileTypeKey,
				site_profile_type_label: siteProfileTypeLabel(siteProfileTypeKey),
			},
		},
		starterPages,
	};
}

export function siteProfileDisplayFromSummary(
	summary: OrionSummary,
	saved: SiteProfile,
): SiteProfileDisplay {
	const base = baseSiteProfile(saved);
	const cardKey = currentSummaryCardKey(summary);
	const profileKey = derivedProfileKey(summary, saved);
	const siteProfileTypeKey = summarySiteProfileTypeKey(summary, saved);
	const starterPages = starterPagesFromSummary(summary, saved);
	const siteTypePhrase = cleanSiteTypePhrase(summary.site_type);
	const enabledTemplates = cardKey === 'starter_pages'
		? (summary.suggested_templates.length ? summary.suggested_templates : starterTemplatesForPages(starterPages))
		: cardKey === 'site_type' && starterPages.length
			? starterTemplatesForPages(starterPages)
		: (base.enabled_templates.length ? base.enabled_templates : [...DEFAULT_SITE_PROFILE_TEMPLATES]);

	return {
		profile: {
			...base,
			profile_key: profileKey,
			label: labelFromProfileKey(profileKey),
			description: descriptionFromSummary(summary) || base.description,
			media_vocabulary: base.media_vocabulary,
			enabled_templates: enabledTemplates,
			default_pages: cardKey === 'starter_pages' ? starterPages : (starterPages.length ? starterPages : base.default_pages),
			agent_notes: [
				siteProfileTypeLabel(siteProfileTypeKey) ? `Starter setup: ${siteProfileTypeLabel(siteProfileTypeKey)}` : '',
				siteTypePhrase ? `Site type: ${siteTypePhrase}` : '',
				summary.business_type ? `Business type: ${summary.business_type}` : '',
				summary.primary_work ? `Primary work: ${summary.primary_work}` : '',
				summary.audience ? `Audience: ${summary.audience}` : '',
				'Starter pages and navigation can be changed later in Pages.',
			].filter(Boolean).join('; ') || base.agent_notes,
			metadata: {
				...base.metadata,
				site_profile_type_key: siteProfileTypeKey,
				site_profile_type_label: siteProfileTypeLabel(siteProfileTypeKey),
			},
		},
		starterPages,
	};
}
