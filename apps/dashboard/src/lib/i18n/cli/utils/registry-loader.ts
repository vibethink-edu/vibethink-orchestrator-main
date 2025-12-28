/**
 * Registry Loader
 * Loads term registry from term-registry.ts
 */

import { RegistryTerm } from '../../ai/classifier';

export async function loadRegistry(): Promise<{ terms: RegistryTerm[] }> {
  // For now, return empty registry
  // TODO: Implement actual registry loading from term-registry.ts
  return {
    terms: [],
  };
}

export async function saveRegistry(registry: { terms: RegistryTerm[] }): Promise<void> {
  // TODO: Implement registry persistence
  console.log('Registry save not implemented yet');
}
