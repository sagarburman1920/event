const fs = require('fs');
const path = require('path');

const originalHtml = fs.readFileSync(path.join(__dirname, 'original.html'), 'utf8');
const downloadedFiles = new Set(fs.readdirSync(path.join(__dirname, 'assets')));

let html = originalHtml;

// Strip query parameters from URLs pointing to wp-content
html = html.replace(/https:\/\/skt\.zaptriq\.in\/wp-content\/[^\s"'(),?#]+\/([^"'\s(),?#]+)(?:\?[^"'\s(),>]*)?/g, (match, filename) => {
  if (downloadedFiles.has(filename)) {
    return `./assets/${filename}`;
  }
  return match;
});

// Fix CSS and JS links to root files
html = html.replace(/<link rel='stylesheet' id='rr-landing-css' href='[^']+' media='all' \/>/, `<link rel="stylesheet" id="rr-landing-css" href="./landing.css" />`);
html = html.replace(/<link rel='stylesheet' id='rr-mobile-css' href='[^']+' media='all' \/>/, `<link rel="stylesheet" id="rr-mobile-css" href="./mobile.css" />`);
html = html.replace(/<script id="rr-secure-payments-js" src="[^"]+"><\/script>/, `<script id="rr-secure-payments-js" src="./checkout.js"></script>`);

// Remove Hostinger reach unused subscription block assets & scripts
html = html.replace(/<link rel='stylesheet' id='hostinger-reach-subscription-block-css'[^>]*\/>\s*/g, '');
html = html.replace(/<script id="hostinger-reach-subscription-block-view-js-extra">[\s\S]*?<\/script>\s*/g, '');
html = html.replace(/<script id="hostinger-reach-subscription-block-view-js"[^>]*><\/script>\s*/g, '');
html = html.replace(/<script[^>]*id="hostinger-reach-embed-js"[^>]*><\/script>\s*/g, '');

// Remove WordPress emoji loader & unused WP endpoints
html = html.replace(/<script id="wp-emoji-settings"[\s\S]*?<\/script>\s*<script type="module">[\s\S]*?<\/script>/g, '');
html = html.replace(/<link rel="https:\/\/api\.w\.org\/"[^>]*\/>\s*/g, '');
html = html.replace(/<link rel="alternate" title="JSON"[^>]*\/>\s*/g, '');
html = html.replace(/<link rel="alternate" title="oEmbed[^>]*\/>\s*/g, '');
html = html.replace(/<link rel="EditURI"[^>]*\/>\s*/g, '');
html = html.replace(/<meta name="generator" content="WordPress[^"]*" \/>\s*/g, '');
html = html.replace(/<link rel='shortlink'[^>]*\/>\s*/g, '');
html = html.replace(/<script type="speculationrules">[\s\S]*?<\/script>\s*/g, '');

// Video: remove 'muted' attribute, change preload to 'auto', ensure dual sources
html = html.replace(
  /<video\s+controls\s+autoplay\s+muted\s+playsinline\s+preload="metadata"/i,
  `<video controls autoplay playsinline preload="auto"`
);
html = html.replace(
  /<source src="[^"]*red-rega-workshop-hero\.mp4" type="video\/mp4">/g,
  `<source src="./assets/red-rega-workshop-hero.mp4" type="video/mp4">\n<source src="https://skt.zaptriq.in/wp-content/uploads/2026/09/red-rega-workshop-hero.mp4" type="video/mp4">`
);

// Canonical link to new subdomain
html = html.replace(/<link rel="canonical" href="https:\/\/skt\.zaptriq\.in\/" \/>/, `<link rel="canonical" href="https://event.sahayakbusinessclub.com/" />`);

// Update eventEnd in RRPayments so buttons are always bookable/interactive
html = html.replace(/"eventEnd":\d+/, `"eventEnd":253402300799`);

// Update Silver plan price to ₹3,499 (349900 paise)
html = html.replace(/"silver":\{"name":"Silver","amount":599900/g, `"silver":{"name":"Silver","amount":349900`);
html = html.replace(/<strong>₹5,999<\/strong>/g, `<strong>₹3,499</strong>`);
html = html.replace(/Book Silver · ₹5,999/g, `Book Silver · ₹3,499`);
html = html.replace(/Silver: ₹5,999/g, `Silver: ₹3,499`);
html = html.replace(/Passes from ₹5,999/g, `Passes from ₹3,499`);

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Built cleaned index.html successfully with canonical URL event.sahayakbusinessclub.com and Silver price ₹3,499!');
