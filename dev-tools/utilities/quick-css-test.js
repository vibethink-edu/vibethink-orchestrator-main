/**
 * Quick CSS Test Script
 * 
 * Script rápido para verificar si los estilos CSS están funcionando
 * 
 * @author AI Pair Platform - Backend Team
 * @version 1.0.0
 */

import puppeteer from 'puppeteer';

async function quickCssTest() {
  // TODO: log '🎨 Quick CSS Test...\n'
  // TODO: log '='.repeat(50)
  
  let browser;
  
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // TODO: log '🌐 Loading page...'
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
    // TODO: log '✅ Page loaded'
    
    // Test básico de Tailwind
    const tailwindTest = await page.evaluate(() => {
      const element = document.createElement('div');
      element.className = 'bg-red-500 text-white p-4';
      document.body.appendChild(element);
      
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;
      
      document.body.removeChild(element);
      
      return {
        hasTailwind: backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent',
        backgroundColor: backgroundColor
      };
    });
    
    // TODO: log `\n🎯 Tailwind CSS: ${tailwindTest.hasTailwind ? '✅ Working' : '❌ Not working'}`
    // TODO: log `   Background color: ${tailwindTest.backgroundColor}`
    
    // Test de variables CSS
    const cssVarsTest = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      const variables = ['--background', '--primary', '--foreground'];
      const results = {};
      
      variables.forEach(varName => {
        const value = computedStyle.getPropertyValue(varName);
        results[varName] = value !== '';
      });
      
      return results;
    });
    
    // TODO: log '\n🎨 CSS Variables:'
    Object.entries(cssVarsTest).forEach(([varName, exists]) => {
      // TODO: log `   ${varName}: ${exists ? '✅' : '❌'}`
    });
    
    // Test de clases específicas
    const classTest = await page.evaluate(() => {
      const tests = [
        { class: 'bg-primary', description: 'Primary background' },
        { class: 'text-white', description: 'White text' },
        { class: 'p-4', description: 'Padding' }
      ];
      
      return tests.map(test => {
        const element = document.createElement('div');
        element.className = test.class;
        document.body.appendChild(element);
        
        const computedStyle = window.getComputedStyle(element);
        const hasStyles = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
                         computedStyle.color !== 'rgba(0, 0, 0, 0)' ||
                         computedStyle.padding !== '0px';
        
        document.body.removeChild(element);
        
        return {
          class: test.class,
          description: test.description,
          working: hasStyles
        };
      });
    });
    
    // TODO: log '\n🔍 Class Tests:'
    classTest.forEach(test => {
      // TODO: log `   ${test.class} (${test.description}): ${test.working ? '✅' : '❌'}`
    });
    
    // Resumen
    const allWorking = tailwindTest.hasTailwind && 
                      Object.values(cssVarsTest).every(v => v) &&
                      classTest.every(t => t.working);
    
    // TODO: log '\n📊 Summary:'
    // TODO: log `   Overall Status: ${allWorking ? '✅ All working!' : '❌ Some issues'}`
    
    if (!allWorking) {
      // TODO: log '\n💡 Next steps:'
      // TODO: log '   1. Check browser console for errors'
      // TODO: log '   2. Verify Tailwind CSS is installed correctly'
      // TODO: log '   3. Check PostCSS configuration'
      // TODO: log '   4. Restart development server'
    }
    
  } catch (error) {
    // TODO: log '❌ Error:' error.message
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // TODO: log '\n' + '='.repeat(50)
  // TODO: log '🎨 QUICK CSS TEST COMPLETED'
  // TODO: log '='.repeat(50)
}

quickCssTest(); 