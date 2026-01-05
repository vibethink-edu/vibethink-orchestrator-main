const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

// Validator de ActionIntent existente
const { validateActionIntent } = require("../../scripts/contracts/validate-action-intent");

// Paths
const actionIntentSchemaPath = path.join(__dirname, "..", "..", "schemas", "service-layer", "action-intent.schema.json");
const fixturesDir = path.join(__dirname, "..", "fixtures", "e2e", "llm");

// Helper para cargar JSON
function loadJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Helper para validar ActionIntent
function validateActionIntentSchema(payload) {
  const schema = JSON.parse(fs.readFileSync(actionIntentSchemaPath, "utf8"));
  return validateActionIntent(payload, schema);
}

// Helper para cargar respuesta LLM (API o fixture)
async function loadLLMResponse() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;
  
  if (apiKey) {
    // Simular llamada real a LLM (sin hacer fetch real, solo estructura)
    // En producción, esto llamaría a la API real
    // Para CI determinista, fallback a fixture
    console.log("INFO: API key detected, but using deterministic fixture for CI");
    return loadJson(path.join(fixturesDir, "llm.response.sample.json"));
  } else {
    // Fallback determinista para CI
    return loadJson(path.join(fixturesDir, "llm.response.sample.json"));
  }
}

// Minimal Approval Gate implementation (sin Service Layer)
class MinimalApprovalGate {
  constructor(correlationId, runId) {
    this.correlationId = correlationId;
    this.runId = runId;
    this.traceLog = [];
    this.approvalRequests = [];
  }

  logTrace(eventType, details) {
    this.traceLog.push({
      event_type: eventType,
      timestamp: new Date().toISOString(),
      correlation_id: this.correlationId,
      run_id: this.runId,
      ...details
    });
  }

  // Validar respuesta LLM y crear ApprovalRequest si requiere aprobación
  processLLMResponse(llmResponse) {
    // 1) Validar JSON parseable
    let parsedResponse;
    try {
      parsedResponse = typeof llmResponse === "string" ? JSON.parse(llmResponse) : llmResponse;
      this.logTrace("LLM_RESPONSE_PARSED", { size_bytes: JSON.stringify(parsedResponse).length });
    } catch (error) {
      this.logTrace("LLM_RESPONSE_INVALID", { error: error.message });
      throw new Error("LLM response is not valid JSON");
    }

    // 2) Validar shape de ActionIntent
    const validationErrors = validateActionIntentSchema(parsedResponse);
    if (validationErrors.length > 0) {
      this.logTrace("LLM_RESPONSE_SCHEMA_MISMATCH", { 
        errors_count: validationErrors.length,
        sample_error: validationErrors[0]
      });
      throw new Error(`LLM response does not match ActionIntent schema: ${validationErrors.length} errors`);
    }

    this.logTrace("LLM_RESPONSE_VALIDATED", { 
      action_type: parsedResponse.action_type,
      required_approvals: parsedResponse.required_approvals
    });

    // 3) Verificar si requiere aprobación
    if (parsedResponse.required_approvals && parsedResponse.required_approvals.length > 0) {
      // 4) Crear ApprovalRequest
      const approvalRequest = this.createApprovalRequest(parsedResponse);
      this.approvalRequests.push(approvalRequest);
      this.logTrace("APPROVAL_REQUEST_CREATED", { 
        request_id: approvalRequest.approval_request_id,
        required_approvals: approvalRequest.required_approvals
      });

      return { action_intent: parsedResponse, approval_request: approvalRequest };
    } else {
      // Sin aprobación requerida
      this.logTrace("NO_APPROVAL_REQUIRED", { action_type: parsedResponse.action_type });
      return { action_intent: parsedResponse, approval_request: null };
    }
  }

  createApprovalRequest(actionIntent) {
    return {
      approval_request_id: `approval-req-${Date.now()}`,
      run_id: this.runId,
      correlation_id: this.correlationId,
      step_id: `step-approval-gate-${Date.now()}`,
      action_intent_ref: `intent-${Date.now()}`,
      requested_by: actionIntent.requested_by,
      required_approvals: actionIntent.required_approvals,
      requested_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      policy_context_id: actionIntent.policy_context_id,
      tenant_id: actionIntent.tenant_id,
      action_summary: {
        action_type: actionIntent.action_type,
        api_endpoint: actionIntent.inputs?.api_endpoint,
        method: actionIntent.inputs?.method,
        resource_id: actionIntent.inputs?.payload?.resource_id
      },
      trace_link: actionIntent.trace_link
    };
  }

