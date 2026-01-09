# Canonical Fixtures

This directory contains the **Source of Truth** for test data. 
All data here must strictly match the **Sealed Ontology** and **Rector Pack v1** definitions.

## Rules
1. **Immutable:** Once a canonical fixture is proven, do not modify it without a formal ontology update.
2. **Small:** Only include the necessary fields for the domain entity.
3. **No PII:** Use synthetic data only.
4. **Referential Integrity:** IDs used here should be consistent across multiple canonical fixtures if they represent the same entity relations.
