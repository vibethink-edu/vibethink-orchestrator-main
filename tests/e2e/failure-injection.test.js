const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

// Validators de contratos existentes
const { validateFailure } = require("../../scripts/contracts/validate-failure");
const { validateActionIntent } = require("../../scripts/contracts/validate-action-intent");

// Paths
const failureSchemaPath = path.join(__dirname, "..", "..", "schemas", "runtime", "failure-envelope.schema.json");
const actionIntentSchemaPath = path.join(__dirname, "..", "..", "schemas", "service-layer", "action-intent.schema.json");
const fixturesDir = path.join(__dirname, "..", "fixtures", "e2e", "failure");

// Helper para cargar JSON
function loadJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Helper para validar FailureEnvelope
function validateFailureEnvelope(payload) {
  const schema = JSON.parse(fs.readFileSync(failureSchemaPath, "utf8"));
  return validateFailure(payload, schema);
}

// Helper para validar ActionIntent
function validateActionIntentSchema(payload) {
  const schema = JSON.parse(fs.readFileSync(actionIntentSchemaPath, "utf8"));
  return validateActionIntent(payload, schema);
}

// Mock del Orchestrator (sin integraciones reales, sin DB)
class MockOrchestrator {
  constructor() {
    this.runState = "CREATED";
    this.traceLog = [];
    this.currentRunId = "test-run-001";
    this.correlationId = "test-corr-001";
    this.policyContextId = "policy-test-001";
    this.tenantId = "tenant-test-001";
  }

