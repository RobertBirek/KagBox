# Szybki start

Uruchomienie KAG Box od zera w 5 minut.

## 1. Wymagania

- Docker Engine 24+ z Compose v2
- `curl`, `git`, edytor tekstu
- 8 GB RAM, 4 vCPU, 20 GB wolnego miejsca na dysku

## 2. Pobierz

```bash
git clone <twoje-repo>/KagBox.git
cd KagBox
```

## 3. Skonfiguruj

```bash
cp .env.example .env
```

Otwórz `.env` i **ustaw własne wartości** dla:

| Zmienna | Opis |
|---|---|
| `MYSQL_ROOT_PASSWORD` | Hasło root MySQL (OpenSPG) |
| `NEO4J_PASSWORD` | Hasło Neo4j |
| `MINIO_SECRET_KEY` | Klucz sekretny MinIO |
| `KAGBOX_SECRET_KEY` | Klucz sesji dashboardu (min. 32 znaki) |
| `MCP_AUTH_TOKEN` | Token autoryzacji MCP bridge |
| `MCP_WRITE_TOKEN` | Token zapisu MCP (opcjonalnie) |

## 4. Uruchom

```bash
docker compose up -d
```

Pierwsze uruchomienie pobiera obrazy (~3 GB) — może potrwać kilka minut.

## 5. Sprawdź

```bash
docker compose ps
docker compose logs -f
```

Dashboard: [http://localhost:3410](http://localhost:3410)
OpenSPG API: [http://localhost:8887](http://localhost:8887)

## 6. Pierwsza baza wiedzy

Po uruchomieniu:

1. Otwórz dashboard → **Bazy wiedzy** → **Dodaj**
2. Wpisz nazwę, namespace, opcjonalny opis
3. Kliknij **Utwórz**
4. Przejdź do zakładki **Pipeline** i wgraj przykładowe dane z `examples/moja-pierwsza-baza/`

Gotowe. Możesz teraz query bazę przez MCP (zobacz [MCP.md](MCP.md)) lub przez dashboard.
