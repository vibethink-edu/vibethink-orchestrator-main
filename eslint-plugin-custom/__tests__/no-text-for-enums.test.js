const { RuleTester } = require('eslint');
const rule = require('../no-text-for-enums');

const ruleTester = new RuleTester({
    // Setting ecmaVersion to support modern JS if needed, though simple literals work in almost any version
    languageOptions: { ecmaVersion: 2020 }
});

ruleTester.run('no-text-for-enums', rule, {
    valid: [
        // Non-enum candidate fields
        { code: 'const schema = { name: "TEXT", description: "TEXT" }' },
        // Using correct ENUM types
        { code: 'const schema = { type: "celebrity_type", status: "entity_status" }' },
        // Not "TEXT" value
        { code: 'const schema = { type: "VARCHAR(50)" }' }
    ],
    invalid: [
        {
            code: 'const schema = { type: "TEXT" }',
            errors: [{ messageId: 'useEnum' }]
        },
        {
            code: 'const schema = { entity_status: "TEXT" }',
            errors: [{ messageId: 'useEnum' }]
        },
        {
            code: 'const user = { role: "TEXT" }',
            errors: [{ messageId: 'useEnum' }]
        },
        {
            code: 'const config = { deployment_tier: "TEXT" }',
            errors: [{ messageId: 'useEnum' }]
        }
    ]
});
