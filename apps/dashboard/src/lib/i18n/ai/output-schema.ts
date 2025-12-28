/**
 * AI Classifier Output Schema
 * Strict Zod validation for LLM responses to ensure type safety
 */

import { z } from 'zod';

export const candidateSchema = z.object({
  key: z.string(),
  score: z.number().min(0).max(1),
  source: z.enum(['registry', 'translation']),
});

export type Candidate = z.infer<typeof candidateSchema>;

export const classifierOutputSchema = z.object({
  action: z.enum(['use_existing', 'propose_new', 'needs_review']),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
  key: z.string().optional(),
  layer: z.enum(['transversal', 'concept', 'workspace']).optional(),
  namespace: z.string().optional(),
  suggestedKeys: z.array(z.string()).optional(),
  matchedCandidates: z.array(candidateSchema).optional(),
});

export type ClassifierOutput = z.infer<typeof classifierOutputSchema>;

/**
 * Example valid output:
 *
 * {
 *   "action": "use_existing",
 *   "confidence": 0.95,
 *   "reason": "Exact match found in registry",
 *   "key": "pos.fire_order",
 *   "matchedCandidates": [
 *     { "key": "pos.fire_order", "score": 0.95, "source": "registry" }
 *   ]
 * }
 *
 * {
 *   "action": "propose_new",
 *   "confidence": 0.87,
 *   "reason": "Term is specific to POS kitchen workflow, not found in registry",
 *   "layer": "workspace",
 *   "namespace": "workspace/pos",
 *   "suggestedKeys": ["pos.fire_order", "pos.kitchen_fire_order", "pos.expedite_fire_order"],
 *   "matchedCandidates": [
 *     { "key": "pos.expedite_order", "score": 0.72, "source": "registry" },
 *     { "key": "pos.order_ready", "score": 0.58, "source": "translation" }
 *   ]
 * }
 *
 * {
 *   "action": "needs_review",
 *   "confidence": 0.62,
 *   "reason": "Low confidence. Multiple possible placements: transversal/common vs workspace/pos",
 *   "matchedCandidates": [
 *     { "key": "pos.table_status", "score": 0.45, "source": "registry" },
 *     { "key": "booking.turn_time", "score": 0.42, "source": "registry" }
 *   ]
 * }
 */
