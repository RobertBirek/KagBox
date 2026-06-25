# OpenSPG KB Operational Memory

## API Quirks

### Schema API
- `POST /v1/schemas` accepts the schema script but does NOT materialize custom relation lines in `GET /v1/schemas/graph/{projectId}`. Use explicit ref-id properties (`documentDefinitionRefId`, `contractorRefId`, etc.) as the FK workaround.
- Unheard-of entity types are silently ignored — validate new types server-side.
- Embedding model is fixed at KB creation time.

### Builder Job API
- `GET /public/v1/builder/job/list` must use `start=1` (not `0`); `start=0` triggers a backend SQL negative-offset bug.
- `TextAndVector` index on large text fields stalls — use plain text for full content, vectorize only the preview.

### Datasource / Ingestion
- Only `ODPS` and `SLS` datasource families are supported. Practical path: export → CSV → `structured_builder_chain`.

### App / Reasoner API
- `kag_thinker_pipeline` is unstable (missing `rewrite_prompt`). Use `think_pipeline`.
- `/v3/api-docs` returns a JSON array of byte values — decode with `Buffer.from(raw).toString('utf8')`.
- `GET /v1/app/{appid}` returns `accessToken` — do not store or echo it.
- SPA uses hash routing: `/#/application`, `/#/application/detail/arrange?appid={id}`.

### Other
- `node fetch` may fail with `connect EPERM ...:8887` while `curl` works. Use `curl` as fallback.
- Chunk rows with giant content (>8192 OpenAI tokens) are rejected at build time.
