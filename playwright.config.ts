import { defineConfig } from '@playwright/test';

export default defineConfig({
	testMatch: '**/*.e2e.{ts,js}',
	use: { baseURL: 'http://localhost:4173' },
	webServer: { command: 'npm run build && npm run preview', port: 4173 }
});
