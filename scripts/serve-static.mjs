import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('out');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2' };
createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + sep)) { res.writeHead(400); res.end(); return; }
    for (const path of [target, target + '.html', resolve(target, 'index.html')]) {
      if ((await stat(path).catch(() => null))?.isFile()) {
        const data = await readFile(path);
        res.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream' });
        res.end(req.method === 'HEAD' ? undefined : data); return;
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(resolve(root, '404.html')));
  } catch { res.writeHead(400); res.end('Bad request'); }
}).listen(3418, '127.0.0.1', () => console.log('Static demo QA: http://127.0.0.1:3418'));
