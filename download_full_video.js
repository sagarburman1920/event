const fs = require('fs');
const path = require('path');
const https = require('https');

const targetUrl = 'https://skt.zaptriq.in/wp-content/uploads/2026/09/red-rega-workshop-hero.mp4';
const destPath = path.join(__dirname, 'assets', 'red-rega-workshop-hero.mp4');
const tempPath = destPath + '.tmp';

console.log('Downloading full video from:', targetUrl);

function download() {
  const file = fs.createWriteStream(tempPath);
  const req = https.get(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }, (res) => {
    if (res.statusCode !== 200) {
      console.error('Failed with status:', res.statusCode);
      process.exit(1);
    }
    const total = parseInt(res.headers['content-length'], 10);
    console.log('Total content-length expected:', total);

    let downloaded = 0;
    let lastLog = 0;
    res.on('data', (chunk) => {
      downloaded += chunk.length;
      if (downloaded - lastLog > 1024 * 1024 || downloaded === total) {
        lastLog = downloaded;
        const pct = ((downloaded / total) * 100).toFixed(1);
        console.log(`Progress: ${(downloaded / (1024 * 1024)).toFixed(2)} MB / ${(total / (1024 * 1024)).toFixed(2)} MB (${pct}%)`);
      }
    });

    res.pipe(file);

    file.on('finish', () => {
      file.close(() => {
        const finalSize = fs.statSync(tempPath).size;
        console.log('Downloaded size:', finalSize);
        if (finalSize === total) {
          if (fs.existsSync(destPath)) {
            fs.unlinkSync(destPath);
          }
          fs.renameSync(tempPath, destPath);
          console.log('SUCCESS! Complete video replaced at:', destPath);
          process.exit(0);
        } else {
          console.error('Size mismatch! Expected', total, 'got', finalSize);
          process.exit(1);
        }
      });
    });
  });

  req.on('error', (err) => {
    console.error('Request error:', err);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    process.exit(1);
  });
}

download();
