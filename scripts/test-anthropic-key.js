/**
 * Test Anthropic API Key
 */

require('dotenv').config({ override: true });

const Anthropic = require('@anthropic-ai/sdk');

async function testKey() {
  console.log('\n🔑 Testing Anthropic API Key...\n');

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment');
    process.exit(1);
  }

  console.log(`API Key found: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`Full length: ${apiKey.length} characters\n`);

  try {
    const anthropic = new Anthropic({ apiKey });

    console.log('📡 Making test API call...\n');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'Say "API key works!" in exactly 3 words.'
      }]
    });

    console.log('✅ SUCCESS! API key is valid.\n');
    console.log('Response:', message.content[0].text);
    console.log('\n✅ Ready to run translation script!\n');

  } catch (error) {
    console.error('❌ FAILED! API key is invalid or expired.\n');
    console.error('Error:', error.message);
    console.error('\nPlease check your API key at: https://console.anthropic.com/');
    process.exit(1);
  }
}

testKey();
