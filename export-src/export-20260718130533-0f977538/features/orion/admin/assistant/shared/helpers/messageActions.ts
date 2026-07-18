import type { OrionMessageAction } from '../../../../core/types';
import { ADMIN_HOME_ACTIONS } from '../../adminHome/workflow';

const SHELL_ACTIONS: OrionMessageAction['id'][] = ['route_to_step'];
const ADMIN_HOME_MESSAGE_ACTIONS: OrionMessageAction['id'][] = [...ADMIN_HOME_ACTIONS];

const SITE_PROFILE_ACTIONS: OrionMessageAction['id'][] = [
	'confirm_summary',
	'edit_summary',
	'edit_site_profile_site_type',
	'edit_site_profile_starter_pages',
	'apply_proposal',
];

const SITE_CONFIG_ACTIONS: OrionMessageAction['id'][] = [
	'confirm_summary',
	'edit_summary',
	'apply_proposal',
	'switch_to_branding',
	'switch_to_typography',
	'switch_to_theme',
	'switch_to_components',
	'switch_to_seo',
];

const SUPPORTED_MESSAGE_ACTIONS = new Set<OrionMessageAction['id']>([
	...SHELL_ACTIONS,
	...ADMIN_HOME_MESSAGE_ACTIONS,
	...SITE_PROFILE_ACTIONS,
	...SITE_CONFIG_ACTIONS,
]);

export function isSupportedMessageAction(action: string | undefined): action is OrionMessageAction['id'] {
	return Boolean(action && SUPPORTED_MESSAGE_ACTIONS.has(action as OrionMessageAction['id']));
}
