# Deterministic Generators

This directory contains factories and generators for dynamic test data.

## Rules
1. **Always Seeded:** Every generator must use a fixed seed to ensure reproducibility.
2. **Stateless:** Generators should not rely on external state or network.
3. **Canonical Base:** Use `tests/fixtures/canonical` as a base for complex object generation when possible.
4. **Controlled Entropy:** Avoid `Math.random()` or unseeded `faker`.

## Usage Example
```typescript
import { userGenerator } from './user-generator';

// Always produces the same user for seed 42
const user = userGenerator({ seed: 42 });
```
