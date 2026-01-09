/**
 * Document Profile - Parametric Configuration
 * 
 * CRITICAL: This is the KEY to domain-agnostic design.
 * Instead of hardcoding "prescription" or "invoice" logic,
 * we define PROFILES that govern extraction behavior.
 * 
 * @module document-intelligence/contracts/document-profile
 * @version 1.0.0
 */

/**
 * Document Profile
 * Defines how to process a specific document type.
 * 
 * Examples:
 * - clinical-prescription-v1
 * - invoice-items-v1
 * - expense-receipt-v1
 * - legal-contract-v1
 */
export interface DocumentProfile {
    /** Primary key */
    id: string;

    /** Tenant ID (null = global/platform profile) */
    tenant_id?: string;

    /** Profile key (unique identifier) */
    profile_key: string;

    /** Profile version (for safe updates) */
    profile_version: number;

    /** Display name */
    display_name: string;

    /** Description */
    description?: string;

    /** Expected item types to extract */
    expected_item_types: string[];
    // Examples: ['medication', 'dosage', 'frequency'] OR ['line_item', 'amount', 'tax']

    /** Flags to detect */
    flags_enabled: string[];
    // Examples: ['crossed_out', 'handwritten', 'illegible']

    /** Confidence thresholds per layer */
    confidence_thresholds: {
        ocr: number;           // Minimum OCR confidence (0.0-1.0)
        extraction: number;    // Minimum extraction confidence
        flag_detection?: number; // Minimum flag confidence
    };

    /** Normalizers (optional) */
    normalizers?: Record<string, string>;
    // Example: { "medication": "drug_name_normalizer" }

    /** Validation schema (JSON Schema, optional) */
    validation_schema?: Record<string, unknown>;

    /** Active status */
    is_active: boolean;

    /** Audit fields */
    created_at: Date;
    updated_at: Date;
    created_by_user_id?: string;
}

/**
 * Profile Application Result
 * Returned when applying a profile to a document.
 */
export interface ProfileApplicationResult {
    profile_id: string;
    profile_key: string;
    expected_item_types: string[];
    flags_enabled: string[];
    thresholds: DocumentProfile['confidence_thresholds'];
}

/**
 * Built-in Profile Keys
 * Platform-provided profiles (tenant_id = null).
 * 
 * NOTE: These are examples. Actual profiles are stored in DB.
 */
export const BUILTIN_PROFILES = {
    CLINICAL_PRESCRIPTION_V1: 'clinical-prescription-v1',
    INVOICE_ITEMS_V1: 'invoice-items-v1',
    EXPENSE_RECEIPT_V1: 'expense-receipt-v1',
    LEGAL_CONTRACT_V1: 'legal-contract-v1',
} as const;

/**
 * Example Profile: Clinical Prescription
 * 
 * This is a REFERENCE IMPLEMENTATION.
 * Actual profiles are stored in `document_profiles` table.
 */
export const EXAMPLE_CLINICAL_PRESCRIPTION_PROFILE: Omit<DocumentProfile, 'id' | 'created_at' | 'updated_at'> = {
    tenant_id: undefined, // Global profile
    profile_key: 'clinical-prescription-v1',
    profile_version: 1,
    display_name: 'Clinical Prescription (v1)',
    description: 'Extract medications, dosages, and frequencies from prescriptions',
    expected_item_types: ['medication', 'dosage', 'frequency', 'duration'],
    flags_enabled: ['crossed_out', 'handwritten', 'illegible'],
    confidence_thresholds: {
        ocr: 0.85,
        extraction: 0.75,
        flag_detection: 0.70,
    },
    normalizers: {
        medication: 'drug_name_normalizer', // TODO: Implement in Phase 2
    },
    is_active: true,
};

/**
 * Example Profile: Invoice Line Items
 * 
 * This demonstrates domain-agnostic reusability.
 * Same infrastructure, different profile.
 */
export const EXAMPLE_INVOICE_PROFILE: Omit<DocumentProfile, 'id' | 'created_at' | 'updated_at'> = {
    tenant_id: undefined,
    profile_key: 'invoice-items-v1',
    profile_version: 1,
    display_name: 'Invoice Line Items (v1)',
    description: 'Extract line items, quantities, and amounts from invoices',
    expected_item_types: ['description', 'quantity', 'unit_price', 'total'],
    flags_enabled: ['crossed_out', 'amended'],
    confidence_thresholds: {
        ocr: 0.90,
        extraction: 0.80,
    },
    validation_schema: {
        type: 'object',
        required: ['quantity', 'unit_price'],
        properties: {
            quantity: { type: 'number', minimum: 0 },
            unit_price: { type: 'number', minimum: 0 },
        },
    },
    is_active: true,
};
