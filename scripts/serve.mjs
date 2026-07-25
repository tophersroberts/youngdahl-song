import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const safe = normalize(pathname).replace(/^\.\.\/?/, '');
  let file = join(root, safe);
  if (pathname.endsWith('/')) file = join(file, 'index.html');
  if (existsSync(file) && statSync(file).isFile()) { response.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }); createReadStream(file).pipe(response); return; }
  response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); response.end('Not found');
}).listen(4321, () => console.log('Young-Dahl Song Archive: http://localhost:4321'));
