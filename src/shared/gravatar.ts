export type GravatarDefaultImage =
	| '404'
	| 'mp'
	| 'identicon'
	| 'monsterid'
	| 'wavatar'
	| 'retro'
	| 'robohash'
	| 'blank';

export type GravatarRating = 'g' | 'pg' | 'r' | 'x';

export type GravatarOptions = {
	size?: number;
	defaultImage?: GravatarDefaultImage;
	rating?: GravatarRating;
	forceDefault?: boolean;
};

export function normalizeEmail(value: unknown): string | null {
	if (Array.isArray(value)) {
		for (const item of value) {
			const normalized = normalizeEmail(item);
			if (normalized) return normalized;
		}

		return null;
	}

	if (typeof value !== 'string') return null;

	const normalized = value.trim().toLowerCase();
	return normalized.includes('@') ? normalized : null;
}

export async function sha256Hex(value: string): Promise<string> {
	const data = new TextEncoder().encode(value);
	const buffer = await crypto.subtle.digest('SHA-256', data);

	return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function clampSize(value: unknown, fallback = 80): number {
	const number = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(number)) return fallback;
	return Math.min(Math.max(Math.round(number), 1), 2048);
}

export function gravatarUrl(hash: string, options: GravatarOptions = {}): string {
	const params = new URLSearchParams();
	params.set('s', String(clampSize(options.size)));
	params.set('d', options.defaultImage ?? 'mp');
	params.set('r', options.rating ?? 'g');

	if (options.forceDefault) params.set('f', 'y');

	return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
}

export function gravatarProxyUrl(hash: string, options: GravatarOptions = {}): string {
	const params = new URLSearchParams();
	params.set('s', String(clampSize(options.size)));
	params.set('d', options.defaultImage ?? 'mp');
	params.set('r', options.rating ?? 'g');

	if (options.forceDefault) params.set('f', 'y');

	return `/gravatar/avatar/${hash}?${params.toString()}`;
}

export async function gravatarUrlForEmail(email: unknown, options: GravatarOptions = {}): Promise<string | null> {
	const normalized = normalizeEmail(email);
	if (!normalized) return null;

	return gravatarUrl(await sha256Hex(normalized), options);
}

export async function gravatarProxyUrlForEmail(email: unknown, options: GravatarOptions = {}): Promise<string | null> {
	const normalized = normalizeEmail(email);
	if (!normalized) return null;

	return gravatarProxyUrl(await sha256Hex(normalized), options);
}
