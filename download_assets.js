const fs = require('fs');
const path = require('path');
const https = require('https');

const assets = JSON.parse(fs.readFileSync('C:\\Users\\hp\\.gemini\\antigravity\\scratch\\skt-landing-page\\assets_list.json', 'utf8'));
const assetsDir = 'C:\\Users\\hp\\.gemini\\antigravity\\scratch\\skt-landing-page\\assets';
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      return resolve({ url, success: true, cached: true });
    }
    const file = fs.createWriteStream(dest);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 20000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return resolve({ url, success: false, status: res.statusCode });
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve({ url, success: true, size: fs.statSync(dest).size }));
      });
    });
    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve({ url, success: false, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve({ url, success: false, error: 'Timeout' });
    });
  });
}

async function run() {
  console.log(`Starting download of ${assets.length} assets...`);
  // Exclude .mp4 from immediate batch if large, we can test it separately
  const images = assets.filter(u => !u.endsWith('.mp4'));
  const mp4s = assets.filter(u => u.endsWith('.mp4'));

  // Batch download images (concurrency 8)
  const pool = 8;
  const results = [];
  for (let i = 0; i < images.length; i += pool) {
    const chunk = images.slice(i, i + pool);
    const chunkResults = await Promise.all(chunk.map(u => {
      const filename = path.basename(new URL(u).pathname);
      const dest = path.join(assetsDir, filename);
      return download(u, dest);
    }));
    results.push(...chunkResults);
    console.log(`Downloaded ${Math.min(i + pool, images.length)} / ${images.length}`);
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`Finished images download: ${successCount} succeeded, ${results.length - successCount} failed.`);

  console.log('Testing MP4 download...');
  for (const mp4Url of mp4s) {
    const filename = path.basename(new URL(mp4Url).pathname);
    const dest = path.join(assetsDir, filename);
    const res = await download(mp4Url, dest);
    console.log('MP4 result:', res);
  }
}

run();
