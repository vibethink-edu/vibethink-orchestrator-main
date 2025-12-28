// Simple test to check if API key is accessible
require('dotenv').config({ override: true });
console.log('ANTHROPIC_API_KEY is:', process.env.ANTHROPIC_API_KEY ? 'SET (length: ' + process.env.ANTHROPIC_API_KEY.length + ')' : 'NOT SET');
