// Simple test script for Atlantis API
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Atlantis API...\n');
  
  try {
    console.log('✓ Testing /api/health');
    const health = await makeRequest('/api/health');
    console.log(`  Status: ${health.status}`);
    console.log(`  Data: ${JSON.stringify(health.data, null, 2)}\n`);

    console.log('✓ Testing /api/v1/accommodations');
    const accs = await makeRequest('/api/v1/accommodations');
    console.log(`  Status: ${accs.status}`);
    console.log(`  Found ${accs.data.data?.length || 0} accommodations\n`);

    console.log('✓ Testing /api/v1/clients');
    const clients = await makeRequest('/api/v1/clients');
    console.log(`  Status: ${clients.status}`);
    console.log(`  Found ${clients.data.data?.length || 0} clients\n`);

    console.log('✓ Testing /api/v1/bookings');
    const bookings = await makeRequest('/api/v1/bookings');
    console.log(`  Status: ${bookings.status}`);
    console.log(`  Found ${bookings.data.data?.length || 0} bookings\n`);

    console.log('✅ All tests completed!');
  } catch(e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

runTests().then(() => process.exit(0));
