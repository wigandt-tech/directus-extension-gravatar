import { defineEndpoint } from '@directus/extensions-sdk';
import { gravatarUrl, type GravatarDefaultImage, type GravatarRating } from '../shared/gravatar';

const defaultImages = new Set<GravatarDefaultImage>([
	'404',
	'mp',
	'identicon',
	'monsterid',
	'wavatar',
	'retro',
	'robohash',
	'blank',
]);

const ratings = new Set<GravatarRating>(['g', 'pg', 'r', 'x']);

function queryValue(value: unknown): string | undefined {
	if (Array.isArray(value)) return queryValue(value[0]);
	return typeof value === 'string' ? value : undefined;
}

function defaultImage(value: unknown): GravatarDefaultImage {
	const candidate = queryValue(value);
	return candidate && defaultImages.has(candidate as GravatarDefaultImage) ? (candidate as GravatarDefaultImage) : 'mp';
}

function rating(value: unknown): GravatarRating {
	const candidate = queryValue(value);
	return candidate && ratings.has(candidate as GravatarRating) ? (candidate as GravatarRating) : 'g';
}

function size(value: unknown): number | undefined {
	const candidate = Number(queryValue(value));
	return Number.isFinite(candidate) ? candidate : undefined;
}

export default defineEndpoint((router, { logger }) => {
	router.get('/avatar/:hash', async (req: any, res: any) => {
		const hash = String(req.params.hash ?? '').toLowerCase();

		if (!/^[a-f0-9]{64}$/.test(hash)) {
			res.status(400).send('Invalid Gravatar hash');
			return;
		}

		const response = await fetch(
			gravatarUrl(hash, {
				size: size(req.query.s),
				defaultImage: defaultImage(req.query.d),
				rating: rating(req.query.r),
				forceDefault: queryValue(req.query.f) === 'y',
			}),
		);

		if (!response.ok) {
			logger.warn(`Gravatar responded with ${response.status} for ${hash}`);
			res.sendStatus(response.status);
			return;
		}

		const contentType = response.headers.get('content-type') ?? 'image/jpeg';
		const buffer = Buffer.from(await response.arrayBuffer());

		res.setHeader('Cache-Control', 'public, max-age=300');
		res.setHeader('Content-Type', contentType);
		res.send(buffer);
	});
});
