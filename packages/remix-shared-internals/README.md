# @remix-run/shared-internals

This package is not intended to be published or directly consumed externally- it is only meant to contain functionality that is shared by multiple other Remix packages. Packages depending on this should import only the needed functions. Rollup will then include only the used exports from shared-internals in a depending package's build output, treeshaking away unused ones.

Caveats:

- @remix-run/shared-internals should only be specified in devDependencies by its consumers, so as not to add needless installation overhead during installation of production packages (e.g., when running a remix package via `npx`).
