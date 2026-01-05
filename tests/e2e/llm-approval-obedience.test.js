const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const fs = require('node:fs/promises');
const crypto = require('node:crypto');

// --- Test Configuration ---
const FIXTURE_PATH = path.join(__dirname, '../fixtures/e2e/llm');
const USE_REAL_API = !!(process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY);

// --- Helper Functions ---
const loadFixture = (name) => {
  return fs.readFile(path.join(FIXTURE_PATH, name), 'utf-8').then(JSON.parse);
};

// This function simulates getting a response from an LLM.
// For deterministic CI, it uses a fallback if no API key is provided.
async function getLlmResponse() {
  if (USE_REAL_API) {
    // Placeholder for real API call logic.
    // In a real scenario, you would use the Gemini or Anthropic SDK here.
    // For this test, we'll immediately return the fallback to ensure stability.
    console.log('INFO: API Key found, but using fallback for this test run to ensure determinism.');
    return loadFixture('llm.response.sample.json');
  }
  return loadFixture('llm.response.sample.json');
}

// --- Mock Flow Functions (simulating the orchestrator) ---

// Simulates the system validating the LLM output and creating an ApprovalRequest.
function generateApprovalRequest(llmResponse, runId) {
  // 1. Validate shape of LLM response
  assert.ok(llmResponse.action, 'LLM response must contain an "action" field.');
  assert.ok(llmResponse.parameters, 'LLM response must contain a "parameters" field.');
  assert.strictEqual(llmResponse.requiresApproval, true, 'Action must require approval for this test flow.');

  // 2. Generate the request payload
  const approvalRequest = {
    requestId: 'approval-request-placeholder', // In real life, this would be a UUID
    runId: runId,
    summary: `Request to execute action '${llmResponse.action}' on table '${llmResponse.parameters.table}' for record '${llmResponse.parameters.recordId}'. Reason: ${llmResponse.reason}`,
    proposedAction: {
      action: llmResponse.action,
      parameters: llmResponse.parameters,
    },
  };
  return approvalRequest;
}

// Simulates the final step after receiving an external approval signal.
function generateActionIntent(approvedAction, runId) {
  assert.strictEqual(approvedAction.isApproved, true, 'Action must be approved to generate an intent.');
  
  const actionIntent = {
    intentId: 'action-intent-placeholder', // In real life, this would be a UUID
    sourceRunId: runId,
    action: approvedAction.action,
    isApproved: true,
    parameters: approvedAction.parameters,
  };
  return actionIntent;
}

// --- TEST SUITE ---
test('E2E Test: LLM Approval Obedience', async (t) => {
  const runId = 'run-id-placeholder'; // Mock Run ID for this test execution.
  
  // 1. Get LLM proposed action (from API or fallback)
  const llmResponse = await getLlmResponse();
  t.diagnostic(`Using ${USE_REAL_API ? 'REAL API (mocked)' : 'FALLBACK FIXTURE'} for LLM response.`);

  // 2. Validate basic structure of the LLM response
  assert.strictEqual(typeof llmResponse, 'object', 'LLM response should be a valid object.');
  assert.ok(llmResponse.action, 'LLM response has an action.');

  // 3. Generate Approval Request and validate it
  const approvalRequest = generateApprovalRequest(llmResponse, runId);
  const expectedApprovalRequest = await loadFixture('expected.approval-request.json');
  assert.deepStrictEqual(approvalRequest, expectedApprovalRequest, 'Generated ApprovalRequest matches the expected fixture.');
  t.diagnostic('Step 1: ApprovalRequest generated and validated successfully.');

  // 4. Simulate receiving an APPROVE response from the gate
  const approvalResponse = { isApproved: true };

  // 5. Generate the final ActionIntent and validate it
  const finalActionIntent = generateActionIntent(
    { ...approvalRequest.proposedAction, isApproved: approvalResponse.isApproved },
    runId
  );
  const expectedActionIntent = await loadFixture('expected.action-intent.json');
  assert.deepStrictEqual(finalActionIntent, expectedActionIntent, 'Generated ActionIntent matches the expected fixture.');
  t.diagnostic('Step 2: Final ActionIntent generated and validated successfully.');
});
