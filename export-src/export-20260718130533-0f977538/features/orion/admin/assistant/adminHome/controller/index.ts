import { decideAdminHomeRoute } from '../../../api';
import type {
	DomainControllerAdapter,
	DomainSubmitContext,
} from '../../shared/types/domainController';
import {
	createAdminHomeDecisionMessage,
} from '../workflow';

async function handleAdminHomeSubmit({
	text,
	workflow,
	labels,
	appendMessage,
}: DomainSubmitContext): Promise<boolean> {
	if (workflow.domain !== 'admin_home') return false;

	const decision = await decideAdminHomeRoute(text);
	appendMessage(createAdminHomeDecisionMessage(decision, labels));
	return true;
}

export const adminHomeDomainController: DomainControllerAdapter = {
	async handleAction({ action, workflow }): Promise<boolean> {
		if (workflow.domain !== 'admin_home') return false;
		if (action !== 'start_step_01') return false;
		window.location.href = '/admin/site-profile';
		return true;
	},

	handleSubmit: handleAdminHomeSubmit,
};
