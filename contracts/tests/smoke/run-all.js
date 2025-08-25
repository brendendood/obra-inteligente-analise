/**
 * SMOKE TEST RUNNER
 * Executes all smoke tests in sequence
 */

import { runImportTests } from './imports.test.js';
import { runRouteTests } from './routes.test.js';

async function runAllSmokeTests() {
  console.log('🔥 MadenAI Smoke Tests\n');
  console.log('Running isolated tests with no side effects...\n');
  
  const results = {
    imports: { passed: 0, failed: 0 },
    routes: { passed: 0, failed: 0 }
  };
  
  try {
    // Test 1: Module Imports
    console.log('=' .repeat(50));
    await runImportTests();
    results.imports.passed = 1; // If we get here, imports passed
    console.log();
    
    // Test 2: Route Responses
    console.log('=' .repeat(50));
    const routeResults = await runRouteTests();
    results.routes = routeResults;
    console.log();
    
    // Summary
    console.log('=' .repeat(50));
    console.log('🎯 SMOKE TEST SUMMARY');
    console.log('=' .repeat(50));
    console.log(`📦 Module Imports: ${results.imports.passed > 0 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🌐 Route Responses: ${results.routes.passed} passed, ${results.routes.failed} failed`);
    
    const totalPassed = results.imports.passed + results.routes.passed;
    const totalFailed = results.imports.failed + results.routes.failed;
    
    console.log(`\n🎉 Total: ${totalPassed} passed, ${totalFailed} failed`);
    
    if (totalFailed > 0) {
      console.log('\n⚠️  Some tests failed. Review results above.');
      process.exit(1);
    } else {
      console.log('\n✨ All smoke tests passed!');
    }
    
  } catch (error) {
    console.error('\n💥 Smoke test execution failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllSmokeTests();
}

export { runAllSmokeTests };