const fs = require('fs');
const path = require('path');

const videoPath = path.join(__dirname, 'assets', 'red-rega-workshop-hero.mp4');
const stats = fs.statSync(videoPath);
console.log('Video file size on disk:', stats.size);

// Read MP4 atoms to verify moov/mdat
const fd = fs.openSync(videoPath, 'r');
const buf = Buffer.alloc(1024 * 1024); // 1MB
fs.readSync(fd, buf, 0, buf.length, 0);

console.log('First 16 bytes (hex):', buf.subarray(0, 16).toString('hex'));
console.log('FTYP signature:', buf.subarray(4, 8).toString('ascii'));

// Check for moov atom in first 1MB or search end
let foundMoov = false;
let foundMdat = false;
let offset = 0;
while (offset < stats.size) {
  const header = Buffer.alloc(8);
  fs.readSync(fd, header, 0, 8, offset);
  const size = header.readUInt32BE(0);
  const type = header.subarray(4, 8).toString('ascii');
  console.log(`Atom '${type}' at offset ${offset}, size ${size}`);
  if (type === 'moov') foundMoov = true;
  if (type === 'mdat') foundMdat = true;
  if (size === 0) break; // extends to EOF
  if (size === 1) { // 64-bit size
    const extSize = Buffer.alloc(8);
    fs.readSync(fd, extSize, 0, 8, offset + 8);
    const bigSize = Number(extSize.readBigUInt64BE(0));
    offset += bigSize;
  } else {
    offset += size;
  }
}
fs.closeSync(fd);

console.log(`Found moov: ${foundMoov}, found mdat: ${foundMdat}`);
