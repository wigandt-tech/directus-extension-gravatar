import { describe, expect, it } from 'vitest';
import { gravatarUrl, gravatarUrlForEmail, normalizeEmail, sha256Hex } from './gravatar';

describe('normalizeEmail', () => {
	it('trims and lowercases valid email values', () => {
		expect(normalizeEmail(' User@Example.COM ')).toBe('user@example.com');
	});

	it('preserves apostrophes in valid email local parts', () => {
		expect(normalizeEmail(" O'Hara@Example.COM ")).toBe("o'hara@example.com");
	});

	it('uses the first valid email from array values', () => {
		expect(normalizeEmail([null, 'not-an-email', ' User@Example.COM '])).toBe('user@example.com');
	});

	it('extracts emails from JSON-like string values', () => {
		expect(normalizeEmail('["User@Example.COM"]')).toBe('user@example.com');
		expect(normalizeEmail('["O\'Hara@Example.COM"]')).toBe("o'hara@example.com");
	});

	it('uses the first valid email from relation object values', () => {
		expect(normalizeEmail([{ id: 1, email: null }, { id: 2, email: ' User@Example.COM ' }])).toBe('user@example.com');
	});

	it('finds emails in nested relation values', () => {
		expect(normalizeEmail({ contact: { details: { mail: ' User@Example.COM ' } } })).toBe('user@example.com');
	});

	it('rejects empty and non-email values', () => {
		expect(normalizeEmail('')).toBeNull();
		expect(normalizeEmail('not-an-email')).toBeNull();
		expect(normalizeEmail(['', 'not-an-email'])).toBeNull();
		expect(normalizeEmail(null)).toBeNull();
	});
});

describe('sha256Hex', () => {
	it('matches the documented SHA-256 hash for a normalized email', async () => {
		expect(await sha256Hex('myemailaddress@example.com')).toBe(
			'84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee',
		);
	});
});

describe('gravatarUrl', () => {
	it('builds a Gravatar image URL', () => {
		expect(gravatarUrl('abc', { size: 96, defaultImage: 'identicon', rating: 'pg', forceDefault: true })).toBe(
			'https://gravatar.com/avatar/abc?s=96&d=identicon&r=pg&f=y',
		);
	});

	it('builds a Gravatar URL from an email', async () => {
		await expect(gravatarUrlForEmail('MyEmailAddress@example.com ', { size: 200, defaultImage: '404' })).resolves.toBe(
			'https://gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee?s=200&d=404&r=g',
		);
	});
});
