import type { OrionSiteProfileWorkflowLabels } from '../../labels';
import type { OrionSummary } from '../../types';
import { siteProfileTypeLabel } from '../../siteProfileTypes';
import type { OrionSiteProfileSiteTypeDraft } from './types';
import { humanValueOrEmpty } from '../../../shared/display';

function siteTypeReviewDraft(summary: OrionSummary | null): OrionSiteProfileSiteTypeDraft | null {
	if (!summary) return null;

	return {
		site_type: summary.site_type,
		site_profile_type_key: summary.site_profile_type_key,
		business_type: summary.business_type,
		primary_work: summary.primary_work,
		audience: summary.audience,
	};
}

export function createSiteTypeReviewText(summary: OrionSummary, labels: OrionSiteProfileWorkflowLabels): string {
	const draft = siteTypeReviewDraft(summary);
	if (!draft) return labels.summaryEmpty;

	return [
		`Site type: ${humanValueOrEmpty(draft.site_type, labels.summaryEmpty)}`,
		`Site profile type: ${humanValueOrEmpty(siteProfileTypeLabel(draft.site_profile_type_key), labels.summaryEmpty)}`,
		`Business type: ${humanValueOrEmpty(draft.business_type, labels.summaryEmpty)}`,
		`Primary work: ${humanValueOrEmpty(draft.primary_work, labels.summaryEmpty)}`,
		`Audience: ${humanValueOrEmpty(draft.audience, labels.summaryEmpty)}`,
	].join('\n');
}
