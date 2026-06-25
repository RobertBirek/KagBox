# Architektura

## Przegląd

```
  ┌─────────────────────────────────────────────────────────────────┐
  │                        Docker Compose                          │
  │                                                                 │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
  │  │  MySQL   │  │  Neo4j   │  │  MinIO   │  │  Apache Tika   │  │
  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬────────┘  │
  │       │             │             │               │            │
  │       └──────┬──────┴─────────────┴───────┬───────┘            │
  │              │                             │                    │
  │       ┌──────▼────────────────────────────▼──────┐              │
  │       │           OpenSPG Server (:8887)          │              │
  │       └──────┬───────────────────────────┬───────┘              │
  │              │                           │                       │
  │  ┌───────────▼───────────┐   ┌──────────▼───────────┐           │
  │  │  KAG Box Dashboard    │   │     KAG Box MCP       │           │
  │  │  (:3410)              │   │     (:3400)            │           │
  │  │  + Auth Proxy (:3401) │   │     + Auth Proxy      │           │
  │  └───────────────────────┘   └───────────────────────┘           │
  └─────────────────────────────────────────────────────────────────┘
```

## Komponenty

### OpenSPG Server
Rdzeń systemu — zarządza schematami, grafami wiedzy, indeksowaniem i wyszukiwaniem. REST API na porcie 8887.

### MySQL
Przechowuje metadane OpenSPG: projekty, schematy, konfiguracje.

### Neo4j
Grafowa baza danych — przechowuje fakty i relacje wiedzy.

### MinIO
Obiektowy storage dla plików tymczasowych, wyników eksportu, dokumentów źródłowych.

### Apache Tika
Wyodrębnianie tekstu z PDF, DOCX, XLSX i innych formatów biurowych.

### KAG Box Dashboard
Aplikacja webowa (Express + React SPA) do zarządzania bazami wiedzy, przeglądania grafu, monitorowania pipeline'ów i konfiguracji MCP.

### KAG Box MCP Bridge
Most Model Context Protocol — umożliwia Claude Desktop (i innym MCP klientom) query baz wiedzy przez zwykłe rozmowy.

### KAG Box Auth Proxy
Dodatkowa warstwa autoryzacji dla MCP. Sprawdza token przed przekazaniem żądania do MCP bridge.

## Przepływy danych

### Import danych
```
Pliki CSV → Pipeline → OpenSPG Builder → Graf wiedzy (Neo4j)
```

### Query (dashboard)
```
Użytkownik → Dashboard → OpenSPG API → Neo4j → Wynik → Dashboard
```

### Query (MCP / Claude Desktop)
```
Claude Desktop → Auth Proxy → MCP Bridge → OpenSPG API → Wynik → Claude
```
