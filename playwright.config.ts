import { defineConfig } from '@playwright/test';

export default defineConfig({
	testMatch: '**/*.e2e.{ts,js}',
	webServer: { command: 'npm run build && npm run preview', port: 4173 }
});
