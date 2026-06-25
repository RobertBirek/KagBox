# KAG Box — AGENTS.md

## Developer commands

| Command | Purpose |
|---|---|
| `docker compose config` | Validate compose config |
| `docker compose up -d` | Start all services |
| `docker compose logs -f kagbox-server` | Tail server logs |
| `docker compose down` | Stop containers, keep volumes |
| `npm run dev` | Start dashboard dev server |
| `npm run build` | Build dashboard to `dist/dashboard/` |
| `npm run check` | Syntax-check all scripts |

## Project layout

```
├── compose.yaml              # 8 serwisów
├── .env.example              # Zmienne konfiguracyjne
├── dashboard/                # React SPA (Vite)
│   ├── src/                  # Komponenty
│   │   ├── shared/           # Współdzielone komponenty
│   │   └── styles/           # 15 arkuszy CSS
│   └── vite.config.js
├── scripts/                  # Backend Node.js
│   ├── kagbox_dashboard_server.mjs
│   ├── kagbox_mcp_http_bridge.mjs
│   ├── kagbox_mcp_server.mjs
│   └── lib/                  # Współdzielone moduły
├── docs/                     # Dokumentacja (po polsku)
│   ├── SZYBKI_START.md
│   ├── ARCHITEKTURA.md
│   └── reference/            # OpenSPG knowledge
├── examples/                 # Przykładowa KB
└── infra/                    # systemd + nginx
```

## OpenSPG API quirks

- `POST /v1/schemas` accepts schema but does NOT materialize custom relation lines in `GET /v1/schemas/graph/{projectId}`. Use explicit ref-id properties as FK workaround.
- `GET /public/v1/builder/job/list` must use `start=1` (not `0`).
- `node fetch` may fail with `connect EPERM` while `curl` works.
- SPA uses hash routing: `/#/application`, `/#/application/detail/arrange?appid={id}`.
- `kag_thinker_pipeline` is unstable (missing `rewrite_prompt`). Use `think_pipeline`.

## Data ingestion

Datasource API only supports `ODPS` and `SLS`. Practical path: `export → CSV → structured_builder_chain`.
