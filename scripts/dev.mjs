import { spawn } from 'node:child_process';
// Accept both Next's CLI arguments and the preview host's common dev-server flags.
const args = process.argv.slice(2).filter((arg) => arg !== '--strictPort').map((arg) => arg === '--host' ? '--hostname' : arg);
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...args], { stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
server.on('exit', (code) => process.exit(code ?? 1));
