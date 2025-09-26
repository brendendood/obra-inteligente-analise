#!/usr/bin/env node

/**
 * Script para corrigir automaticamente React keys usando index em todo o projeto
 * 
 * ERRO CRÍTICO: Usar index como key causa problemas de rendering quando listas mudam
 * SOLUÇÃO: Usar propriedades únicas dos objetos como key
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Padrões problemáticos para detectar
const PROBLEMATIC_PATTERNS = [
  /key=\{index\}/g,
  /key=\{`.*index.*`\}/g,
  /key=\{".*index.*"\}/g,
  /key=\{'.*index.*'\}/g
];

// Função para gerar keys únicos baseados no contexto
function generateUniqueKey(content, matchPosition) {
  // Extrair contexto ao redor do match para entender o que está sendo mapeado
  const beforeMatch = content.substring(Math.max(0, matchPosition - 200), matchPosition);
  const afterMatch = content.substring(matchPosition, matchPosition + 200);
  
  // Detectar padrões comuns
  if (beforeMatch.includes('map((')) {
    // Encontrar o nome da variável sendo mapeada
    const mapPattern = /\.map\(\((\w+)(?:,\s*index)?\)\s*=>/;
    const mapMatch = beforeMatch.match(mapPattern);
    
    if (mapMatch) {
      const itemName = mapMatch[1];
      
      // Sugerir keys baseados em propriedades comuns
      if (afterMatch.includes(`${itemName}.id`)) {
        return `key={${itemName}.id}`;
      } else if (afterMatch.includes(`${itemName}.name`)) {
        return `key={\`${itemName}-\${${itemName}.name}\`}`;
      } else if (afterMatch.includes(`${itemName}.title`)) {
        return `key={\`${itemName}-\${${itemName}.title}\`}`;
      } else if (afterMatch.includes(`${itemName}.code`)) {
        return `key={${itemName}.code}`;
      } else if (afterMatch.includes(`${itemName}.email`)) {
        return `key={${itemName}.email}`;
      } else {
        // Fallback para combinação única
        return `key={\`${itemName}-\${JSON.stringify(${itemName})}\`}`;
      }
    }
  }
  
  // Fallback genérico
  return 'key={`item-${Math.random()}`}';
}

// Função para processar um arquivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    PROBLEMATIC_PATTERNS.forEach(pattern => {
      const matches = [...content.matchAll(pattern)];
      
      if (matches.length > 0) {
        console.log(`🔧 Fixing ${matches.length} React key issues in: ${filePath}`);
        hasChanges = true;
        
        // Processar matches de trás para frente para manter índices válidos
        matches.reverse().forEach(match => {
          const matchPosition = match.index;
          const uniqueKey = generateUniqueKey(content, matchPosition);
          
          content = content.substring(0, matchPosition) + 
                   uniqueKey + 
                   content.substring(matchPosition + match[0].length);
        });
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed React keys in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Função principal
function main() {
  console.log('🚀 Starting React Keys Fix Script...');
  console.log('This script fixes the critical error of using array index as React keys\n');
  
  // Encontrar todos os arquivos React/TypeScript
  const patterns = [
    'src/**/*.tsx',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.js'
  ];
  
  let totalFiles = 0;
  let fixedFiles = 0;
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern, { ignore: ['**/node_modules/**', '**/dist/**'] });
    
    files.forEach(file => {
      totalFiles++;
      if (processFile(file)) {
        fixedFiles++;
      }
    });
  });
  
  console.log('\n📊 React Keys Fix Summary:');
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files with fixes: ${fixedFiles}`);
  console.log(`   Clean files: ${totalFiles - fixedFiles}`);
  
  if (fixedFiles > 0) {
    console.log('\n✅ React key issues have been fixed!');
    console.log('🔍 Please review the changes and test your application.');
  } else {
    console.log('\n✨ No React key issues found!');
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { processFile, generateUniqueKey };