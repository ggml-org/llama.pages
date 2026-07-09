import { describe, expect, it } from 'vitest';
import { isLoopback, llamaServerLabel, parseLlamaServerInput } from '$lib/docs/llama-app';

describe('parseLlamaServerInput', () => {
	it('accepts bare ports', () => {
		expect(parseLlamaServerInput('8080')).toBe('http://localhost:8080');
		expect(parseLlamaServerInput(' 51814 ')).toBe('http://localhost:51814');
	});

	it('rejects out-of-range ports', () => {
		expect(parseLlamaServerInput('0')).toBeNull();
		expect(parseLlamaServerInput('65536')).toBeNull();
	});

	it('accepts URLs with and without protocol', () => {
		expect(parseLlamaServerInput('https://llama.example.com')).toBe('https://llama.example.com');
		expect(parseLlamaServerInput('llama.example.com')).toBe('https://llama.example.com');
		expect(parseLlamaServerInput('http://192.168.1.10:8080')).toBe('http://192.168.1.10:8080');
		expect(parseLlamaServerInput('http://localhost:9090')).toBe('http://localhost:9090');
	});

	it('strips trailing slashes and keeps paths', () => {
		expect(parseLlamaServerInput('https://llama.example.com/')).toBe('https://llama.example.com');
		expect(parseLlamaServerInput('https://example.com/llama')).toBe('https://example.com/llama');
	});

	it('rejects port typos and single-label garbage', () => {
		expect(parseLlamaServerInput('8080dqwd')).toBeNull();
		expect(parseLlamaServerInput('not a url at all::')).toBeNull();
		expect(parseLlamaServerInput('foo')).toBeNull();
		expect(parseLlamaServerInput('')).toBeNull();
	});
});

describe('isLoopback', () => {
	it('detects loopback hosts', () => {
		expect(isLoopback('http://localhost:8080')).toBe(true);
		expect(isLoopback('http://127.0.0.1:8080')).toBe(true);
		expect(isLoopback('https://llama.example.com')).toBe(false);
	});
});

describe('llamaServerLabel', () => {
	it('shows :port locally and hostname remotely', () => {
		expect(llamaServerLabel('http://localhost:8080')).toBe(':8080');
		expect(llamaServerLabel('https://llama.example.com')).toBe('llama.example.com');
	});
});
