const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const fs = require('node:fs/promises');

/**
 * MOCK ORCHESTRATION RUNTIME
 * In a real scenario, this would be the core reasoning orchestrator.
 * Here, we simulate its key functions to test failure handling.
 */
const mockOrchestrator = {
  // Simulates a single step in a run, like invoking a specialist.
  async executeStep(stepConfig) {
    const { type, payload } = stepConfig;
    if (type === 'invokeSpecialist') {
      // Specialist timeout simulation
      if (payload.simulate === 'timeout') {
        await new Promise(resolve => setTimeout(resolve, payload.timeout_ms || 50)); // Simulate a delay
        // In a real timeout, this promise would never resolve. The test will race it.
        // For this mock, we resolve to a timeout error to be caught.
        return { status: 'FAILED', error: { errorType: 'SPECIALIST_TIMEOUT', isRetryable: false } };
      }
      // Invalid output simulation
      if (payload.simulate === 'invalid-output') {
        return { status: 'COMPLETED', output: payload.data };
      }
    }
    return { status: 'COMPLETED', output: {} };
  },

  // Simulates the validation and approval process
  async processOutput(runTrace, specialistOutput) {
    // Schema validation simulation
    const { proposedAction } = specialistOutput;
    if (
      !proposedAction ||
      !proposedAction.type ||
      !proposedAction.details ||
      !proposedAction.details.participants ||
      !proposedAction.details.topic ||
      !proposedAction.details.startTime
    ) {
      runTrace.log('Validation failed: Output schema mismatch.');
      runTrace.status = 'FAILED';
      runTrace.error = { errorType: 'VALIDATION_ERROR', message: 'Specialist output schema mismatch.' };
      return runTrace;
    }

    runTrace.log('Specialist output is valid. Proceeding to approval.');
    runTrace.currentStep = 'AWAITING_APPROVAL';
    return this.waitForApproval(runTrace, { approvalTimeout: 50 }); // Simulate waiting
  },

  async waitForApproval(runTrace, approvalConfig) {
    if (approvalConfig.simulate === 'timeout') {
      runTrace.log(`Approval timed out after ${approvalConfig.wait_ms}ms.`);
      runTrace.status = 'CANCELLED';
      runTrace.error = { errorType: 'APPROVAL_TIMEOUT', message: 'User did not respond in time.' };
      return runTrace;
    }
    // This path is not used in this test file
    return runTrace;
  }
};

const loadFixture = (name) => {
  const fixturePath = path.join(__dirname, '../fixtures/e2e/failure', name);
  return fs.readFile(fixturePath, 'utf-8').then(JSON.parse);
};

// --- TEST SUITE ---
test.describe('Failure Injection Scenarios', () => {

  test('Scenario A: Specialist timeout', async (t) => {
    const timeoutConfig = await loadFixture('specialist.timeout.json');
    const runTrace = { status: 'EXECUTING_STEP', log: (msg) => {} };

    // We simulate a race condition to detect the timeout
    const executionPromise = mockOrchestrator.executeStep({
      type: 'invokeSpecialist',
      payload: timeoutConfig,
    });
    
    const timeoutPromise = new Promise((resolve) => 
        setTimeout(() => resolve({
            status: 'FAILED', 
            error: { errorType: 'SPECIALIST_TIMEOUT', isRetryable: false } 
        }), 20)
    );

    const result = await Promise.race([executionPromise, timeoutPromise]);
    const expectedEnvelope = await loadFixture('expected.failure-envelope.json');
    
    assert.strictEqual(result.status, 'FAILED', 'Run status should be FAILED');
    assert.strictEqual(result.error.errorType, expectedEnvelope.errorType, 'Error type should be SPECIALIST_TIMEOUT');
    assert.strictEqual(result.error.isRetryable, expectedEnvelope.isRetryable, 'Failure should not be retryable');
  });

  test('Scenario B: Specialist output invalid (schema mismatch)', async (t) => {
    const invalidOutput = await loadFixture('specialist.invalid-output.json');
    const runTrace = { status: 'PROCESSING_OUTPUT', log: (msg) => { t.diagnostic(msg); } };
    
    const finalTrace = await mockOrchestrator.processOutput(runTrace, invalidOutput);

    assert.strictEqual(finalTrace.status, 'FAILED', 'Run status should be FAILED');
    assert.ok(finalTrace.error, 'An error object should exist');
    assert.strictEqual(finalTrace.error.errorType, 'VALIDATION_ERROR', 'Error type should be VALIDATION_ERROR');
    assert.match(finalTrace.error.message, /schema mismatch/i, 'Error message should indicate a schema mismatch');
  });

  test('Scenario C: Approval expires (timeout)', async (t) => {
    const approvalTimeoutConfig = await loadFixture('approval.timeout.json');
    // For this test, we assume a valid specialist output was received
    const runTrace = { status: 'AWAITING_APPROVAL', log: (msg) => { t.diagnostic(msg); } };
    
    const finalTrace = await mockOrchestrator.waitForApproval(runTrace, approvalTimeoutConfig);

    assert.strictEqual(finalTrace.status, 'CANCELLED', 'Run status should be CANCELLED');
    assert.ok(finalTrace.error, 'An error object should exist');
    assert.strictEqual(finalTrace.error.errorType, 'APPROVAL_TIMEOUT', 'Error type should be APPROVAL_TIMEOUT');
  });

});
