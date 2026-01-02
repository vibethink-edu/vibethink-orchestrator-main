/**
 * Policy Contracts for Ingestion
 * 
 * Defines the contract for the Policy Layer's involvement in ingestion.
 * Complies with WIT-ESI-002: Ingestion never occurs without Policy check.
 */

import { SignalEvent } from "./events";

export interface PolicyDecision {
    allow: boolean;
    reason?: string;
    // Future: retention, visibility, redaction policies can hang here
}

export interface PolicyEvaluator {
    /**
     * Evaluate a signal against active policies.
     * MUST be called before persistence.
     */
    evaluate(event: SignalEvent): PolicyDecision;
}
