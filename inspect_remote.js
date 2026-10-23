const https = require('https');

https.get('https://event.sahayakbusinessclub.com', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const generator = body.match(/<meta name="generator" content="([^"]+)"/);
    console.log('Generator:', generator ? generator[1] : 'Unknown');
    const theme = body.match(/\/wp-content\/themes\/([^/]+)/);
    console.log('Theme:', theme ? theme[1] : 'Unknown');
    const title = body.match(/<title>([^<]+)<\/title>/);
    console.log('Title:', title ? title[1] : 'Unknown');
  });
});
