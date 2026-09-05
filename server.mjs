import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(root, 'public');
const port = Number(process.env.PORT || 3000);
const mime = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'], ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'], ['.png', 'image/png'], ['.webp', 'image/webp'],
  ['.webmanifest', 'application/manifest+json'], ['.txt', 'text/plain; charset=utf-8']
]);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    setSecurityHeaders(res);
    const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const safe = path.normalize(relative).replace(/^([.][.][/\\])+/, '');
    const file = path.join(publicRoot, safe);
    if (!file.startsWith(publicRoot)) return send(res, 403, 'Forbidden');
    const data = await fs.readFile(file);
    const extension = path.extname(file).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', mime.get(extension) || 'application/octet-stream');
    res.setHeader('Cache-Control', ['.html', '.css', '.js', '.webmanifest'].includes(extension) ? 'no-store' : 'public, max-age=3600');
    res.setHeader('Content-Length', String(data.byteLength));
    res.end(data);
  } catch (error) {
    if (error?.code === 'ENOENT') return send(res, 404, 'Not found');
    console.error(error);
    return send(res, 500, 'Server error');
  }
});

server.on('error', (error) => {
  if (error?.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Run PORT=3001 npm run dev, or stop the existing server.`);
    process.exitCode = 1;
    return;
  }
  throw error;
});

server.listen(port, () => console.log(`Customer Segment Studio flagship site running at http://localhost:${port}`));

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}
function send(res, status, body) { res.statusCode = status; res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.end(body); }
