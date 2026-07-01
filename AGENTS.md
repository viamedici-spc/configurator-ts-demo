# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the demo app (Vue 3 + `<script setup>`):
  - `src/Config.ts` holds the engine endpoint, access token, and the configuration model (`deploymentName`/`channel`).
  - `src/App.vue` is the shell: it owns the hard-coded Sales Region selector and wraps `Configurator` in `<Suspense>`.
  - `src/configurator/Configurator.vue` creates the session with `SessionFactory.createSession` and provides it (and the configuration / can-reset state) to descendants via `src/utils/Contexts`.
  - `src/configurator/attributes/` renders the attribute list (`Attributes.vue`, `AttributeItem.vue`, plus per-type components).
- `src/Main.ts` mounts `App.vue`.

## Architecture Overview
- The app is a reference consumer of `@viamedici-spc/configurator-ts` (the TypeScript client for the SPC Configuration Engine) — the plain-TS counterpart to the React demo.
- `Configurator.vue` uses a top-level `await SessionFactory.createSession(...)`, so it must be rendered inside `<Suspense>`.
- **Sales Region as a Fixed Decision:** the Sales Region is deliberately *not* a dynamic `AttributeItem`. A hard-coded `<select>` in `App.vue` holds the region and passes it to `Configurator` as a prop; `Configurator` adds it to `fixedDecisions` on the session (`{type: Choice, attributeId: {sharedConfigurationModelId: "SalesShared", localId: "SalesRegion"}, choiceValueId, state: Included}`). Because it is fixed at session creation, the engine trims the model to that region and the user cannot change it. The selector uses `:key="salesRegion"` to re-mount `Configurator`, which creates a fresh session for the new region.

## Build, Test, and Development Commands
- `npm run dev` starts the Vite dev server on `http://localhost:3000`.
- `npm run build` builds the app; `npm run preview` serves the build.

## Coding Style & Naming Conventions
- TypeScript + Vue 3 single-file components with `<script setup lang="ts">`; 4-space indentation; semicolons.
- PascalCase for components (`Configurator.vue`), camelCase for functions/variables.
- Import contract types, enums, and factories (e.g. `SessionFactory`, `AttributeType`, `ChoiceValueDecisionState`, `ConfigurationModelSourceType`) from `@viamedici-spc/configurator-ts`.

## Testing Guidelines
- This is a manual demo without a unit-test suite. Verify changes by running `npm run dev` and driving the app in the browser (e.g. with the Playwright MCP): check the CreateSession request payload, attribute states, and trimming.

## Commit & Pull Request Guidelines
- Commit history uses short, sentence-case messages, typically past tense (e.g. “Updated configurator-ts to 4.2.0”).
- Keep commits focused; include testing notes / screenshots for UI changes.

## Configuration Tips
- `src/Config.ts` selects the engine and model. The endpoint/token must have the model (`Configurator-React-Demo-Car`) with the `SalesShared::SalesRegion` attribute deployed and must support the `fixedDecisions` CreateSession option.
- The demo depends on a published (pre)release version of the library; bump `@viamedici-spc/configurator-ts` in `package.json` to consume new library changes.
