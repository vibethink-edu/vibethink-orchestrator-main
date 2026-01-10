module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow TEXT type for fields that should use ENUM (type, status, role, etc)',
            category: 'Best Practices',
            recommended: true
        },
        messages: {
            useEnum: 'Use PostgreSQL ENUM instead of TEXT for "{{ field }}" field. Enums provide better data integrity.'
        },
        schema: [] // no options
    },
    create(context) {
        // fields that strongly suggest an enum usage
        const ENUM_CANDIDATES = ['type', 'status', 'role', 'tier', 'severity', 'mode', 'kind'];

        return {
            Literal(node) {
                // We are looking for values explicitly set to "TEXT"
                if (node.value === 'TEXT') {
                    const parent = node.parent;

                    // Check if this is an object property: { type: "TEXT" }
                    if (parent && parent.type === 'Property') {
                        const fieldName = parent.key.name || parent.key.value;

                        if (fieldName && ENUM_CANDIDATES.some(candidate =>
                            fieldName.toLowerCase().includes(candidate)
                        )) {
                            context.report({
                                node,
                                messageId: 'useEnum',
                                data: { field: fieldName }
                            });
                        }
                    }
                }
            }
        };
    }
};
