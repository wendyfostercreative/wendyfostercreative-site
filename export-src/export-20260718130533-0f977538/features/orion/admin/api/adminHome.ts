import { apiFetch } from '../../../../lib/api';
import type { OrionAdminHomeDecision } from '../../core/workflow/adminHome';

type AdminHomeDecisionData = {
	decision: OrionAdminHomeDecision;
};

export async function decideAdminHomeRoute(message: string): Promise<OrionAdminHomeDecision> {
	const data = await apiFetch<AdminHomeDecisionData>('/orion/v1/admin-home/decide', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ message }),
	});

	return data.decision;
}
