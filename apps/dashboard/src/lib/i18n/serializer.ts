/**
 * Translation Serialization for SSR
 * 
 * Handles serialization and deserialization of translations
 * for Server-Side Rendering and Client Hydration
 */

import { TranslationDictionary, TranslationNamespace, Locale } from './types';

/**
 * Serialized translations structure
 */
export interface SerializedTranslations {
    locale: Locale;
    namespaces: Record<TranslationNamespace, TranslationDictionary>;
}

/**
 * Serialize translations to JSON string for embedding in HTML
 */
export function serializeTranslations(
    locale: Locale,
    namespaces: Record<string, TranslationDictionary>
): string {
    const data: SerializedTranslations = {
        locale,
        namespaces: namespaces as Record<TranslationNamespace, TranslationDictionary>,
    };

    return JSON.stringify(data);
}

/**
 * Deserialize translations from JSON string
 */
export function deserializeTranslations(json: string): SerializedTranslations | null {
    try {
        const data = JSON.parse(json);

        if (!data || typeof data !== 'object') {
            console.error('[i18n] Invalid serialized translation data');
            return null;
        }

        if (!data.locale || !data.namespaces) {
            console.error('[i18n] Missing locale or namespaces in serialized data');
            return null;
        }

        return data as SerializedTranslations;
    } catch (error) {
        console.error('[i18n] Failed to deserialize translations:', error);
        return null;
    }
}

/**
 * Inject serialized translations into window (client-side only)
 */
export function injectTranslations(serialized: string): void {
    if (typeof window === 'undefined') {
        console.warn('[i18n] injectTranslations should only be called client-side');
        return;
    }

    (window as any).__PRELOADED_TRANSLATIONS__ = serialized;
}

/**
 * Extract preloaded translations from window (client-side only)
 */
export function extractPreloadedTranslations(): SerializedTranslations | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const serialized = (window as any).__PRELOADED_TRANSLATIONS__;
    if (!serialized) {
        return null;
    }

    return deserializeTranslations(serialized);
}
