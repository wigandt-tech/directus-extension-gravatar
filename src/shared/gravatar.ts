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

const emailPattern = /[^\s<>"()[\]{},;:]+@[^\s<>"()[\]{},;:]+/;
const preferredEmailKeys = ['email', 'email_address', 'emailAddress', 'mail'];

function normalizeEmailValue(value: unknown, seen: WeakSet<object>): string | null {
	if (Array.isArray(value)) {
		for (const item of value) {
			const normalized = normalizeEmailValue(item, seen);
			if (normalized) return normalized;
		}

		return null;
	}

	if (value && typeof value === 'object') {
		if (seen.has(value)) return null;
		seen.add(value);

		const record = value as Record<string, unknown>;

		for (const key of preferredEmailKeys) {
			const normalized = normalizeEmailValue(record[key], seen);
			if (normalized) return normalized;
		}

		for (const item of Object.values(record)) {
			const normalized = normalizeEmailValue(item, seen);
			if (normalized) return normalized;
		}

		return null;
	}

	if (typeof value !== 'string') return null;

	const normalized = value.trim().toLowerCase();

	if (normalized.startsWith('[') || normalized.startsWith('{') || normalized.startsWith('"')) {
		try {
			const parsed = JSON.parse(normalized) as unknown;
			const parsedEmail = normalizeEmailValue(parsed, seen);
			if (parsedEmail) return parsedEmail;
		} catch {
			// Fall through to loose extraction for display values that only look JSON-like.
		}
	}

	const match = normalized.match(emailPattern);

	return match?.[0] ?? null;
}

export function normalizeEmail(value: unknown): string | null {
	return normalizeEmailValue(value, new WeakSet());
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

export async function gravatarUrlForEmail(email: unknown, options: GravatarOptions = {}): Promise<string | null> {
	const normalized = normalizeEmail(email);
	if (!normalized) return null;

	return gravatarUrl(await sha256Hex(normalized), options);
}
