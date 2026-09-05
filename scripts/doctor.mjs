import http from 'node:http';
const port = Number(process.env.PORT || 3000);
const paths = ['/', '/styles.css?v=0.3.7', '/app.js?v=0.3.7', '/assets/screens/living-map-growing-buyers.webp', '/assets/characters/tiles/best-customers.webp', '/assets/characters/portraits/best-customers.webp'];
for (const path of paths) {
  const result = await request(path);
  if (result.status !== 200) throw new Error(`${path} returned ${result.status}`);
  console.log(`${path} -> ${result.status} ${result.type}`);
}
function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path }, (res) => {
      res.resume(); res.on('end', () => resolve({ status: res.statusCode, type: res.headers['content-type'] }));
    });
    req.on('error', reject);
  });
}
