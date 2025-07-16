const fetch = require('node-fetch');
const fs = require('fs');
const pkg = process.argv[2]; // Ej: 'strapi'
const localVersion = require('../../package.json').dependencies[pkg];

fetch(`https://registry.npmjs.org/${pkg}/latest`)
  .then(res => res.json())
  .then(data => {
    const latest = data.version;
    if (localVersion !== latest) {
      console.log(`[ALERTA] Hay una nueva versión de ${pkg}: ${latest} (local: ${localVersion})`);
      // Aquí puedes llamar a un script de reporte o enviar alerta
    } else {
      console.log(`[OK] ${pkg} está actualizado (${localVersion})`);
    }
  }); 