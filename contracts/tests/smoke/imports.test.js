/**
 * SMOKE TEST: Module Importability
 * Validates that public modules can be imported without errors
 */

// Test critical public modules
const tests = [
  {
    name: 'Security Validation Utils',
    test: async () => {
      try {
        const { validateEmail, validateProjectName, RateLimiter } = await import('../../../src/utils/securityValidation.js');
        if (typeof validateEmail !== 'function') throw new Error('validateEmail not a function');
        if (typeof validateProjectName !== 'function') throw new Error('validateProjectName not a function');
        if (typeof RateLimiter !== 'function') throw new Error('RateLimiter not a constructor');
        return { status: 'PASS', message: 'All security validation functions imported' };
      } catch (error) {
        return { status: 'FAIL', message: `Import failed: ${error.message}` };
      }
    }
  },
  {
    name: 'Main App Component',
    test: async () => {
      try {
        const module = await import('../../../src/App.tsx');
        if (!module.default) throw new Error('App component not exported as default');
        return { status: 'PASS', message: 'App component imported successfully' };
      } catch (error) {
        return { status: 'FAIL', message: `App import failed: ${error.message}` };
      }
    }
  },
  {
    name: 'Router Configuration',
    test: async () => {
      try {
        const module = await import('../../../src/main.tsx');
        if (!module) throw new Error('Main entry point not accessible');
        return { status: 'PASS', message: 'Main entry point accessible' };
      } catch (error) {
        return { status: 'FAIL', message: `Main import failed: ${error.message}` };
      }
    }
  }
];

// Execute all import tests
async function runImportTests() {
  console.log('🧪 SMOKE TEST: Module Imports\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    process.stdout.write(`Testing ${test.name}... `);
    
    const result = await test.test();
    
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
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runImportTests().catch(console.error);
}

export { runImportTests };