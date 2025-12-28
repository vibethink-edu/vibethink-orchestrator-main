/**
 * Term Registry - Source of Truth for i18n terminology
 *
 * Implements OpenAI recommendation: separate i18n layers from taxonomy metadata.
 *
 * Architecture:
 * - 3 physical layers (transversal, concept, workspace)
 * - Taxonomy as metadata (vertical → subvertical → module)
 * - Fallback chain for overrides
 *
 * @see docs/i18n/RFC_I18N_TAXONOMY_ARCHITECTURE.md
 */

export type Layer = 'transversal' | 'concept' | 'workspace';

export type Vertical =
  | 'healthcare'
  | 'hospitality'
  | 'professional-services'
  | 'media-entertainment'
  | 'nonprofit'
  | 'technology';

export type SubVertical =
  // Healthcare
  | 'hospital'
  | 'clinic'
  | 'dental'
  | 'mental-health'
  | 'oncology'
  // Hospitality
  | 'restaurant-qsr'
  | 'restaurant-fine-dining'
  | 'hotel'
  | 'catering'
  // Professional Services
  | 'legal'
  | 'consulting'
  | 'accounting-firm'
  // Media & Entertainment
  | 'radio'
  | 'tv'
  | 'podcast'
  | 'streaming'
  | 'youtube'
  // Nonprofit
  | 'health-nonprofit'
  | 'education-nonprofit'
  | 'environmental'
  | 'human-rights'
  // Technology
  | 'saas'
  | 'agency';

export type Module =
  | 'emr'
  | 'pos'
  | 'case-management'
  | 'broadcast-studio'
  | 'donor-portal'
  | 'client-portal';

export interface TermScope {
  vertical?: Vertical;
  subvertical?: SubVertical;
  module?: Module;
}

export interface TermDefinition {
  /** Stable key (never changes) */
  key: string;

  /** Physical layer location */
  layer: Layer;

  /** Taxonomy scopes (metadata, not file structure) */
  scopes: TermScope;

  /** Translations by locale */
  translations: Record<string, string>;

  /** Synonyms in other contexts (for AI disambiguation) */
  synonyms?: string[];

  /** Usage examples */
  examples?: string[];

  /** Team/person responsible */
  owner: string;

  /** Semantic version */
  version: string;

  /** If deprecated, migration path */
  deprecated?: {
    replacedBy?: string;
    reason: string;
    removedIn?: string;
  };

  /** NAICS/GICS mappings for interoperability */
  external?: {
    naics?: string[];
    gics?: string[];
  };
}

/**
 * Example: "Patient" term with scope-based overrides
 */
export const CANONICAL_PERSON_PRIMARY: TermDefinition = {
  key: "concept.person_primary",
  layer: "concept",
  scopes: {
    vertical: "healthcare"
  },
  translations: {
    en: "Patient",
    es: "Paciente",
    ar: "مريض",
    zh: "患者",
    fr: "Patient",
    pt: "Paciente",
    de: "Patient",
    it: "Paziente",
    ko: "환자"
  },
  synonyms: ["client", "guest", "beneficiary"],
  examples: [
    "Register new patient",
    "Patient portal access"
  ],
  owner: "healthcare-team",
  version: "1.0.0"
};

/**
 * Example: Scope-based label overrides
 *
 * The SAME canonical concept can have different preferred labels
 * based on vertical/subvertical context.
 */
export const PERSON_PRIMARY_OVERRIDES: Record<string, string> = {
  "healthcare": "Patient",
  "legal": "Client",
  "hospitality": "Guest",
  "nonprofit": "Beneficiary",
  "technology": "User"
};

/**
 * Taxonomy node with external mappings
 */
export interface TaxonomyNode {
  id: string;
  name: string;
  level: 'vertical' | 'subvertical' | 'niche';
  parent?: string;
  external?: {
    naics?: string[];
    gics?: string[];
  };
}

/**
 * Example taxonomy: Healthcare → Hospital
 */
