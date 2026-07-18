import type { OrionAdminHomeDecision } from '../../../../core/workflow/adminHome';
import type { OrionMessage, OrionPageContext } from '../../../../core/types';
import type { OrionAdminHomeLabels } from '../context/labels';

export const ADMIN_HOME_ACTIONS = ['start_step_01'] as const;

function routeActionLabel(route: string | null | undefined, labels: OrionAdminHomeLabels): string | null {
	switch (route) {
		case '/admin/site-profile':
			return labels.routeSiteProfile;
		case '/admin/site':
			return labels.routeSiteConfig;
		case '/admin/headerNav':
			return labels.routeHeaderNav;
		case '/admin/pages':
			return labels.routePages;
		case '/admin/media':
			return labels.routeMedia;
		case '/admin/footer':
			return labels.routeFooter;
		default:
			return null;
	}
}

export function createAdminHomeSeedMessage(
	context: OrionPageContext,
	labels: OrionAdminHomeLabels,
): OrionMessage {
	return {
		role: 'assistant',
		text: context.prompt,
		actions: [
			{
				id: 'start_step_01',
				label: labels.startStep01,
			},
		],
	};
}

export function createAdminHomeDecisionMessage(
	decision: OrionAdminHomeDecision,
	labels: OrionAdminHomeLabels,
): OrionMessage {
	const actionLabel = routeActionLabel(decision.route, labels)
		|| decision.action_label
		|| labels.openStep;

	return {
		role: 'assistant',
		text: decision.answer || labels.adminHomeFallbackAnswer,
		actions:
			decision.offer_navigation && decision.route
				? [
					{
						id: 'route_to_step',
						label: actionLabel,
						href: decision.route,
					},
				]
				: undefined,
	};
}

export function shouldReseedAdminHomeMessages(messages: OrionMessage[]): boolean {
	return (
		messages.length === 1 &&
		messages[0]?.role === 'assistant' &&
		!messages[0]?.actions?.some((action) => action.id === 'start_step_01')
	);
}
