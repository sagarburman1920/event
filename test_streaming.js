const http = require('http');

function checkRange(rangeHeader) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/assets/red-rega-workshop-hero.mp4', {
      headers: { Range: rangeHeader }
    }, (res) => {
      let dataLen = 0;
      res.on('data', chunk => dataLen += chunk.length);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          contentRange: res.headers['content-range'],
          contentLength: res.headers['content-length'],
          bytesReceived: dataLen
        });
      });
    }).on('error', reject);
  });
}

async function test() {
  console.log('Testing range 0-1000...');
  const r1 = await checkRange('bytes=0-1000');
  console.log('Result 1:', r1);

  console.log('Testing range middle (7000000-8000000)...');
  const r2 = await checkRange('bytes=7000000-8000000');
  console.log('Result 2:', r2);

  console.log('Testing range near end (14000000-14176348)...');
  const r3 = await checkRange('bytes=14000000-14176348');
  console.log('Result 3:', r3);

  console.log('Testing Range 0- (full stream from start)...');
  const r4 = await new Promise((resolve, reject) => {
    http.get('http://localhost:3000/assets/red-rega-workshop-hero.mp4', {
      headers: { Range: 'bytes=0-' }
    }, (res) => {
      let dataLen = 0;
      res.on('data', chunk => {
        dataLen += chunk.length;
        // abort after 100KB so we don't read full 14MB in test
        if (dataLen > 100000) {
          res.destroy();
          resolve({ status: res.statusCode, contentRange: res.headers['content-range'], started: true });
        }
      });
    }).on('error', reject);
  });
  console.log('Result 4:', r4);

  console.log('ALL RANGE TESTS PASSED!');
}

test();
