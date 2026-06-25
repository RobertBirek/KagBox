# Pipeline

Pipeline importuje dane CSV do OpenSPG i buduje graf wiedzy.

## Przepływ

```
Pliki CSV (katalog data/) → Walidacja → OpenSPG Builder → Graf w Neo4j
```

## Format danych

Każda baza wiedzy ma osobny katalog (`examples/moja-pierwsza-baza/dane/`). W katalogu znajdują się:

### Plik schematu: `schema.kag`

Definiuje encje i relacje w języku KAG:

```kag
CREATE EntityType Dokument (
    id          STRING    PRIMARY KEY,
    nazwa       STRING,
    opis        TEXT,
    data_utworzenia DATE
)

CREATE RelationType dokument_odnosi_sie_do (
    from: Dokument,
    to: Dokument
)
```

### Pliki CSV

Każda encja ma osobny plik CSV:

**dokumenty.csv:**
```csv
id,nazwa,opis,data_utworzenia
DOC-001,Instrukcja obslugi,Instrukcja obslugi systemu ERP,2024-01-15
DOC-002,Polityka bezpieczenstwa,Wewnetrzna polityka bezpieczenstwa,2024-03-01
```

## Uruchomienie pipeline

### Przez dashboard

1. Wejdź w **Pipeline** → **Nowe zadanie**
2. Wybierz bazę wiedzy
3. Wskaż katalog z danymi
4. Kliknij **Uruchom**

### Przez CLI

```bash
docker compose exec kagbox-server node pipeline/run.mjs \
  --kb "moja-pierwsza-baza" \
  --data "/data/moja-pierwsza-baza/dane" \
  --schema "/data/moja-pierwsza-baza/schema.kag"
```

### Przez API

```bash
curl -X POST http://localhost:3410/api/pipeline/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "kb": "moja-pierwsza-baza",
    "dataDir": "/data/moja-pierwsza-baza/dane",
    "schemaFile": "/data/moja-pierwsza-baza/schema.kag"
  }'
```

## Monitorowanie

Status i logi pipeline dostępne są przez:

- Dashboard → **Pipeline** → lista zadań
- CLI: `docker compose logs -f kagbox-server`
- API: `GET /api/pipeline/jobs/:id/logs`

## Resume

Jeśli pipeline został przerwany (restart kontenera, crash), możesz wznowić zadanie:

```bash
docker compose exec kagbox-server node pipeline/run.mjs --resume --job-id <ID>
```

Pipeline automatycznie wykrywa ostatni wykonany krok i kontynuuje od tego miejsca.
