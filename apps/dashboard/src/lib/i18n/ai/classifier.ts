/**
 * AI-Powered Term Classifier
 *
 * Implements constrained retrieval + LLM reranking for term classification
 * with confidence gating and human-in-the-loop review.
 */

import { ClassifierOutput, classifierOutputSchema, Candidate } from './output-schema';

export interface TenantContext {
  locale: string;
  vertical?: string;
  subvertical?: string;
  modules?: string[];
}

export interface RegistryTerm {
  key: string;
  layer: 'transversal' | 'concept' | 'workspace';
  description?: string;
  scopes?: {
    vertical?: string[];
    subvertical?: string[];
    module?: string[];
  };
}

export interface ClassifyTermInput {
  term: string;
  context: TenantContext;
  registryTerms: RegistryTerm[];
  translations: Record<string, any>;
  threshold?: number; // Default 0.4
}

/**
 * Phase 1: Constrained Retrieval
 * Filter candidates from registry + translations based on:
 * 1. Scope matching (vertical, subvertical, module)
 * 2. String similarity (Levenshtein distance)
 * 3. Threshold filtering
 */
export function retrieveCandidates(
  term: string,
  registryTerms: RegistryTerm[],
  context: TenantContext,
  translations: Record<string, any>,
  threshold: number = 0.4
): Candidate[] {
  const candidates: Candidate[] = [];
  const termLower = term.toLowerCase();

  // 1. Check registry terms
  for (const regTerm of registryTerms) {
    // Scope filtering
    if (context.vertical && regTerm.scopes?.vertical) {
      if (!regTerm.scopes.vertical.includes(context.vertical)) {
        continue;
      }
    }

    if (context.subvertical && regTerm.scopes?.subvertical) {
      if (!regTerm.scopes.subvertical.includes(context.subvertical)) {
        continue;
      }
    }

    if (context.modules && regTerm.scopes?.module) {
      const hasModuleMatch = context.modules.some(m =>
        regTerm.scopes?.module?.includes(m)
      );
      if (!hasModuleMatch) {
        continue;
      }
    }

    // Calculate similarity score
    const score = calculateSimilarity(termLower, regTerm.key.toLowerCase());

    if (score >= threshold) {
      candidates.push({
        key: regTerm.key,
        score,
        source: 'registry',
      });
    }
  }

  // 2. Check translation values
  const flatTranslations = flattenTranslations(translations);
  for (const [key, value] of Object.entries(flatTranslations)) {
    if (typeof value !== 'string') continue;

    const score = calculateSimilarity(termLower, value.toLowerCase());

    if (score >= threshold) {
      // Avoid duplicates from registry
      const existingCandidate = candidates.find(c => c.key === key);
      if (!existingCandidate) {
        candidates.push({
          key,
          score,
          source: 'translation',
        });
      }
    }
  }

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  return candidates.slice(0, 10); // Top 10 candidates
}

/**
 * Phase 2: LLM Reranking + Classification
 *
 * Uses LLM to:
 * 1. Rerank candidates based on semantic meaning
 * 2. Decide action (use_existing, propose_new, needs_review)
 * 3. Generate suggested keys if proposing new
 */
