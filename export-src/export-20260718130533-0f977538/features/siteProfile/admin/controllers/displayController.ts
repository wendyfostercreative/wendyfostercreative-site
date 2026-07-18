import { ORION_STATE_CHANGED_EVENT, loadOrionState } from '../../../orion/core/storage';
import {
	SITE_PROFILE_TYPE_DEFINITIONS,
	getStagedSiteProfileDisplay,
	starterPagesForSiteProfileType,
} from '../../../orion/core/workflow/siteProfile';
import type { SiteProfile } from '../../core/types';

type DisplayLabels = {
	savedStatus: string;
	previewStatus: string;
	stagedStatus: string;
	starterPagesEmpty: string;
};

function stringMetadataValue(profile: SiteProfile, key: string): string {
	const value = profile.metadata?.[key];
	return typeof value === 'string' ? value : '';
}

function siteProfileTypeMetadataValue(profile: SiteProfile): string {
	return stringMetadataValue(profile, 'site_profile_type_key') || stringMetadataValue(profile, 'starter_category_key');
}

function parseStringMap(value: string | undefined): Record<string, string> {
	if (!value) return {};
	try {
		const parsed = JSON.parse(value);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
		return Object.fromEntries(
			Object.entries(parsed).filter((entry): entry is [string, string] => (
				typeof entry[0] === 'string' && typeof entry[1] === 'string'
			)),
		);
	} catch {
		return {};
	}
}

function starterPageKeyFromPath(path: string): string {
	const normalized = path.trim().toLowerCase();
	if (normalized === '/') return 'home';
	return normalized.replace(/^\/+/, '').replace(/-/g, '_');
}

function localizedStarterPageTitle(
	page: { title: string; path: string },
	starterPageLabels: Record<string, string>,
): string {
	return starterPageLabels[starterPageKeyFromPath(page.path)] || page.title;
}

function localizedStarterPagePath(
	page: { path: string },
	starterPageSlugs: Record<string, string>,
): string {
	const pageKey = starterPageKeyFromPath(page.path);
	if (pageKey === 'home') return '/';
	const slug = starterPageSlugs[pageKey];
	if (!slug) return page.path;
	const compactSlug = slug.trim().replace(/^\/+|\/+$/g, '');
	return compactSlug ? `/${compactSlug}` : '/';
}

function buildStarterPageRow(title: string, path: string, template: string): string {
	return `
		<div class="grid gap-1 rounded-[var(--site-radius-input)] border border-[var(--admin-color-field-border)] bg-[var(--admin-color-field-bg)] px-3 py-2 text-sm text-[var(--admin-color-field-text)] md:grid-cols-[1fr_auto] md:items-center">
			<div>
				<div class="font-medium">${title}</div>
				<div class="text-xs text-[var(--admin-color-field-placeholder)]">${path}</div>
			</div>
			<div class="text-xs font-medium uppercase text-[var(--admin-color-field-placeholder)]">${template}</div>
		</div>
	`;
}

function buildStarterPageEmpty(emptyText: string): string {
	return `
		<div class="rounded-[var(--site-radius-input)] border border-[var(--admin-color-field-border)] bg-[var(--admin-color-field-bg)] px-3 py-2 text-sm text-[var(--admin-color-field-placeholder)]">
			${emptyText}
		</div>
	`;
}

function renderStarterPagesList(
	container: HTMLElement | null,
	pages: Array<{ title: string; path: string; template: string }>,
	emptyText: string,
	starterPageLabels: Record<string, string>,
	starterPageSlugs: Record<string, string>,
	templateLabels: Record<string, string>,
): void {
	if (!container) return;
	container.innerHTML = pages.length
		? pages.map((page) => buildStarterPageRow(
			localizedStarterPageTitle(page, starterPageLabels),
			localizedStarterPagePath(page, starterPageSlugs),
			templateLabels[page.template] || page.template,
		)).join('')
		: buildStarterPageEmpty(emptyText);
}

