const axios = require('axios');
const [,, component, version, status] = process.argv;

axios.post('https://dashboard-central/api/report', {
  component,
  version,
  status,
  timestamp: new Date().toISOString()
}).then(() => {
  console.log('Reporte enviado al dashboard central');
}).catch(err => {
  console.error('Error enviando reporte:', err.message);
}); 