const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Match src, srcset, poster, href, url(...)
const regex = /(?:src|href|poster)=['"](\.[^'"]+)['"]|style=['"][^'"]*url\(['"]?(\.[^'"()]+)['"]?\)/g;
const missing = [];
let match;
while ((match = regex.exec(html)) !== null) {
  const ref = match[1] || match[2];
  const absPath = path.resolve(__dirname, ref);
  if (!fs.existsSync(absPath)) {
    missing.push({ ref, absPath });
  }
}

// Check srcset
const srcsetRegex = /srcset=['"]([^'"]+)['"]/g;
while ((match = srcsetRegex.exec(html)) !== null) {
  const parts = match[1].split(',').map(s => s.trim().split(/\s+/)[0]);
  for (const part of parts) {
    if (part.startsWith('.')) {
      const absPath = path.resolve(__dirname, part);
      if (!fs.existsSync(absPath)) {
        missing.push({ ref: part, absPath });
      }
    }
  }
}

console.log('Missing assets count:', missing.length);
if (missing.length > 0) {
  console.log('Missing:', missing);
} else {
  console.log('All local assets verified successfully!');
}
