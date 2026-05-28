import { createHash } from 'node:crypto';
import { defineHook } from '@directus/extensions-sdk';

type HookContext = {
	services: {
		FilesService?: new (...args: any[]) => any;
		UsersService?: new (...args: any[]) => any;
	};
	logger?: {
		debug?: (message: string) => void;
		warn?: (message: string) => void;
	};
};

type EventContext = {
	database?: unknown;
	schema?: unknown;
};

type UserRecord = {
	id: string;
	email?: string | null;
	avatar?: string | null;
};

const enabledValues = new Set(['1', 'true', 'yes', 'on']);

function envFlag(name: string, fallback = false): boolean {
	const raw = process.env[name];
	if (raw == null) return fallback;
	return enabledValues.has(raw.toLowerCase());
}

function envString(name: string, fallback: string): string {
	const raw = process.env[name];
	return raw && raw.trim() ? raw.trim() : fallback;
}

function envNumber(name: string, fallback: number): number {
	const raw = Number(process.env[name]);
	if (!Number.isFinite(raw)) return fallback;
	return Math.min(Math.max(Math.round(raw), 1), 2048);
}

function normalizeEmail(value: unknown): string | null {
	if (typeof value !== 'string') return null;

	const normalized = value.trim().toLowerCase();
	return normalized.includes('@') ? normalized : null;
}

function gravatarUrl(email: string): string {
	const hash = createHash('sha256').update(email).digest('hex');
	const params = new URLSearchParams({
		s: String(envNumber('GRAVATAR_USER_AVATAR_SIZE', 512)),
		d: envString('GRAVATAR_USER_AVATAR_DEFAULT', '404'),
		r: envString('GRAVATAR_USER_AVATAR_RATING', 'g'),
	});

	return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
}

async function syncUserAvatar(userId: string, eventContext: EventContext, hookContext: HookContext) {
	if (!envFlag('GRAVATAR_SYNC_USER_AVATARS')) return;

	const { FilesService, UsersService } = hookContext.services;
	if (!FilesService || !UsersService) return;

	const serviceOptions = {
		schema: eventContext.schema,
		knex: eventContext.database,
		accountability: null,
	};

	const usersService = new UsersService(serviceOptions);
	const user = (await usersService.readOne(userId, { fields: ['id', 'email', 'avatar'] })) as UserRecord;
	const email = normalizeEmail(user.email);

	if (!email) return;
	if (user.avatar && !envFlag('GRAVATAR_OVERWRITE_USER_AVATARS')) return;

	const filesService = new FilesService(serviceOptions);
	const fileId = await filesService.importOne(gravatarUrl(email), {
		title: `${envString('GRAVATAR_USER_AVATAR_TITLE_PREFIX', 'Gravatar')} ${email}`,
		filename_download: `gravatar-${user.id}.png`,
		description: `Imported from Gravatar for ${email}.`,
	});

	await usersService.updateOne(
		user.id,
		{
			avatar: fileId,
		},
		{
			emitEvents: false,
		},
	);
}

function userIdsFromEvent(event: Record<string, any>): string[] {
	if (typeof event.key === 'string') return [event.key];
	if (typeof event.key === 'number') return [String(event.key)];
	if (Array.isArray(event.keys)) return event.keys.map(String);
	return [];
}

export default defineHook((register, hookContext: HookContext) => {
	async function handleUserEvent(event: Record<string, any>, eventContext: EventContext) {
		if (event.collection && event.collection !== 'directus_users') return;
		if (event.payload && !('email' in event.payload) && !envFlag('GRAVATAR_SYNC_USER_AVATARS_ON_ANY_UPDATE')) return;

		for (const userId of userIdsFromEvent(event)) {
			try {
				await syncUserAvatar(userId, eventContext, hookContext);
			} catch (error) {
				hookContext.logger?.debug?.(
					`Could not sync Gravatar avatar for Directus user ${userId}: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		}
	}

	register.action('users.create', handleUserEvent);
	register.action('users.update', handleUserEvent);
	register.action('items.create', handleUserEvent);
	register.action('items.update', handleUserEvent);
});
