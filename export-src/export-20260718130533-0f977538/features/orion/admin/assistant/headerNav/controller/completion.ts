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

export function handleHeaderNavSaveCompletion(
	store: AssistantControllerStore,
	searchParams: URLSearchParams,
): boolean {
	if (store.pathname !== '/admin/headerNav') return false;
	if (searchParams.get('orion_header_nav_saved') !== '1') return false;

	const currentWorkflow = store.workflow();
	if (currentWorkflow.domain !== 'header_nav' || currentWorkflow.step === 'applied') return false;

	markWorkflowApplied(store);
	store.appendMessage({
		role: 'assistant',
		text: store.labels.headerNavApplySuccess,
		actions: [
			{
				id: 'route_to_step',
				label: store.labels.headerNavContinueToPages,
				href: '/admin/pages',
			},
		],
	});
	return true;
}
