# KAG Box — Status projektu

> Ostatnia aktualizacja: 2026-06-25

## Co działa

| Obszar | Status |
|---|---|
| `docker compose config` | ✅ |
| `npm run build` (dashboard) | ✅ PASS |
| `npm run check` (22 skrypty) | ✅ PASS |
| Wszystkie ślady Comarch/Taxbell/Betterfly | ✅ usunięte |
| Ścieżki ROOT (`/docker/openspg` → `/app`) | ✅ naprawione |
| `build_kb_runner.mjs` | ✅ skopiowany |
| Katalogi runtime (`downloads/knowledge_inbox/`) | ✅ utworzone |
| Dashboard React SPA (54 pliki) | ✅ |
| Server (kagbox_dashboard_server.mjs, 4091 linii) | ✅ |
| MCP HTTP bridge + auth proxy | ✅ |
| 19 modułów lib/ | ✅ |

## Wymaga twojej uwagi

### 1. Routing KB

Dwie funkcje zostały wyczyszczone z vendor-logiki i zwracają pusty string:

- `inferKbNamespace()` w `scripts/kagbox_dashboard_server.mjs:1676`
- `resolveDraftKb()` w `scripts/lib/learning.mjs:131`

Musisz dodać własne reguły dopasowujące URL/e/temat do twoich baz wiedzy.

### 2. Raporty w dashboardzie

Serwer ma wpisy w `REPORT_PATHS` dla test packów (20Q, 100Q, community threads), które nie istnieją w KagBox. Funkcja `readJsonIfExists` zwraca `null` — nie sypie błędem, ale w UI pojawią się puste sekcje.

Aby usunąć: usuń wpisy z obiektu `REPORT_PATHS` w `scripts/kagbox_dashboard_server.mjs` (linie ~220-270).

### 3. ESLint

`npm run lint` jest ustawiony na `|| true`, bo oryginalna konfiguracja ESLint nie została skopiowana. Dodaj własną według potrzeb.

### 4. Przykładowa baza

W katalogu `examples/moja-pierwsza-baza/` znajduje się przykładowa baza wiedzy (schema + CSV). Użyj jej do testowania pipeline przed dodaniem własnych danych.

## Szybki start

```bash
cp .env.example .env
# edytuj .env — ustaw hasła i klucze
docker compose up -d
```

Dashboard: http://localhost:3410
OpenSPG API: http://localhost:8887
MCP auth proxy: http://localhost:3401

## Uruchomienie deweloperskie dashboardu

```bash
npm install
npm run dev
# → http://localhost:5173 (hot reload)
```

## Pipeline danych

```
CSV → scripts/build_kb_runner.mjs → OpenSPG builder → Neo4j
```

Zobacz [docs/PIPELINE.md](docs/PIPELINE.md).