export const TAXONOMY_HEALTHCARE_HOSPITAL: TaxonomyNode = {
  id: "healthcare-hospital",
  name: "Hospital",
  level: "subvertical",
  parent: "healthcare",
  external: {
    naics: ["622110"], // General Medical and Surgical Hospitals
    gics: ["35101010"] // Health Care Equipment (GICS)
  }
};

/**
 * Term Registry interface for runtime lookups
 */
export interface TermRegistry {
  /** Get term by key */
  getTerm(key: string): TermDefinition | undefined;

  /** Get term with scope-based override */
  getTermForScope(key: string, scope: TermScope): string;

  /** Search terms by similarity */
  searchTerms(query: string, scope?: TermScope): TermDefinition[];

  /** Validate if term already exists */
  exists(key: string): boolean;

  /** Add new term (with governance checks) */
  addTerm(term: TermDefinition): Promise<void>;

  /** Deprecate term with migration path */
  deprecateTerm(key: string, migration: { replacedBy?: string; reason: string }): Promise<void>;
}

/**
 * In-memory implementation (can be backed by database)
 */
export class InMemoryTermRegistry implements TermRegistry {
  private terms: Map<string, TermDefinition> = new Map();

  getTerm(key: string): TermDefinition | undefined {
    return this.terms.get(key);
  }

  getTermForScope(key: string, scope: TermScope): string {
    const term = this.getTerm(key);
    if (!term) return key; // Fallback to key if not found

    // Apply scope-based override if exists
    if (scope.vertical && PERSON_PRIMARY_OVERRIDES[scope.vertical]) {
      return PERSON_PRIMARY_OVERRIDES[scope.vertical];
    }

    // Fallback to default translation
    return term.translations['en'] || key;
  }

  searchTerms(query: string, scope?: TermScope): TermDefinition[] {
    const results: TermDefinition[] = [];

    for (const term of this.terms.values()) {
      // Simple text search (can be replaced with embedding similarity)
      const matchesQuery = term.key.includes(query) ||
                          Object.values(term.translations).some(t => t.toLowerCase().includes(query.toLowerCase()));

      // Filter by scope if provided
      const matchesScope = !scope || this.scopeMatches(term.scopes, scope);

      if (matchesQuery && matchesScope) {
        results.push(term);
      }
    }

    return results;
  }

  exists(key: string): boolean {
    return this.terms.has(key);
  }

  async addTerm(term: TermDefinition): Promise<void> {
    // Governance check: prevent duplicates
    if (this.exists(term.key)) {
      throw new Error(`Term ${term.key} already exists`);
    }

    // Governance check: similar terms warning
    const similar = this.searchTerms(term.translations['en']);
    if (similar.length > 0) {
      console.warn(`Similar terms found for "${term.translations['en']}":`, similar.map(t => t.key));
    }

    this.terms.set(term.key, term);
  }

  async deprecateTerm(key: string, migration: { replacedBy?: string; reason: string }): Promise<void> {
    const term = this.getTerm(key);
    if (!term) throw new Error(`Term ${key} not found`);

    term.deprecated = {
      replacedBy: migration.replacedBy,
      reason: migration.reason,
      removedIn: 'next-major-version'
    };

    this.terms.set(key, term);
  }

  private scopeMatches(termScope: TermScope, queryScope: TermScope): boolean {
    if (queryScope.vertical && termScope.vertical !== queryScope.vertical) return false;
    if (queryScope.subvertical && termScope.subvertical !== queryScope.subvertical) return false;
    if (queryScope.module && termScope.module !== queryScope.module) return false;
    return true;
  }
}

/**
 * Global registry instance
 */
export const termRegistry = new InMemoryTermRegistry();

/**
 * Initialize with existing terms
 */
export function initializeTermRegistry() {
  termRegistry.addTerm(CANONICAL_PERSON_PRIMARY);
  // ... add more terms from existing JSON files
}
