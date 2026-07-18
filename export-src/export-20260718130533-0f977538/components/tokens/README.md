# Component Tokens

This folder owns the first shared token foundation for the CMS component system.

The intended flow is:

1. Site Config stores editable design intent.
2. `siteThemeToTokens()` maps the resolved Site Config theme into semantic component tokens.
3. `siteTokensToCssVars()` exposes those tokens as runtime CSS variables.
4. Admin primitives, public primitives, and feature assemblies consume the variables.

## Categories

Initial token categories:

- `colors`
- `typography`
- `radii`
- `spacing`
- `layout`
- `buttons`
- `inputs`

## Naming conventions

Code tokens use semantic camelCase names grouped by category, for example:

- `tokens.colors.background`
- `tokens.colors.surface`
- `tokens.typography.bodyFont`
- `tokens.radii.card`
- `tokens.spacing.section`
- `tokens.layout.containerWidth`
- `tokens.buttons.hoverStyle`
- `tokens.inputs.border`

Runtime CSS variables use the existing `--site-*` prefix and semantic category names, for example:

- `--site-color-bg`
- `--site-color-text`
- `--site-color-bg-soft`
- `--site-font-body`
- `--site-radius-card`
- `--site-space-section`
- `--site-container-width`
- `--site-button-hover-style`
- `--site-input-border`

## Button hover underline

Hover underline is represented as button behavior tokens, not as a one-off component rule:

- `tokens.buttons.hoverStyle = 'underline'`
- `--site-button-hover-style: underline`
- `--site-button-hover-decoration: underline`

The shared `components/ui/Button.astro` primitive consumes `--site-button-hover-decoration` for hover decoration so admin and public patterns can inherit the same behavior without hardcoding public-only styling.
