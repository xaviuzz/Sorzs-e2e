# Sorzs-e2e

Playwright end-to-end tests for Sorzs, run against `backend/` and `frontend/` composed by Docker Compose. Part of the Sorzs umbrella; cross-repo rules and decisions live in the umbrella's `CLAUDE.md` and `.claude/decisions.md`.

## Commands

- `npm run e2e`: `docker compose up --build --abort-on-container-exit --exit-code-from e2e`; builds `../backend` and `../frontend` (override with `BACKEND_DIR`, `FRONTEND_DIR`) and runs Playwright in the `e2e` service. Services and image builds use host networking (bridge fails in this sandbox) on ports 3100 and 5273 (`BACKEND_PORT`, `FRONTEND_PORT`); free those ports first
- `npm run up`: builds and starts only backend and frontend, detached and healthy, for trying the web by hand against the backend at `http://localhost:5273`. `npm run down` stops and removes them. Same ports as `e2e`; run `down` before `e2e`
- `npm run lint`: Biome check; `npx biome check --write .` fixes
- `npm run typecheck`: `tsc --noEmit`

A change is done when lint and typecheck pass and `npm run e2e` is green.

## Stack

Node and npm, not Bun: Playwright on Bun is not the supported path. Dependencies are `@playwright/test`, Biome, TypeScript and `@types/node` (for `process.env` in the config). `@playwright/test` is pinned exact and equals the tag of the `mcr.microsoft.com/playwright` image; bump both together. `BASE_URL` sets where the tests point (default `http://localhost:5273`). Add no dependency without asking.

## Happy path only

A new test needs a reason it cannot live in `backend/` or `frontend/`: e2e is slow and brittle, and those repos already cover the red and neutral states. Query by role, never by CSS.

An e2e step for behavior already built has no natural red. Write the test with a deliberate fault (a wrong locator), watch it fail, then correct it. This proves the test can fail without touching product code.

A change to a role or label that specs already query (a link that becomes a button) edits every such spec. Search `tests/` for the old role before the first run.

The backend keeps its list in memory while the stack is up: a spec that adds data builds its address and name from a fresh UUID so reruns do not collide. After `npm run e2e`, run `npm run down`; the exited containers stay otherwise. Backend and frontend exit 139 on the final SIGTERM; read the result of the `e2e` service only.
