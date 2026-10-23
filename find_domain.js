const fs = require('fs');
const html = fs.readFileSync('C:/Users/hp/.gemini/antigravity/scratch/skt-landing-page/index.html', 'utf8');
const matches = [...html.matchAll(/https:\/\/(?:skt\.zaptriq\.in)[^\s"'>]*/g)].map(m => m[0]);
console.log('Occurrences of skt.zaptriq.in in index.html:', Array.from(new Set(matches)));
