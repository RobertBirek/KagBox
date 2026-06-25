# MCP (Model Context Protocol)

KAG Box udostępnia most MCP, który pozwala Claude Desktop (i innym MCP klientom) bezpośrednio query bazy wiedzy podczas rozmowy.

## Architektura

```
Claude Desktop ──► Auth Proxy (:3401) ──► MCP Bridge (:3400) ──► OpenSPG API (:8887) ──► Neo4j
```

## Konfiguracja Claude Desktop

Dodaj do `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kagbox": {
      "url": "http://twoj-serwer:3401/mcp",
      "headers": {
        "Authorization": "Bearer TWOJ_MCP_AUTH_TOKEN"
      }
    }
  }
}
```

Zastąp:
- `twoj-serwer` — adres IP lub DNS serwera KAG Box
- `TWOJ_MCP_AUTH_TOKEN` — wartość z `MCP_AUTH_TOKEN` w `.env`

## Autoryzacja

### Auth Proxy

Auth proxy to dodatkowa warstwa bezpieczeństwa. Sprawdza token `Bearer` w nagłówku `Authorization` przed przekazaniem żądania do MCP bridge.

Jeśli token jest nieprawidłowy:

```json
{
  "error": "Nieprawidłowy token autoryzacji"
}
```

### Token odczytu i zapisu

- `MCP_AUTH_TOKEN` — token odczytu (query baz wiedzy)
- `MCP_WRITE_TOKEN` — token zapisu (dodawanie/edycja danych)

Jeśli `MCP_WRITE_TOKEN` nie jest ustawiony, wszystkie operacje są tylko do odczytu.

## Narzędzia MCP

### `query_knowledge_graph`

Wykonuje zapytanie do bazy wiedzy.

```json
{
  "query": "Jaka jest struktura tabeli Klienci?",
  "kb": "domyślna"
}
```

### `search_documents`

Szuka dokumentów w bazie wiedzy.

```json
{
  "query": "faktura VAT",
  "kb": "domyślna",
  "limit": 10
}
```

### `list_knowledge_bases`

Zwraca listę dostępnych baz wiedzy.

## Bezpieczeństwo

- Nie używaj tych samych tokenów w wielu lokalizacjach
- W produkcji: auth proxy powinien być dostępny tylko z zaufanych sieci (VPN, firewall)
- Rotuj tokeny okresowo
