# KAG Box

**KAG Box** — gotowy do wdrożenia stack do budowy własnych, lokalnie hostowanych baz wiedzy opartych na OpenSPG Knowledge Graph. Dashboard operacyjny, MCP server (Claude Desktop / dowolny MCP klient), pipeline do importu danych — wszystko w jednym `docker compose up`.

## Spis treści

- [Szybki start](docs/SZYBKI_START.md) — uruchomienie w 5 minut
- [Architektura](docs/ARCHITEKTURA.md) — jak to działa
- [Konfiguracja](docs/KONFIGURACJA.md) — zmienne, porty, bezpieczeństwo
- [API](docs/API.md) — REST API dashboardu
- [MCP](docs/MCP.md) — integracja z Claude Desktop
- [Pipeline](docs/PIPELINE.md) — import danych CSV → OpenSPG

## Czego potrzebujesz

- Docker + Docker Compose v2
- Dostęp do rejestru obrazów Alibaba (publiczny pull)
- 8 GB RAM, 4 vCPU, 20 GB wolnego miejsca

## Jednym poleceniem

```bash
cp .env.example .env
# edytuj .env — ustaw własne hasła i klucze
docker compose up -d
```

Dashboard:
```
http://localhost:3410
```

OpenSPG API:
```
http://localhost:8887
```

---

**KAG Box** — buduj własne bazy wiedzy na własnym sprzęcie.