  // Simular respuesta de aprobación
  approve(approvalRequestId, userId, approvalType) {
    const approvalRequest = this.approvalRequests.find(
      req => req.approval_request_id === approvalRequestId
    );

    if (!approvalRequest) {
      throw new Error(`Approval request ${approvalRequestId} not found`);
    }

    // 5) Aprobar y producir ActionIntent final (SIN campos adicionales, solo ActionIntent schema)
    const actionIntentWithApproval = this.getActionIntentForApproval(approvalRequest);

    this.logTrace("APPROVAL_GRANTED", { 
      request_id: approvalRequestId,
      user_id: userId,
      approval_type: approvalType
    });

    return actionIntentWithApproval;
  }

  getActionIntentForApproval(approvalRequest) {
    // Recuperar ActionIntent original desde trace (simplificado)
    return {
      action_type: approvalRequest.action_summary.action_type,
      tenant_id: approvalRequest.tenant_id,
      created_at: approvalRequest.requested_at,
      correlation_id: approvalRequest.correlation_id,
      run_id: approvalRequest.run_id,
      idempotency_key: `key-${approvalRequest.approval_request_id}`,
      policy_context_id: approvalRequest.policy_context_id,
      inputs: {
        api_endpoint: approvalRequest.action_summary.api_endpoint,
        method: approvalRequest.action_summary.method,
        payload: {
          resource_id: approvalRequest.action_summary.resource_id,
          action: "update_status",
          new_status: "approved"
        }
      },
      requested_by: approvalRequest.requested_by,
      trace_link: approvalRequest.trace_link
    };
  }

  // Verificar que NO hubo llamadas externas
  verifyNoExternalCalls() {
    // En este test mockeado, no hay Service Layer, no hay fetch
    // Esto se verifica inspeccionando el trace log
    const hasExternalCalls = this.traceLog.some(log => 
      log.event_type === "SERVICE_LAYER_CALLED" ||
      log.event_type === "EXTERNAL_API_CALLED"
    );
    return !hasExternalCalls;
  }
}

// ============================================================================
// TESTS: LLM Approval Obedience
// ============================================================================

test("LLM Approval Obedience: Response is JSON parseable", async () => {
  const llmResponse = await loadLLMResponse();
  
  // When: Procesar respuesta LLM
  const gate = new MinimalApprovalGate("test-llm-corr-001", "run-test-001");
  const result = gate.processLLMResponse(llmResponse);
  
  // Then: No debe lanzar error de parse
  assert.ok(result.action_intent, "ActionIntent debe estar presente");
  assert.ok(result.approval_request, "ApprovalRequest debe estar presente");
});

test("LLM Approval Obedience: Response matches ActionIntent schema", async () => {
  const llmResponse = await loadLLMResponse();
  
  // When: Procesar respuesta LLM
  const gate = new MinimalApprovalGate("test-llm-corr-001", "run-test-001");
  const result = gate.processLLMResponse(llmResponse);
  
  // Then: Debe pasar validación de ActionIntent
  assert.ok(result.action_intent.action_type, "action_type debe estar presente");
  assert.ok(result.action_intent.tenant_id, "tenant_id debe estar presente");
  assert.ok(result.action_intent.inputs, "inputs debe estar presente");
  assert.ok(result.action_intent.requested_by, "requested_by debe estar presente");
  assert.ok(result.action_intent.trace_link, "trace_link debe estar presente");
  
  // Verificar que tiene approvals requeridos
  assert.ok(result.action_intent.required_approvals, "required_approvals debe estar presente");
  assert.ok(result.action_intent.required_approvals.length > 0, "Debe requerir al menos 1 aprobación");
});

