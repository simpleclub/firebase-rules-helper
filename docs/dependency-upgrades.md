# Dependency Upgrades — repo specifics

Process: `dev-upgrade-deps` skill (simpleclub-skills, dept-tech). This doc
holds only what is specific to this repo.

`firebase-rules-coverage` and `firebase-rules-generator` declare identical
dependency sets: upgrade both on one branch/PR. Their regenerated lockfiles
come out byte-identical — `cmp` them as a sanity check. SC-22189, SC-22900.

## Verify commands

Per package, on Node 22 (CI matrix and `engines` floor):

```bash
npx yarn@1.22.22 install --frozen-lockfile  # what CI runs
npm run compile
npm run lint
npm test  # pretest=compile, jest, posttest=lint; 2 suites / 5 tests each
```

Tests run `src/` through ts-jest, never `build/`. For compiler or runtime-dep
majors, also run the built CLIs on the fixtures and diff against a `main`
build: `node build/src/cli.js fixtures/index.rules -o <out>/firestore.rules`
(generator), `node build/src/cli.js fixtures/firestore-coverage.json -r
fixtures/firestore.rules -o <out>` (coverage). The source map's paths are
absolute, so normalize them before diffing.

## Tooling caveats

- **Yarn 1 Classic, despite `.yarnrc.yml`.** Lockfiles are
  `# yarn lockfile v1`; CI runs `yarn install --frozen-lockfile` on
  `actions/setup-node` without corepack. Regenerate only with
  `npx yarn@1.22.22`, audit with `npx yarn@1.22.22 audit`. The per-package
  `.yarnrc.yml` is inert (no age gate, install scripts run), though `ncu` still
  reads its `npmMinimalAgeGate`. SC-22189.
- **ESLint config is `eslint.config.cjs`**: the packages are
  `"type": "module"`, so a CommonJS flat config needs `.cjs`. gts 7 dropped
  `plugin:n/recommended`, and only `n/no-unpublished-import` is re-enabled
  locally. SC-22900.

## Package rules

| Package | Rule | Reason + evidence |
| ------- | ---- | ----------------- |
| `@types/node` | Stay on `^22.x`; Dependabot's 26.x PRs are superseded, not merged | Typings track the Node 22 runtime floor (`engines`, CI matrix, `.nvmrc`). #168, SC-22900. |
| `tmp` | Keep resolution `^0.2.7` | The tree's only `tmp` is `gts → inquirer → external-editor` (`^0.0.33`). Removing the pin resolves `tmp@0.0.33` (GHSA-ph9p-34f9-6g65). Re-verified SC-22189, SC-22900. |