export function initDisplayController(root: HTMLElement): void {
	if (root.dataset.siteProfileDisplayInitialized === 'true') return;
	root.dataset.siteProfileDisplayInitialized = 'true';

	const savedProfileText = root.dataset.savedProfile;
	if (!savedProfileText) return;

	let savedProfile: SiteProfile;
	try {
		savedProfile = JSON.parse(savedProfileText) as SiteProfile;
	} catch {
		return;
	}

	const labels: DisplayLabels = {
		savedStatus: root.dataset.savedStatus || '',
		previewStatus: root.dataset.previewStatus || 'Preview from Orion. Review the suggested changes in the page before applying them.',
		stagedStatus: root.dataset.stagedStatus || 'Draft changes visible here',
		starterPagesEmpty: root.dataset.starterPagesEmpty || 'No launch navigation pages yet. Orion will suggest and create the first top-nav pages during Site Profile setup.',
	};
	const starterPageLabels = parseStringMap(root.dataset.starterPageLabels);
	const starterPageSlugs = parseStringMap(root.dataset.starterPageSlugs);
	const templateLabels = parseStringMap(root.dataset.templateLabels);

	const statusEl = root.querySelector('[data-site-profile-display-status]') as HTMLElement | null;
	const siteProfileTypeSelect = root.querySelector('[data-site-profile-type-key-select]') as HTMLSelectElement | null;
	const starterPagesList = root.querySelector('[data-site-profile-starter-pages-list]') as HTMLElement | null;
	const draftProposalInput = root.querySelector('[data-site-profile-draft-proposal]') as HTMLInputElement | null;

	const renderPagesForSelectedSiteProfileType = (): void => {
		if (!siteProfileTypeSelect) return;
		const siteProfileTypePages = starterPagesForSiteProfileType(siteProfileTypeSelect.value);
		const savedSiteProfileTypePages = starterPagesForSiteProfileType(siteProfileTypeMetadataValue(savedProfile));
		renderStarterPagesList(
			starterPagesList,
			siteProfileTypePages.length ? siteProfileTypePages : savedSiteProfileTypePages,
			labels.starterPagesEmpty,
			starterPageLabels,
			starterPageSlugs,
			templateLabels,
		);
	};

	const render = (): void => {
		const workflow = loadOrionState().workflowsByPath['/admin/site-profile'] ?? null;
		const staged = getStagedSiteProfileDisplay(workflow, savedProfile);

		if (!staged) {
			if (statusEl) {
				statusEl.textContent = labels.savedStatus;
				statusEl.hidden = !labels.savedStatus;
			}
			if (draftProposalInput) {
				draftProposalInput.value = '';
			}
			return;
		}

		if (statusEl) {
			statusEl.hidden = false;
			statusEl.textContent = staged.source.startsWith('preview_')
				? labels.previewStatus
				: labels.stagedStatus;
		}

		const displayProfile = staged.display.profile;

		if (siteProfileTypeSelect) {
			const siteProfileTypeKey = siteProfileTypeMetadataValue(displayProfile);
			if (siteProfileTypeKey && SITE_PROFILE_TYPE_DEFINITIONS.some((definition) => definition.key === siteProfileTypeKey)) {
				siteProfileTypeSelect.value = siteProfileTypeKey;
			}
		}

		if (starterPagesList) {
			renderStarterPagesList(starterPagesList, staged.display.starterPages, labels.starterPagesEmpty, starterPageLabels, starterPageSlugs, templateLabels);
		}

		if (draftProposalInput) {
			const proposal = workflow?.domain === 'site_profile' && workflow.draftProposal
				? JSON.stringify(workflow.draftProposal)
				: '';
			draftProposalInput.value = proposal;
		}
	};

	render();
	window.addEventListener(ORION_STATE_CHANGED_EVENT, render);
	window.addEventListener('storage', render);
	window.addEventListener('focus', render);
	siteProfileTypeSelect?.addEventListener('change', renderPagesForSelectedSiteProfileType);
}
