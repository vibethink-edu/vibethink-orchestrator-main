/**
 * Product Branding Configuration
 * 
 * This file centralizes all product branding strings.
 * Update .env.local to change the product name across the entire app.
 * 
 * Monorepo-compliant: Can be imported from any app in the workspace.
 */

export const PRODUCT_CONFIG = {
    // Product Name (configurable via env)
    name: process.env.NEXT_PUBLIC_PRODUCT_NAME || 'ViTo',

    // Tagline
    tagline: process.env.NEXT_PUBLIC_PRODUCT_TAGLINE || 'El amigo que orquesta tu empresa',

    // Description
    description: process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION || 'AI-powered business orchestration platform',

    // Company
    company: process.env.NEXT_PUBLIC_COMPANY_NAME || 'VibeThink',

    // Logo URLs (optional)
    logo: process.env.NEXT_PUBLIC_LOGO_URL || null,
    favicon: process.env.NEXT_PUBLIC_FAVICON_URL || null,

    // Gradient fallback (when no logo)
    gradient: {
        from: 'from-blue-500',
        to: 'to-purple-600',
        text: 'P' // First letter of product name
    }
} as const

/**
 * Get the first letter of the product name for gradient logo
 */
export const getProductInitial = () => {
    return PRODUCT_CONFIG.name.charAt(0).toUpperCase()
}

/**
 * Get full branding object
 */
export const getBranding = () => ({
    ...PRODUCT_CONFIG,
    gradient: {
        ...PRODUCT_CONFIG.gradient,
        text: getProductInitial()
    }
})


