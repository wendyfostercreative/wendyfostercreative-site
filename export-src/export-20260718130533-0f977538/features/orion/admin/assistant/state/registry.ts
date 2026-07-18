import { adminHomeDomainController } from '../adminHome/controller';
import type { OrionWorkflowDomain } from '../../../core/types';
import { headerNavDomainController } from '../headerNav/controller';
import { siteConfigDomainController } from '../siteConfig/controller';
import { siteProfileDomainController } from '../siteProfile/controller';
import type { DomainControllerAdapter, SupportedWorkflowDomain } from '../shared/types/domainController';

const DOMAIN_CONTROLLERS: Record<SupportedWorkflowDomain, DomainControllerAdapter> = {
	admin_home: adminHomeDomainController,
	site_profile: siteProfileDomainController,
	site_config: siteConfigDomainController,
	header_nav: headerNavDomainController,
};

export function getDomainController(
	domain: OrionWorkflowDomain,
): DomainControllerAdapter | null {
	return DOMAIN_CONTROLLERS[domain] ?? null;
}