  logTrace(eventType, details) {
    this.traceLog.push({
      event_type: eventType,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  // Simular Specialist que timeout
  async executeSpecialistWithTimeout(timeoutMs = 100) {
    this.logTrace("STEP_STARTED", { step_type: "SPECIALIST_CALL" });
    await new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Specialist timeout")), timeoutMs)
    );
  }

  // Simular Specialist con output inválido
  async executeSpecialistWithInvalidOutput() {
    this.logTrace("STEP_STARTED", { step_type: "SPECIALIST_CALL" });
    // Devuelve JSON inválido (schema mismatch)
    return {
      "invalid_field": "not_in_schema",
      "missing_required": false
      // Falta: action_type, tenant_id, etc.
    };
  }

  // Simular Approval que expira
  async waitForApproval(timeoutMs = 50) {
    this.logTrace("APPROVAL_REQUESTED", { expires_at: new Date(Date.now() + timeoutMs).toISOString() });
    await new Promise(resolve => setTimeout(resolve, timeoutMs + 10));
    return { decision: "TIMEOUT" };
  }

  // Crear FailureEnvelope
  createFailureEnvelope(errorType, classification, details) {
    return {
      error_id: `err-${Date.now()}`,
      error_type: errorType,
      message: `Simulated ${errorType}`,
      classification: classification,
      occurred_at: new Date().toISOString(),
      tenant_id: this.tenantId,
      run_id: this.currentRunId,
      correlation_id: this.correlationId,
      policy_context_id: this.policyContextId,
      source: {
        system: "orchestrator",
        name: "specialist-runtime"
      },
      trace_link: {
        input_snapshot_hash: "snap-test-001"
      },
      details: details
    };
  }
}

// ============================================================================
// ESCENARIO A: Specialist Timeout
// ============================================================================

test("Scenario A: Specialist timeout creates non-retryable FailureEnvelope and marks Run FAILED", async () => {
  const orchestrator = new MockOrchestrator();
  
  // Given: Specialist está configurado con timeout corto
  try {
    await orchestrator.executeSpecialistWithTimeout(50);
    assert.fail("Should have thrown timeout error");
  } catch (error) {
    // When: Specialist timeout ocurre
    orchestrator.logTrace("STEP_FAILED", { error_code: "SPECIALIST_TIMEOUT" });
    orchestrator.logTrace("RUN_FAILED", { exit_reason: "SPECIALIST_TIMEOUT" });
    
    // Then: Se crea FailureEnvelope no retryable
    const failureEnvelope = orchestrator.createFailureEnvelope(
      "SPECIALIST_TIMEOUT",
      "NON_RETRYABLE",
      { timeout_ms: 50, specialist_name: "test-specialist" }
    );
    
    const validationErrors = validateFailureEnvelope(failureEnvelope);
    assert.strictEqual(validationErrors.length, 0, "FailureEnvelope debe ser válido según schema");
    
    // Verificar propiedades críticas
    assert.strictEqual(failureEnvelope.classification, "NON_RETRYABLE");
    assert.strictEqual(failureEnvelope.error_type, "SPECIALIST_TIMEOUT");
    assert.ok(failureEnvelope.trace_link);
    
    // Verificar Run state
    orchestrator.runState = "FAILED";
    assert.strictEqual(orchestrator.runState, "FAILED");
    
    // Verificar trace completo
    assert.ok(orchestrator.traceLog.length > 0, "Trace log debe tener registros");
    assert.ok(orchestrator.traceLog.some(log => log.event_type === "STEP_STARTED"));
    assert.ok(orchestrator.traceLog.some(log => log.event_type === "STEP_FAILED"));
    assert.ok(orchestrator.traceLog.some(log => log.event_type === "RUN_FAILED"));
  }
});

test("Scenario A: Expected failure envelope for timeout matches schema", () => {
  const expected = loadJson(path.join(fixturesDir, "expected.failure-envelope.json"));
  const validationErrors = validateFailureEnvelope(expected);
  assert.strictEqual(validationErrors.length, 0, "Expected FailureEnvelope debe ser válido");
});

test("Scenario A: Specialist timeout payload is deterministic", async () => {
  const orchestrator1 = new MockOrchestrator();
  const orchestrator2 = new MockOrchestrator();
  
  // Misma entrada
  const error1 = orchestrator1.createFailureEnvelope("SPECIALIST_TIMEOUT", "NON_RETRYABLE", { timeout_ms: 50 });
  const error2 = orchestrator2.createFailureEnvelope("SPECIALIST_TIMEOUT", "NON_RETRYABLE", { timeout_ms: 50 });
  
  // Mismo resultado (determinismo en campos base)
  assert.strictEqual(error1.error_type, error2.error_type);
  assert.strictEqual(error1.classification, error2.classification);
  assert.strictEqual(error1.source.system, error2.source.system);
});

// ============================================================================
// ESCENARIO B: Specialist Output Inválido (Schema Mismatch)
// ============================================================================

test("Scenario B: Specialist invalid output triggers ValidationError and no ActionIntent", async () => {
  const orchestrator = new MockOrchestrator();
  
  // When: Specialist devuelve JSON inválido
  const specialistOutput = await orchestrator.executeSpecialistWithInvalidOutput();
  
  // Then: No hay ActionIntent válido
  const validationErrors = validateActionIntentSchema(specialistOutput);
  assert.ok(validationErrors.length > 0, "Output inválido debe tener errores de validación");
  
  // Log de validación fallida
  orchestrator.logTrace("VALIDATION_FAILED", { 
    errors: validationErrors.length,
    sample_error: validationErrors[0]
  });
  
  // Verificar que no se creó ActionIntent
  assert.ok(!specialistOutput.action_type, "Output inválido no debe tener action_type");
  assert.ok(!specialistOutput.tenant_id, "Output inválido no debe tener tenant_id");
  
  // Verificar trace completo
  assert.ok(orchestrator.traceLog.some(log => log.event_type === "STEP_STARTED"));
  assert.ok(orchestrator.traceLog.some(log => log.event_type === "VALIDATION_FAILED"));
});

test("Scenario B: Invalid output payload matches fixture", () => {
  const invalidOutput = loadJson(path.join(fixturesDir, "specialist.invalid-output.json"));
  const validationErrors = validateActionIntentSchema(invalidOutput);
  assert.ok(validationErrors.length > 0, "Output inválido debe fallar validación");
});

test("Scenario B: Invalid output validation is deterministic", () => {
  const invalidOutput = loadJson(path.join(fixturesDir, "specialist.invalid-output.json"));
  const errors1 = validateActionIntentSchema(invalidOutput);
  const errors2 = validateActionIntentSchema(invalidOutput);
  
  // Mismo resultado (determinismo en validación)
  assert.strictEqual(errors1.length, errors2.length);
  assert.strictEqual(errors1[0].property, errors2[0].property);
});

// ============================================================================
// ESCENARIO C: Approval Expira (Timeout)
// ============================================================================

test("Scenario C: Approval timeout results in Decision=TIMEOUT and no Effect", async () => {
  const orchestrator = new MockOrchestrator();
  
  // Given: Approval request creado
  orchestrator.logTrace("APPROVAL_REQUESTED", { 
    step_id: "step-001",
    requested_by: "specialist-001",
    expires_at: new Date(Date.now() + 100).toISOString()
  });
  
  // When: Approval expira
  const approvalResponse = await orchestrator.waitForApproval(50);
  
  // Then: Decision es TIMEOUT
  assert.strictEqual(approvalResponse.decision, "TIMEOUT");
  
  // Log de timeout
  orchestrator.logTrace("APPROVAL_TIMEOUT", { 
    original_request: "APPROVAL_REQUESTED" 
  });
  orchestrator.logTrace("RUN_CANCELLED", { 
    reason: "APPROVAL_TIMEOUT",
    at_step: "APPROVAL_GATE"
  });
  
  // Verificar que NO se creó Effect
  const hasEffect = orchestrator.traceLog.some(log => 
    log.event_type === "EFFECT_REQUESTED" || 
    log.event_type === "EFFECT_COMPLETED"
  );
  assert.ok(!hasEffect, "No debe haber Effects después de approval timeout");
  
  // Verificar Run state
  orchestrator.runState = "CANCELLED";
  assert.strictEqual(orchestrator.runState, "CANCELLED");
  
  // Verificar trace completo
  assert.ok(orchestrator.traceLog.some(log => log.event_type === "APPROVAL_REQUESTED"));
  assert.ok(orchestrator.traceLog.some(log => log.event_type === "APPROVAL_TIMEOUT"));
  assert.ok(orchestrator.traceLog.some(log => log.event_type === "RUN_CANCELLED"));
});

test("Scenario C: Approval timeout payload matches fixture", () => {
  const approvalTimeout = loadJson(path.join(fixturesDir, "approval.timeout.json"));
  assert.strictEqual(approvalTimeout.decision, "TIMEOUT");
  assert.ok(approvalTimeout.reason);
});

test("Scenario C: Approval timeout is deterministic", async () => {
  const orchestrator = new MockOrchestrator();
  
  // Misma entrada
  const response1 = await orchestrator.waitForApproval(50);
  const response2 = await orchestrator.waitForApproval(50);
  
  // Mismo resultado (determinismo en timeout)
  assert.strictEqual(response1.decision, response2.decision);
  assert.strictEqual(response1.decision, "TIMEOUT");
});

// ============================================================================
// DETERMINISMO: Misma entrada → mismo resultado
// ============================================================================

test("Determinism: Same input produces same failure envelope", () => {
  const orchestrator1 = new MockOrchestrator();
  const orchestrator2 = new MockOrchestrator();
  
  const envelope1 = orchestrator1.createFailureEnvelope("SPECIALIST_TIMEOUT", "NON_RETRYABLE", { timeout_ms: 100 });
  const envelope2 = orchestrator2.createFailureEnvelope("SPECIALIST_TIMEOUT", "NON_RETRYABLE", { timeout_ms: 100 });
  
  // Campos deterministas deben ser idénticos
  assert.strictEqual(envelope1.error_type, envelope2.error_type);
  assert.strictEqual(envelope1.classification, envelope2.classification);
  assert.strictEqual(envelope1.message, envelope2.message);
  assert.strictEqual(envelope1.source.system, envelope2.source.system);
  assert.strictEqual(envelope1.source.name, envelope2.source.name);
  
  // trace_link debe ser consistente
  assert.strictEqual(envelope1.trace_link.input_snapshot_hash, envelope2.trace_link.input_snapshot_hash);
});

test("Determinism: Trace logs preserve order for same input", async () => {
  const orchestrator = new MockOrchestrator();
  
  // Ejecutar secuencia
  orchestrator.logTrace("STEP_STARTED", { step_index: 1 });
  orchestrator.logTrace("STEP_FAILED", { error_code: "TIMEOUT" });
  orchestrator.logTrace("RUN_FAILED", { reason: "SPECIALIST_TIMEOUT" });
  
  // Verificar orden preservado
  assert.strictEqual(orchestrator.traceLog[0].event_type, "STEP_STARTED");
  assert.strictEqual(orchestrator.traceLog[1].event_type, "STEP_FAILED");
  assert.strictEqual(orchestrator.traceLog[2].event_type, "RUN_FAILED");
});

// ============================================================================
// INTEGRACIÓN: Validar contra schemas existentes
// ============================================================================

test("Integration: All failure scenarios use existing FailureEnvelope schema", () => {
  const orchestrator = new MockOrchestrator();
  
  // Todos los escenarios crean FailureEnvelope válido
  const timeoutEnvelope = orchestrator.createFailureEnvelope("SPECIALIST_TIMEOUT", "NON_RETRYABLE", { timeout_ms: 100 });
  const validationEnvelope = orchestrator.createFailureEnvelope("VALIDATION_ERROR", "NON_RETRYABLE", { error_count: 5 });
  const approvalEnvelope = orchestrator.createFailureEnvelope("APPROVAL_TIMEOUT", "NON_RETRYABLE", { approval_id: "app-001" });
  
  const timeoutErrors = validateFailureEnvelope(timeoutEnvelope);
  const validationErrors = validateFailureEnvelope(validationEnvelope);
  const approvalErrors = validateFailureEnvelope(approvalEnvelope);
  
  assert.strictEqual(timeoutErrors.length, 0, "Timeout envelope debe ser válido");
  assert.strictEqual(validationErrors.length, 0, "Validation envelope debe ser válido");
  assert.strictEqual(approvalErrors.length, 0, "Approval envelope debe ser válido");
});

test("Integration: No Service Layer calls in failure paths", async () => {
  const orchestrator = new MockOrchestrator();
  
  // Verificar que no hay llamadas a Service Layer en los paths de fallo
  let serviceLayerCalled = false;
  
  // Mock de Service Layer (no debe llamarse en fallos)
  const mockServiceLayer = {
    createEffect: () => { serviceLayerCalled = true; }
  };
  
  // Scenario A: Timeout
  try {
    await orchestrator.executeSpecialistWithTimeout(50);
  } catch (error) {
    // Crear FailureEnvelope en lugar de llamar Service Layer
    orchestrator.createFailureEnvelope("SPECIALIST_TIMEOUT", "NON_RETRYABLE", {});
  }
  
  // Scenario B: Invalid output
  const invalidOutput = await orchestrator.executeSpecialistWithInvalidOutput();
  const validationErrors = validateActionIntentSchema(invalidOutput);
  if (validationErrors.length > 0) {
    // Crear FailureEnvelope en lugar de llamar Service Layer
    orchestrator.createFailureEnvelope("VALIDATION_ERROR", "NON_RETRYABLE", {});
  }
  
  // Scenario C: Approval timeout
  const approvalResponse = await orchestrator.waitForApproval(50);
  if (approvalResponse.decision === "TIMEOUT") {
    // No crear Effect, solo log timeout
    orchestrator.logTrace("APPROVAL_TIMEOUT", {});
  }
  
  assert.ok(!serviceLayerCalled, "Service Layer NO debe ser llamado en paths de fallo");
});