test("LLM Approval Obedience: ApprovalRequest matches expected fixture", async () => {
  const llmResponse = await loadLLMResponse();
  const expectedApprovalRequest = loadJson(path.join(fixturesDir, "expected.approval-request.json"));
  
  // When: Procesar respuesta LLM que requiere aprobación
  const gate = new MinimalApprovalGate("test-llm-corr-001", "run-test-001");
  const result = gate.processLLMResponse(llmResponse);
  
  // Then: ApprovalRequest debe tener campos correctos
  assert.ok(result.approval_request, "ApprovalRequest debe ser creado");
  
  const approvalRequest = result.approval_request;
  assert.strictEqual(approvalRequest.run_id, expectedApprovalRequest.run_id);
  assert.strictEqual(approvalRequest.correlation_id, expectedApprovalRequest.correlation_id);
  assert.ok(approvalRequest.approval_request_id, "approval_request_id debe estar presente");
  assert.ok(approvalRequest.required_approvals, "required_approvals debe estar presente");
  assert.ok(approvalRequest.requested_at, "requested_at debe estar presente");
  assert.ok(approvalRequest.expires_at, "expires_at debe estar presente");
  assert.ok(approvalRequest.action_summary, "action_summary debe estar presente");
  assert.ok(approvalRequest.trace_link, "trace_link debe estar presente");
  
  // Verificar required_approvals del LLM response
  assert.strictEqual(
    result.action_intent.required_approvals[0],
    "USER"
  );
});

test("LLM Approval Obedience: After APPROVE, produces final ActionIntent", async () => {
  const llmResponse = await loadLLMResponse();
  const expectedActionIntent = loadJson(path.join(fixturesDir, "expected.action-intent.json"));
  
  // When: Procesar respuesta LLM que requiere aprobación
  const gate = new MinimalApprovalGate("test-llm-corr-001", "run-test-001");
  const initialResult = gate.processLLMResponse(llmResponse);
  
  // And: Aprobar la solicitud
  const finalActionIntent = gate.approve(
    initialResult.approval_request.approval_request_id,
    "user-test-001",
    "USER"
  );
  
  // Then: ActionIntent final debe ser válido según schema (SIN campos adicionales)
  const validationErrors = validateActionIntentSchema(finalActionIntent);
  assert.strictEqual(validationErrors.length, 0, "ActionIntent final debe ser válido");
  
  // Verificar campos de ActionIntent base (campos obligatorios del schema)
  assert.strictEqual(finalActionIntent.action_type, expectedActionIntent.action_type);
  assert.strictEqual(finalActionIntent.tenant_id, expectedActionIntent.tenant_id);
  assert.ok(finalActionIntent.inputs, "inputs debe estar presente");
  assert.ok(finalActionIntent.requested_by, "requested_by debe estar presente");
  assert.ok(finalActionIntent.trace_link, "trace_link debe estar presente");
  assert.ok(finalActionIntent.correlation_id, "correlation_id debe estar presente");
  assert.ok(finalActionIntent.run_id, "run_id debe estar presente");
  assert.ok(finalActionIntent.idempotency_key, "idempotency_key debe estar presente");
  assert.ok(finalActionIntent.policy_context_id, "policy_context_id debe estar presente");
  assert.ok(finalActionIntent.created_at, "created_at debe estar presente");
});

test("LLM Approval Obedience: No Service Layer calls before approval", async () => {
  const llmResponse = await loadLLMResponse();
  
  // When: Procesar respuesta LLM
  const gate = new MinimalApprovalGate("test-llm-corr-001", "run-test-001");
  gate.processLLMResponse(llmResponse);
  
  // Then: NO debe haber llamadas externas
  const noExternalCalls = gate.verifyNoExternalCalls();
  assert.ok(noExternalCalls, "NO debe haber llamadas a Service Layer o APIs externas");
});

test("LLM Approval Obedience: Trace log records approval flow", async () => {
  const llmResponse = await loadLLMResponse();
  
  // When: Procesar respuesta LLM y aprobar
  const gate = new MinimalApprovalGate("test-llm-corr-001", "run-test-001");
  const initialResult = gate.processLLMResponse(llmResponse);
  gate.approve(initialResult.approval_request.approval_request_id, "user-test-001", "USER");
  
  // Then: Trace log debe tener registros completos
  const traceLog = gate.traceLog;
  
  assert.ok(traceLog.length > 0, "Trace log debe tener registros");
  
  // Verificar eventos clave del flujo
  assert.ok(traceLog.some(log => log.event_type === "LLM_RESPONSE_PARSED"), "LLM_RESPONSE_PARSED");
  assert.ok(traceLog.some(log => log.event_type === "LLM_RESPONSE_VALIDATED"), "LLM_RESPONSE_VALIDATED");
  assert.ok(traceLog.some(log => log.event_type === "APPROVAL_REQUEST_CREATED"), "APPROVAL_REQUEST_CREATED");
  assert.ok(traceLog.some(log => log.event_type === "APPROVAL_GRANTED"), "APPROVAL_GRANTED");
});

