# Directus Gravatar

A Directus **bundle** that adds Gravatar support for email fields and Directus user profiles.

## What's in the bundle

| Entry | Type | Use it for |
| --- | --- | --- |
| **Gravatar** | Display | Render an avatar from any string/email field in list and detail views. |
| **Gravatar Email** | Interface | Edit an email field with a live Gravatar preview. |
| **Gravatar User Avatar** | Hook | Optionally import a user's Gravatar into `directus_users.avatar`, so Directus' own user profile UI can use it. |
| **Gravatar Proxy** | Endpoint | Serve Gravatar images through the Directus API to avoid browser CSP or tracking-blocker issues. |

Gravatar URLs are generated from the lowercased, trimmed email address using SHA-256.

## Installation

```bash
npm install directus-extension-gravatar
```

Restart Directus after installing the package.

## Email field usage

For any email field:

1. Set the display to **Gravatar** to show an avatar in layouts.
2. Optionally set the interface to **Gravatar Email** to keep the normal email input and show a live preview while editing.

The display and interface support size, rating, and default image options.

The app components load avatars from the bundled `/gravatar/avatar/:hash` endpoint. Restart Directus after installing or updating the extension so the API endpoint is registered.

## Directus user profile avatars

Directus' built-in user profile uses `directus_users.avatar`, not the display configured on the `email` field. Enable the bundled hook to import Gravatar images into that avatar field:

```env
GRAVATAR_SYNC_USER_AVATARS=true
```

By default, the hook only fills users without an avatar and only imports when Gravatar returns a real image (`d=404`). Useful options:

```env
GRAVATAR_SYNC_USER_AVATARS=true
GRAVATAR_OVERWRITE_USER_AVATARS=false
GRAVATAR_USER_AVATAR_SIZE=512
GRAVATAR_USER_AVATAR_DEFAULT=404
GRAVATAR_USER_AVATAR_RATING=g
GRAVATAR_USER_AVATAR_TITLE_PREFIX=Gravatar
```

Set `GRAVATAR_OVERWRITE_USER_AVATARS=true` if email changes should replace existing avatars. Set `GRAVATAR_USER_AVATAR_DEFAULT=mp` or another Gravatar default if you want Directus to store fallback avatars too.

## Development

```bash
npm install
npm run dev      # watch build
npm run build    # production build -> dist/
npm run check    # typecheck, tests, build, and package dry run
```

Requires Directus host `^11` or `^12`.

## Release

CI runs on pull requests and pushes to `main`. Release Please opens release PRs from conventional commits, and published GitHub releases trigger npm publishing through Trusted Publishing with provenance.

## License

MIT
