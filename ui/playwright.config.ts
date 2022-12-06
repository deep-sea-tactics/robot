import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'yarn dev',
		reuseExistingServer: true,
		port: 4000,
	},
};

export default config;
