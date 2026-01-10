# Release Operations

## Release Flow
1. **Freeze**: Code freeze on `main` branch.
2. **Tag**: Create git tag `vX.Y.Z`.
3. **Build**: CI builds artifacts (Docker, NPM).
4. **Deploy**: Staged rollout to Staging -> Production.

## Hotfixes
- Branch from tag: `hotfix/vX.Y.Z+1`.
- Review and Merge to `main`.
- Cherry-pick to release branch if applicable.

## Artifacts
- Docker images tagged with version.
- `CHANGELOG.md` updated with release date.
- `docs/operations/RELEASES.md` serves as process definition.
