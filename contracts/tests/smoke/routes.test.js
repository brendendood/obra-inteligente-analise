/**
 * SMOKE TEST: Route Responses
 * Validates that main routes respond with expected status codes
 * Tests against local dev server (assumes running on localhost:8080)
 */

const BASE_URL = process.env.SMOKE_TEST_URL || 'http://localhost:8080';

const routes = [
  {
    path: '/',
    name: 'Home/Dashboard',
    expectedStatuses: [200, 401, 403] // Allow auth redirects
  },
  {
    path: '/login',
    name: 'Login Page',
    expectedStatuses: [200]
  },
  {
    path: '/register',
    name: 'Register Page',
    expectedStatuses: [200]
  },
  {
    path: '/projects',
    name: 'Projects List',
    expectedStatuses: [200, 401, 403] // May require auth
  },
  {
    path: '/admin',
    name: 'Admin Panel',
    expectedStatuses: [200, 401, 403] // Likely requires special auth
  }
];

async function testRoute(route) {
  try {
    const response = await fetch(`${BASE_URL}${route.path}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'MadenAI-SmokeTest/1.0',
        'Accept': 'text/html,application/json'
      },
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    const status = response.status;
    const isExpected = route.expectedStatuses.includes(status);
    
    return {
      status: isExpected ? 'PASS' : 'FAIL',
      code: status,
      message: isExpected 
        ? `Returned expected status ${status}`
        : `Unexpected status ${status}, expected one of: ${route.expectedStatuses.join(', ')}`
    };
  } catch (error) {
    return {
      status: 'FAIL',
      code: 'ERROR',
      message: `Request failed: ${error.message}`
    };
  }
}

async function runRouteTests() {
  console.log('🧪 SMOKE TEST: Route Responses\n');
  console.log(`Testing against: ${BASE_URL}\n`);
  
  let passed = 0;
  let failed = 0;
  
  for (const route of routes) {
    process.stdout.write(`Testing ${route.name} (${route.path})... `);
    
    const result = await testRoute(route);
    
    if (result.status === 'PASS') {
      console.log(`✅ ${result.message}`);
      passed++;
    } else {
      console.log(`❌ ${result.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  Note: Some failures may be expected (e.g., auth required)');
    console.log('Review individual test results above.');
  }
  
  return { passed, failed };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runRouteTests().catch(console.error);
}

export { runRouteTests };