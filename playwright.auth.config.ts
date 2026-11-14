import { defineConfig } from '@playwright/test';
import base from './playwright.static.config';
export default defineConfig({ ...base, testDir: './tests/auth', outputDir: './test-results/auth', workers: 2 });
