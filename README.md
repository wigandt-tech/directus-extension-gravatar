# Directus Gravatar

A Directus **bundle** that renders Gravatar avatars from email fields in collection views.

The email value is lowercased, trimmed, hashed with SHA-256, and loaded through the bundled Directus API proxy so browser CSP rules or tracking blockers are less likely to break avatars.

![Gravatar display in a Directus list view](https://raw.githubusercontent.com/wigandt-tech/directus-extension-gravatar/main/docs/screenshots/gravatar-display.svg)

## What's in the bundle

| Entry | Type | Use it for |
| --- | --- | --- |
| **Gravatar** | Display | Render an avatar from any string/email field in list and detail views, optionally with the email text next to it. |
| **Gravatar Proxy** | Endpoint | Serve Gravatar images through `/gravatar/avatar/:hash` on the Directus API. |

## Setup

### 1. Install the package

```bash
npm install directus-extension-gravatar
```

Restart Directus after installing or updating the package so the API endpoint is registered.

### 2. Set an email field to **Gravatar** display

Settings -> Data Model -> your collection -> email field -> Display -> **Gravatar**.

![Gravatar display options in Directus](https://raw.githubusercontent.com/wigandt-tech/directus-extension-gravatar/main/docs/screenshots/gravatar-interface.svg)

- **Size**: avatar size in pixels.
- **Shape**: circle, rounded, or square.
- **Default image**: Gravatar fallback image.
- **Rating**: maximum allowed Gravatar rating.
- **Show email**: render the normalized email next to the avatar.
- **Force default image**: always show the configured fallback image.

The display loads avatars from the bundled `/gravatar/avatar/:hash` endpoint. Invalid or missing values fall back to the Directus account icon.

## Development

```bash
npm install
npm run dev      # watch build
npm run build    # production build -> dist/
npm run check    # typecheck, tests, build, and package dry run
```

Then drop `dist/` into your Directus `extensions/` folder, or `npm run link` for local development.

Requires Directus host `^11` or `^12`.

## License

MIT
