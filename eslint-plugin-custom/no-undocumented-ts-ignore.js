/**
 * ESLint Rule: No @ts-ignore without TECH_DEBT tracking
 * 
 * Prevents blind suppression of TypeScript errors.
 * Forces developers/AIs to either:
 * 1. Fix the root cause
 * 2. Use @ts-expect-error with description
 * 3. Document in TECH_DEBT.md
 */

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow @ts-ignore without proper tracking',
            category: 'Best Practices',
            recommended: true
        },
        messages: {
            noTsIgnore: '@ts-ignore detected. Use @ts-expect-error with description or add to TECH_DEBT.md',
            noTsIgnoreWithoutDescription: '@ts-ignore must have a descriptive comment explaining why'
        },
        schema: []
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        return {
            Program() {
                const comments = sourceCode.getAllComments();

                comments.forEach(comment => {
                    const value = comment.value.trim();

                    // Check for @ts-ignore
                    if (value.includes('@ts-ignore')) {
                        // Check if there's a description
                        const hasDescription = value.split('@ts-ignore')[1]?.trim().length > 10;

                        if (!hasDescription) {
                            context.report({
                                loc: comment.loc,
                                messageId: 'noTsIgnore',
                                fix(fixer) {
                                    // Auto-fix: Replace @ts-ignore with @ts-expect-error
                                    const newComment = comment.value.replace('@ts-ignore', '@ts-expect-error - TODO: Add description');
                                    return fixer.replaceText(comment, `// ${newComment}`);
                                }
                            });
                        }
                    }
                });
            }
        };
    }
};
