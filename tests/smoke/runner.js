/**
 * 🧪 SMOKE TESTS - Runner Principal
 * 
 * Objetivo: Executar todos os smoke tests de forma organizada
 * Uso: node tests/smoke/runner.js ou incluir em página HTML
 */

// Importa os testes (quando rodando em Node.js)
let routeTests, importTests;

if (typeof require !== 'undefined') {
  try {
    routeTests = require('./routes.test.js');
    importTests = require('./imports.test.js');
  } catch (e) {
    console.log('Executando em modo browser...');
  }
}

// Runner principal
function runAllSmokeTests() {
  const startTime = Date.now();
  console.log('🧪 Iniciando Smoke Tests...\n');

  const results = {
    timestamp: new Date().toISOString(),
    duration: 0,
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    },
    tests: {}
  };

  try {
    // Executa teste de rotas
    console.log('🌐 Testando disponibilidade de rotas...');
    const routeResults = routeTests ? routeTests.runRouteTests() : { total: 0, passed: 0, failed: 0 };
    results.tests.routes = routeResults;
    results.summary.total += routeResults.total;
    results.summary.passed += routeResults.passed;
    results.summary.failed += routeResults.failed;
    console.log(`   ✅ ${routeResults.passed}/${routeResults.total} rotas disponíveis\n`);

    // Executa teste de imports
    console.log('📦 Testando importação de módulos...');
    const importResults = importTests ? importTests.runImportTests() : { total: 0, passed: 0, failed: 0 };
    results.tests.imports = importResults;
    results.summary.total += importResults.total;
    results.summary.passed += importResults.passed;
    results.summary.failed += importResults.failed;
    console.log(`   ✅ ${importResults.passed}/${importResults.total} módulos importáveis\n`);

  } catch (error) {
    console.error('❌ Erro durante execução dos testes:', error.message);
    results.summary.failed++;
  }

  // Finaliza
  const endTime = Date.now();
  results.duration = `${endTime - startTime}ms`;

  console.log('📊 RESUMO DOS SMOKE TESTS');
  console.log('=' .repeat(40));
  console.log(`Total: ${results.summary.total}`);
  console.log(`Passou: ${results.summary.passed}`);
  console.log(`Falhou: ${results.summary.failed}`);
  console.log(`Duração: ${results.duration}`);
  console.log(`Timestamp: ${results.timestamp}`);

  const successRate = results.summary.total > 0 
    ? ((results.summary.passed / results.summary.total) * 100).toFixed(1)
    : 0;
  
  console.log(`Taxa de sucesso: ${successRate}%`);

  if (results.summary.failed === 0) {
    console.log('\n🎉 Todos os smoke tests passaram!');
  } else {
    console.log(`\n⚠️  ${results.summary.failed} teste(s) falharam`);
  }

  return results;
}

// Executa automaticamente se rodado via Node.js
if (typeof require !== 'undefined' && require.main === module) {
  runAllSmokeTests();
}

// Disponibiliza no browser
if (typeof window !== 'undefined') {
  window.runAllSmokeTests = runAllSmokeTests;
  console.log('🧪 Smoke Test Runner carregado. Execute: runAllSmokeTests()');
}

// Exporta para uso externo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllSmokeTests };
}