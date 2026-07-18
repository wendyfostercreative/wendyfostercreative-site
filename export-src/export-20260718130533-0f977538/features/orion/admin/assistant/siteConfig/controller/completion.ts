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

export function handleSiteConfigSaveCompletion(
	store: AssistantControllerStore,
	searchParams: URLSearchParams,
): boolean {
	if (store.pathname !== '/admin/site') return false;
	if (searchParams.get('orion_site_config_saved') !== '1') return false;

	const currentWorkflow = store.workflow();
	if (currentWorkflow.domain !== 'site_config' || currentWorkflow.step === 'applied') return false;

	markWorkflowApplied(store);
	store.appendMessage({
		role: 'assistant',
		text: store.labels.siteApplySuccess,
		actions: [
			{
				id: 'route_to_step',
				label: store.labels.siteConfigContinueToHeaderNav,
				href: '/admin/headerNav',
			},
		],
	});
	return true;
}
