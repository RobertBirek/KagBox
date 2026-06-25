# API

KAG Box Server udostępnia REST API dla dashboardu i narzędzi zewnętrznych.

## Baza URL

```
http://localhost:3410
```

Gdy za reverse proxy z `KAGBOX_BASE_PATH=/kagbox/`:
```
https://domena/kagbox/
```

## Endpointy

### Status

| Metoda | Ścieżka | Opis |
|---|---|---|
| `GET` | `/api/status` | Ogólny status serwisu |
| `GET` | `/api/status/openspg` | Status połączenia z OpenSPG API |

### Bazy wiedzy (KB)

| Metoda | Ścieżka | Opis |
|---|---|---|
| `GET` | `/api/knowledge-bases` | Lista wszystkich KB |
| `POST` | `/api/knowledge-bases` | Utwórz nową KB |
| `GET` | `/api/knowledge-bases/:id` | Szczegóły KB |
| `PUT` | `/api/knowledge-bases/:id` | Edytuj KB |
| `DELETE` | `/api/knowledge-bases/:id` | Usuń KB |
| `GET` | `/api/knowledge-bases/:id/graph` | Graf wiedzy KB |
| `GET` | `/api/knowledge-bases/:id/schema` | Schemat KB |
| `POST` | `/api/knowledge-bases/:id/schema` | Prześlij schemat |

### Pipeline

| Metoda | Ścieżka | Opis |
|---|---|---|
| `GET` | `/api/pipeline/jobs` | Lista zadań pipeline |
| `POST` | `/api/pipeline/jobs` | Uruchom nowy job |
| `GET` | `/api/pipeline/jobs/:id` | Status joba |
| `GET` | `/api/pipeline/jobs/:id/logs` | Logi joba |

### MCP

| Metoda | Ścieżka | Opis |
|---|---|---|
| `GET` | `/api/mcp/servers` | Lista serwerów MCP |
| `GET` | `/api/mcp/servers/health` | Health wszystkich serwerów |
| `POST` | `/api/mcp/servers` | Dodaj serwer MCP |
| `PUT` | `/api/mcp/servers/:name` | Edytuj serwer MCP |
| `DELETE` | `/api/mcp/servers/:name` | Usuń serwer MCP |

### Uczenie (Learning)

| Metoda | Ścieżka | Opis |
|---|---|---|
| `GET` | `/api/learning/status` | Status procesu uczenia |
| `POST` | `/api/learning/start` | Rozpocznij uczenie |
| `POST` | `/api/learning/stop` | Zatrzymaj uczenie |

## Autoryzacja

Większość endpointów wymaga sesji (ciasteczko `connect.sid`). Sesja tworzona jest automatycznie po zalogowaniu przez dashboard.

Dla dostępu programowego (MCP, skrypty):

```bash
curl -H "Authorization: Bearer ${MCP_AUTH_TOKEN}" http://localhost:3400/api/...
```

## Przykłady

```bash
# Lista baz wiedzy
curl http://localhost:3410/api/knowledge-bases

# Status
curl http://localhost:3410/api/status

# Health MCP
curl http://localhost:3410/api/mcp/servers/health
```
