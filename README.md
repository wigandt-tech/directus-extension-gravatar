# Directus Gravatar

A Directus **bundle** that adds Gravatar support for email fields in collection views.

## What's in the bundle

| Entry | Type | Use it for |
| --- | --- | --- |
| **Gravatar** | Display | Render an avatar from any string/email field in list and detail views. |
| **Gravatar Proxy** | Endpoint | Serve Gravatar images through the Directus API to avoid browser CSP or tracking-blocker issues. |

Gravatar URLs are generated from the lowercased, trimmed email address using SHA-256.

## Screenshots

### Display in collection layouts

![Gravatar display in a Directus list view](https://raw.githubusercontent.com/wigandt-tech/directus-extension-gravatar/main/docs/screenshots/gravatar-display.svg)

### Email interface with live preview

![Gravatar Email interface in a Directus item form](https://raw.githubusercontent.com/wigandt-tech/directus-extension-gravatar/main/docs/screenshots/gravatar-interface.svg)

## Installation

```bash
npm install directus-extension-gravatar
```

Restart Directus after installing the package.

## Email field usage

For any email field:

1. Set the display to **Gravatar** to show an avatar in layouts.

The display supports size, shape, rating, default image, forced default image, and optional email text options.

The display loads avatars from the bundled `/gravatar/avatar/:hash` endpoint. Restart Directus after installing or updating the extension so the API endpoint is registered.

## Development

```bash
npm install
npm run dev      # watch build
npm run build    # production build -> dist/
npm run check    # typecheck, tests, build, and package dry run
```

Requires Directus host `^11` or `^12`.

## Release

CI runs on pull requests and pushes to `main`. Releases are started manually from the Release workflow by choosing a `patch`, `minor`, or `major` bump. The workflow updates the package version and changelog, creates the git tag and GitHub release, and publishes to npm through Trusted Publishing with provenance.

## License

MIT
