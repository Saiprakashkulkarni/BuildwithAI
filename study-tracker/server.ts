import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = join(process.cwd(), 'public');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.jsx': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  try {
    const url = req.url === '/' || req.url?.startsWith('/?') ? '/index.html' : (req.url?.split('?')[0] || '');
    let filePath = join(PUBLIC_DIR, url);
    let ext = extname(filePath).toLowerCase();

    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // SPA Fallback
      try {
        const content = await readFile(join(PUBLIC_DIR, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      } catch (err) {
        res.writeHead(404);
        res.end('Not Found');
      }
    } else {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
