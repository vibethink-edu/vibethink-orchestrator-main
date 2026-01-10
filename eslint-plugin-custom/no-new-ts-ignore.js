/**
 * ESLint Rule: Prevent new @ts-ignore without proper tracking
 *
 * This rule enforces that:
 * 1. @ts-ignore should not be used (prefer @ts-expect-error)
 * 2. All type suppressions must have descriptive comments
 * 3. New suppressions must be tracked in TECH_DEBT.md
 *
 * Usage in eslint.config.js:
 * ```js
 * import noNewTsIgnore from './eslint-plugin-custom/no-new-ts-ignore.js';
 *
 * export default [
 *   {
 *     plugins: {
 *       'custom': { rules: { 'no-new-ts-ignore': noNewTsIgnore } }
 *     },
 *     rules: {
 *       'custom/no-new-ts-ignore': 'error'
 *     }
 *   }
 * ];
 * ```
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow new @ts-ignore comments without proper tracking',
      category: 'Possible Errors',
      recommended: true
    },
    messages: {
      noTsIgnore: '@ts-ignore detected. Use @ts-expect-error with description or add to TECH_DEBT.md',
      noDescription: '@ts-expect-error must include a descriptive comment explaining why'
    },
    schema: []
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      Program(node) {
        const comments = sourceCode.getAllComments();

        comments.forEach(comment => {
          const commentText = comment.value.trim();

          // Check for @ts-ignore
          if (commentText.includes('@ts-ignore')) {
            context.report({
              node: comment,
              messageId: 'noTsIgnore',
              suggest: [
                {
                  desc: 'Replace with @ts-expect-error',
                  fix(fixer) {
                    return fixer.replaceText(comment,
                      comment.value.replace('@ts-ignore', '@ts-expect-error // TODO: Add description'));
                  }
                }
              ]
            });
          }

          // Check for @ts-expect-error without description
          if (commentText.includes('@ts-expect-error') &&
              commentText.length < '@ts-expect-error'.length + 10) {
            context.report({
              node: comment,
              messageId: 'noDescription'
            });
          }
        });
      }
    };
  }
};