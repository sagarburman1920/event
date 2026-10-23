const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqUrl = decodeURI(req.url.split('?')[0]);
  if (reqUrl === '/') reqUrl = '/index.html';
  const filePath = path.join(__dirname, reqUrl);

  // Security check to keep inside root
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support video streaming ranges for mp4
    if (ext === '.mp4') {
      const range = req.headers.range;
      const fileSize = stats.size;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10) || 0;
        let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        if (end >= fileSize) end = fileSize - 1;

        if (start >= fileSize || start > end) {
          res.writeHead(416, {
            'Content-Range': `bytes */${fileSize}`,
            'Content-Type': 'video/mp4'
          });
          return res.end();
        }

        const chunksize = (end - start) + 1;
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        const file = fs.createReadStream(filePath, { start, end });
        req.on('close', () => file.destroy());
        file.on('error', () => { if (!res.writableEnded) res.end(); });
        file.pipe(res);
        return;
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes'
        };
        res.writeHead(200, head);
        const file = fs.createReadStream(filePath);
        req.on('close', () => file.destroy());
        file.on('error', () => { if (!res.writableEnded) res.end(); });
        file.pipe(res);
        return;
      }
    }

    res.writeHead(200, { 'Content-Type': contentType });
    const file = fs.createReadStream(filePath);
    req.on('close', () => file.destroy());
    file.on('error', () => { if (!res.writableEnded) res.end(); });
    file.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
