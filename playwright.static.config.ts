import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({
  ...base,
  webServer: {
    command: "node scripts/serve-static.mjs",
    url: "http://127.0.0.1:3418/",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