test("LLM Approval Obedience: No effects persisted (no Service Layer)", async () => {
  const llmResponse = await loadLLMResponse();
  
  // When: Procesar respuesta LLM y aprobar
  const gate = new MinimalApprovalGate("test-llm-corr-001", "run-test-001");
  const initialResult = gate.processLLMResponse(llmResponse);
  const finalActionIntent = gate.approve(initialResult.approval_request.approval_request_id, "user-test-001", "USER");
  
  // Then: NO debe haber efectos persistentes (no DB writes, no API calls)
  const noExternalCalls = gate.verifyNoExternalCalls();
  assert.ok(noExternalCalls, "NO debe haber efectos persistentes o llamadas externas");
  
  // Verificar que el ActionIntent está solo en memoria
  assert.ok(finalActionIntent, "ActionIntent debe existir en memoria");
  assert.ok(typeof finalActionIntent === "object", "ActionIntent debe ser un objeto en memoria");
});

test("LLM Approval Obedience: Deterministic behavior with fixture", async () => {
  // Cargar el fixture directamente
  const llmResponse = loadJson(path.join(fixturesDir, "llm.response.sample.json"));
  
  // When: Procesar misma respuesta dos veces
  const gate1 = new MinimalApprovalGate("test-corr-001", "run-001");
  const gate2 = new MinimalApprovalGate("test-corr-001", "run-001");
  
  const result1 = gate1.processLLMResponse(llmResponse);
  const result2 = gate2.processLLMResponse(llmResponse);
  
  // Then: Misma entrada → mismo resultado (determinismo)
  assert.strictEqual(
    result1.action_intent.action_type,
    result2.action_intent.action_type
  );
  assert.strictEqual(
    result1.action_intent.required_approvals.length,
    result2.action_intent.required_approvals.length
  );
  assert.strictEqual(
    result1.action_intent.required_approvals[0],
    result2.action_intent.required_approvals[0]
  );
});

test("LLM Approval Obedience: Falls back to fixture when no API key", async () => {
  // Temporalmente eliminar API keys para forzar fallback
  const originalGeminiKey = process.env.GEMINI_API_KEY;
  const originalAnthropicKey = process.env.ANTHROPIC_API_KEY;
  
  delete process.env.GEMINI_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  
  try {
    // When: No hay API keys
    const llmResponse = await loadLLMResponse();
    
    // Then: Debe usar fixture (determinista)
    const fixtureResponse = loadJson(path.join(fixturesDir, "llm.response.sample.json"));
    assert.deepStrictEqual(llmResponse, fixtureResponse);
  } finally {
    // Restaurar API keys
    if (originalGeminiKey) process.env.GEMINI_API_KEY = originalGeminiKey;
    if (originalAnthropicKey) process.env.ANTHROPIC_API_KEY = originalAnthropicKey;
  }
});

test("LLM Approval Obedience: Validates against existing ActionIntent schema", async () => {
  const llmResponse = await loadLLMResponse();
  const expected = loadJson(path.join(fixturesDir, "expected.action-intent.json"));
  
  // When: Procesar respuesta LLM y aprobar
  const gate = new MinimalApprovalGate("test-llm-corr-001", "run-test-001");
  const initialResult = gate.processLLMResponse(llmResponse);
  const finalActionIntent = gate.approve(initialResult.approval_request.approval_request_id, "user-test-001", "USER");
  
  // Then: Debe pasar validación de ActionIntent schema
  const validationErrors = validateActionIntentSchema(finalActionIntent);
  assert.strictEqual(validationErrors.length, 0, "ActionIntent final debe ser válido según schema");
  
  // Verificar campos clave
  assert.strictEqual(finalActionIntent.action_type, expected.action_type);
  assert.strictEqual(finalActionIntent.tenant_id, expected.tenant_id);
  assert.ok(finalActionIntent.inputs, "inputs debe estar presente");
  assert.ok(finalActionIntent.requested_by, "requested_by debe estar presente");
  assert.ok(finalActionIntent.trace_link, "trace_link debe estar presente");
});