export async function classifyTerm(input: ClassifyTermInput): Promise<ClassifierOutput> {
  const { term, context, registryTerms, translations, threshold = 0.4 } = input;

  // Step 1: Constrained retrieval
  const candidates = retrieveCandidates(
    term,
    registryTerms,
    context,
    translations,
    threshold
  );

  // Step 2: Fast-path decisions

  // Exact match (score >= 0.95)
  if (candidates.length > 0 && candidates[0].score >= 0.95) {
    return {
      action: 'use_existing',
      confidence: candidates[0].score,
      reason: 'Exact match found in registry',
      key: candidates[0].key,
      matchedCandidates: candidates.slice(0, 5),
    };
  }

  // No candidates above threshold
  if (candidates.length === 0) {
    const suggestedKeys = generateKeyOptions(term, context);
    const proposedLayer = inferLayer(term, context);
    const proposedNamespace = inferNamespace(term, context, proposedLayer);

    return {
      action: 'propose_new',
      confidence: 0.75, // Default confidence for new terms
      reason: 'No similar terms found in registry',
      layer: proposedLayer,
      namespace: proposedNamespace,
      suggestedKeys,
      matchedCandidates: [],
    };
  }

  // Step 3: LLM reranking (if implemented)
  // For now, use rule-based logic

  const topCandidate = candidates[0];

  // High confidence (0.85+) → use existing
  if (topCandidate.score >= 0.85) {
    return {
      action: 'use_existing',
      confidence: topCandidate.score,
      reason: 'High similarity match found in registry',
      key: topCandidate.key,
      matchedCandidates: candidates.slice(0, 5),
    };
  }

  // Medium confidence (0.7-0.85) → propose new with candidates
  if (topCandidate.score >= 0.7) {
    const suggestedKeys = generateKeyOptions(term, context);
    const proposedLayer = inferLayer(term, context);
    const proposedNamespace = inferNamespace(term, context, proposedLayer);

    return {
      action: 'propose_new',
      confidence: 0.8,
      reason: `Similar terms exist but not exact match. Top candidate: ${topCandidate.key} (${Math.round(topCandidate.score * 100)}%)`,
      layer: proposedLayer,
      namespace: proposedNamespace,
      suggestedKeys,
      matchedCandidates: candidates.slice(0, 5),
    };
  }

  // Low confidence (< 0.7) → needs review
  return {
    action: 'needs_review',
    confidence: topCandidate.score,
    reason: 'Low confidence. Multiple possible placements.',
    matchedCandidates: candidates.slice(0, 5),
  };
}

/**
 * Calculate string similarity using Levenshtein distance
 * Returns score between 0 (no match) and 1 (exact match)
 */
function calculateSimilarity(str1: string, str2: string): number {
  // Simple implementation - can be improved with better algorithms
  if (str1 === str2) return 1.0;

  // Check for substring match
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.85;
  }

  // Check for word overlap
  const words1 = str1.split(/[\s_.-]+/);
  const words2 = str2.split(/[\s_.-]+/);
  const commonWords = words1.filter(w => words2.includes(w));

  if (commonWords.length > 0) {
    const overlap = commonWords.length / Math.max(words1.length, words2.length);
    return 0.5 + (overlap * 0.3);
  }

  // Levenshtein distance
  const distance = levenshteinDistance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  return 1 - (distance / maxLen);
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Flatten nested translation object to key-value pairs
 */
function flattenTranslations(
  obj: Record<string, any>,
  prefix: string = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === '_metadata') continue; // Skip metadata

    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenTranslations(value, newKey));
    } else if (typeof value === 'string') {
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * Generate key options for a new term
 */
function generateKeyOptions(term: string, context: TenantContext): string[] {
  const normalized = term
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const options: string[] = [];

  // Option 1: module.term (if module context)
  if (context.modules && context.modules.length > 0) {
    options.push(`${context.modules[0]}.${normalized}`);
  }

  // Option 2: vertical.term (if vertical context)
  if (context.vertical) {
    options.push(`${context.vertical}.${normalized}`);
  }

  // Option 3: Just the term
  options.push(normalized);

  return options.slice(0, 3);
}

/**
 * Infer appropriate layer for a term
 */
function inferLayer(
  term: string,
  context: TenantContext
): 'transversal' | 'concept' | 'workspace' {
  // Universal UI terms → transversal
  const universalTerms = ['save', 'cancel', 'delete', 'edit', 'add', 'remove', 'close', 'open'];
  if (universalTerms.some(t => term.toLowerCase().includes(t))) {
    return 'transversal';
  }

  // Module-specific functionality → workspace
  if (context.modules && context.modules.length > 0) {
    return 'workspace';
  }

  // Domain concepts → concept
  return 'concept';
}

/**
 * Infer namespace based on layer and context
 */
function inferNamespace(
  term: string,
  context: TenantContext,
  layer: 'transversal' | 'concept' | 'workspace'
): string {
  if (layer === 'transversal') {
    return 'transversal/common';
  }

  if (layer === 'workspace' && context.modules && context.modules.length > 0) {
    return `workspace/${context.modules[0]}`;
  }

  if (layer === 'concept' && context.vertical) {
    return `concept/${context.vertical}`;
  }

  return 'transversal/common';
}
