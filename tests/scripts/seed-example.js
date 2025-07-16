// Script de ejemplo para poblar datos de prueba (seed)
// Ejecutar con: node tests/scripts/seed-example.js

const fs = require('fs');
const path = require('path');

// Cargar datos dummy de ejemplo
const users = require('../fixtures/example-users.json');

// Simulación de inserción en base de datos (reemplazar por lógica real)
function seedUsers() {
  console.log('Insertando usuarios de ejemplo en la base de datos de test...');
  users.forEach(user => {
    // Aquí iría la lógica real de inserción
    console.log(`Usuario insertado: ${user.name} <${user.email}> [${user.role}]`);
  });
  console.log('Seed de usuarios completado.');
}

seedUsers(); 