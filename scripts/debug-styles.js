/**
 * Debug Styles Script
 * 
 * Script para diagnosticar problemas de estilos CSS
 * 
 * @author AI Pair Platform - Backend Team
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function debugStyles() {
  console.log('🎨 Debugging CSS Styles...\n');
  console.log('='.repeat(60));
  
  // 1. Verificar archivos CSS
  console.log('\n📁 CSS Files Check:');
  console.log('='.repeat(30));
  
  const cssFiles = [
    'src/index.css',
    'src/App.css',
    'tailwind.config.ts',
    'postcss.config.js',
    'vite.config.ts'
  ];
  
  cssFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✅ ${file} (${stats.size} bytes)`);
    } else {
      console.log(`❌ ${file} (missing)`);
    }
  });
  
  // 2. Verificar configuración de Tailwind
  console.log('\n🎯 Tailwind Configuration:');
  console.log('='.repeat(30));
  
  try {
    const tailwindConfig = fs.readFileSync(path.join(__dirname, '..', 'tailwind.config.ts'), 'utf8');
    const hasContent = tailwindConfig.includes('content:');
    const hasPlugins = tailwindConfig.includes('plugins:');
    const hasTheme = tailwindConfig.includes('theme:');
    
    console.log(`✅ Content paths: ${hasContent ? 'Configured' : 'Missing'}`);
    console.log(`✅ Plugins: ${hasPlugins ? 'Configured' : 'Missing'}`);
    console.log(`✅ Theme: ${hasTheme ? 'Configured' : 'Missing'}`);
    
    // Verificar rutas de contenido
    const contentMatch = tailwindConfig.match(/content:\s*\[([\s\S]*?)\]/);
    if (contentMatch) {
      console.log('📋 Content paths found:');
      const paths = contentMatch[1].match(/"[^"]*"/g);
      paths?.forEach(path => console.log(`   ${path}`));
    }
  } catch (error) {
    console.log(`❌ Error reading tailwind.config.ts: ${error.message}`);
  }
  
  // 3. Verificar PostCSS
  console.log('\n🔧 PostCSS Configuration:');
  console.log('='.repeat(30));
  
  try {
    const postcssConfig = fs.readFileSync(path.join(__dirname, '..', 'postcss.config.js'), 'utf8');
    const hasTailwind = postcssConfig.includes('tailwindcss');
    const hasAutoprefixer = postcssConfig.includes('autoprefixer');
    
    console.log(`✅ Tailwind CSS: ${hasTailwind ? 'Configured' : 'Missing'}`);
    console.log(`✅ Autoprefixer: ${hasAutoprefixer ? 'Configured' : 'Missing'}`);
  } catch (error) {
    console.log(`❌ Error reading postcss.config.js: ${error.message}`);
  }
  
  // 4. Verificar Vite
  console.log('\n⚡ Vite Configuration:');
  console.log('='.repeat(30));
  
  try {
    const viteConfig = fs.readFileSync(path.join(__dirname, '..', 'vite.config.ts'), 'utf8');
    const hasReact = viteConfig.includes('@vitejs/plugin-react');
    const hasCss = viteConfig.includes('css');
    
    console.log(`✅ React Plugin: ${hasReact ? 'Configured' : 'Missing'}`);
    console.log(`✅ CSS Support: ${hasCss ? 'Configured' : 'Missing'}`);
  } catch (error) {
    console.log(`❌ Error reading vite.config.ts: ${error.message}`);
  }
  
  // 5. Verificar package.json
  console.log('\n📦 Dependencies Check:');
  console.log('='.repeat(30));
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const requiredPackages = [
      'tailwindcss',
      'postcss',
      'autoprefixer',
      'tailwindcss-animate'
    ];
    
    requiredPackages.forEach(pkg => {
      const version = dependencies[pkg] || devDependencies[pkg];
      if (version) {
        console.log(`✅ ${pkg}: ${version}`);
      } else {
        console.log(`❌ ${pkg}: Missing`);
      }
    });
  } catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
  }
  
  // 6. Verificar archivo CSS principal
  console.log('\n🎨 Main CSS File:');
  console.log('='.repeat(30));
  
  try {
    const indexCss = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.css'), 'utf8');
    const hasTailwindDirectives = indexCss.includes('@tailwind');
    const hasCustomStyles = indexCss.includes('@layer');
    const hasVariables = indexCss.includes('--background');
    
    console.log(`✅ Tailwind directives: ${hasTailwindDirectives ? 'Present' : 'Missing'}`);
    console.log(`✅ Custom layers: ${hasCustomStyles ? 'Present' : 'Missing'}`);
    console.log(`✅ CSS variables: ${hasVariables ? 'Present' : 'Missing'}`);
    
    // Verificar directivas específicas
    const directives = ['@tailwind base', '@tailwind components', '@tailwind utilities'];
    directives.forEach(directive => {
      const hasDirective = indexCss.includes(directive);
      console.log(`   ${hasDirective ? '✅' : '❌'} ${directive}`);
    });
  } catch (error) {
    console.log(`❌ Error reading src/index.css: ${error.message}`);
  }
  
  // 7. Recomendaciones
  console.log('\n💡 Troubleshooting Steps:');
  console.log('='.repeat(30));
  console.log('1. Clear browser cache and reload');
  console.log('2. Check browser console for CSS errors');
  console.log('3. Verify Tailwind classes are being applied');
  console.log('4. Check if CSS is being loaded in Network tab');
  console.log('5. Try adding a test class like "bg-red-500"');
  console.log('6. Restart the development server');
  
  console.log('\n🔧 Quick Fix Commands:');
  console.log('='.repeat(30));
  console.log('npm run dev -- --force');
  console.log('npm run build');
  console.log('rm -rf node_modules && npm install');
  
  console.log('\n' + '='.repeat(60));
  console.log('🎨 CSS DEBUG COMPLETED');
  console.log('='.repeat(60));
}

debugStyles(); 