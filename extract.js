const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\e17d629a-d759-42a2-941d-6ef7493d0dcd\\.system_generated\\steps\\2\\content.md';
const content = fs.readFileSync(srcPath, 'utf8');

const docTypeIdx = content.indexOf('<!doctype html>');
if (docTypeIdx === -1) {
  console.error('<!doctype html> not found');
  process.exit(1);
}

const html = content.slice(docTypeIdx);
fs.writeFileSync('C:\\Users\\hp\\.gemini\\antigravity\\scratch\\skt-landing-page\\original.html', html, 'utf8');
console.log('Saved original.html, length:', html.length);

// Extract all asset URLs
const urlRegex = /(https:\/\/[^"'()\s>]+\.(?:webp|png|jpg|jpeg|svg|mp4|css|js))/gi;
const matches = new Set();
let m;
while ((m = urlRegex.exec(html)) !== null) {
  matches.add(m[1]);
}

console.log('Found assets count:', matches.size);
fs.writeFileSync('C:\\Users\\hp\\.gemini\\antigravity\\scratch\\skt-landing-page\\assets_list.json', JSON.stringify(Array.from(matches), null, 2), 'utf8');
