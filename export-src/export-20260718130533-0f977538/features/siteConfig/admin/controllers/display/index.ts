import type { SiteConfig } from '../../../core/types';
import { resolveSiteTheme } from '../../../core/theme';
import { bindBrandingCardController } from './brandingCard';
import { bindComponentsCardController } from './componentsCard';
import { bindThemeCardController } from './themeCard';
import { bindTypographyCardController } from './typographyCard';
import {
	bindRenderListeners,
	collectDisplayElements,
	renderDisplay,
} from './shared';
import type { DisplayLabels, SavedDisplay, SiteConfigDisplayRuntime } from './types';

export function initDisplayController(root: HTMLElement): void {
	if (root.dataset.siteConfigDisplayInitialized === 'true') return;
	root.dataset.siteConfigDisplayInitialized = 'true';

	const savedSiteText = root.dataset.savedSite;
	if (!savedSiteText) return;

	let savedSite: SiteConfig;
	try {
		savedSite = JSON.parse(savedSiteText) as SiteConfig;
	} catch {
		return;
	}

	const savedDisplay: SavedDisplay = {
		site: savedSite,
		resolvedTheme: resolveSiteTheme(savedSite.theme),
	};

	const labels: DisplayLabels = {
		savedStatus: root.dataset.savedStatus || '',
		previewStatus:
			root.dataset.previewStatus ||
			'Preview from Orion. Review the suggested changes in the page before applying them.',
		stagedStatus:
			root.dataset.stagedStatus ||
			'Draft from Orion is loaded here. Changes are not saved until you use the SAVE SETTINGS button.',
		goBack: 'Go back',
		yes: 'Yes',
		no: 'No',
		defaultValue: 'Default',
	};

	const runtime: SiteConfigDisplayRuntime = {
		root,
		savedSite,
		savedDisplay,
		labels,
		elements: collectDisplayElements(root),
		render: () => undefined,
	};

	runtime.render = () => renderDisplay(runtime);

	runtime.render();
	bindBrandingCardController(runtime);
	bindTypographyCardController(runtime);
	bindThemeCardController(runtime);
	bindComponentsCardController(runtime);
	bindRenderListeners(runtime);
}
