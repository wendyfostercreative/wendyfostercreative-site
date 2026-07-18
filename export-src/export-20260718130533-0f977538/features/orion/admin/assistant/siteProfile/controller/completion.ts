import type { AssistantControllerStore } from '../../shared/controller/state';

function markWorkflowApplied(store: AssistantControllerStore): void {
	const currentWorkflow = store.workflow();
	store.setWorkflow({
		...currentWorkflow,
		step: 'applied',
		summary: null,
		proposal: null,
		draftSummary: null,
		draftProposal: null,
	});
}

export function handleSiteProfileSaveCompletion(
	store: AssistantControllerStore,
	searchParams: URLSearchParams,
): boolean {
	if (store.pathname !== '/admin/site-profile') return false;
	if (searchParams.get('orion_site_profile_saved') !== '1') return false;

	const currentWorkflow = store.workflow();
	if (currentWorkflow.domain !== 'site_profile' || currentWorkflow.step === 'applied') return false;

	markWorkflowApplied(store);
	store.appendMessage({
		role: 'assistant',
		text: store.labels.siteProfileTransferToSiteConfig,
		actions: [
			{
				id: 'route_to_step',
				label: store.labels.siteProfileContinueToSiteConfig,
				href: '/admin/site',
			},
		],
	});
	return true;
}
