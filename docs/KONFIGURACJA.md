# Konfiguracja

## Zmienne środowiskowe (`.env`)

### OpenSPG

| Zmienna | Domyślnie | Opis |
|---|---|---|
| `OPENSPG_IMAGE_TAG` | `latest` | Tag obrazów OpenSPG z rejestru Alibaba |
| `MYSQL_ROOT_PASSWORD` | — | Hasło root MySQL |
| `NEO4J_PASSWORD` | — | Hasło użytkownika `neo4j` |
| `MINIO_SECRET_KEY` | — | Klucz sekretny MinIO |
| `MINIO_ACCESS_KEY` | `minioadmin` | Klucz dostępowy MinIO |
| `TIKA_VERSION` | `latest` | Wersja Apache Tika |

### Dashboard (KAG Box Server)

| Zmienna | Domyślnie | Opis |
|---|---|---|
| `KAGBOX_PORT` | `3410` | Port dashboardu |
| `KAGBOX_HOST` | `0.0.0.0` | Bind address |
| `KAGBOX_BASE_PATH` | `/` | Ścieżka bazowa (przydatne za reverse proxy) |
| `KAGBOX_SECRET_KEY` | — | Klucz sesji (express-session) — min. 32 znaki |
| `OPENSPG_AUTH_COOKIE` | (puste) | Ciasteczko uwierzytelniające do OpenSPG API, jeśli wymagane |

### MCP

| Zmienna | Domyślnie | Opis |
|---|---|---|
| `MCP_PORT` | `3400` | Port MCP bridge |
| `MCP_HOST` | `0.0.0.0` | Bind address MCP |
| `MCP_AUTH_TOKEN` | — | Token autoryzacji (wymagany przez auth proxy) |
| `MCP_WRITE_TOKEN` | (puste) | Opcjonalny token dla operacji zapisu |

### Auth Proxy

| Zmienna | Domyślnie | Opis |
|---|---|---|
| `AUTH_PROXY_PORT` | `3401` | Port auth proxy |
| `AUTH_PROXY_HOST` | `0.0.0.0` | Bind address |
| `PROXY_READ_TOKEN` | — | Token do walidacji (taki sam jak `MCP_AUTH_TOKEN`) |

### Nginx (opcjonalnie)

| Zmienna | Opis |
|---|---|
| `NGINX_PORT` | Port HTTPS |
| `SSL_CERT_PATH` | Ścieżka do certyfikatu SSL |
| `SSL_KEY_PATH` | Ścieżka do klucza SSL |

## Porty

| Port | Serwis | Uwagi |
|---|---|---|
| 8887 | OpenSPG API | Wymagany do pipeline |
| 3410 | Dashboard | Główny interfejs użytkownika |
| 3400 | MCP bridge | Dla Claude Desktop |
| 3401 | Auth proxy | Warstwa autoryzacji MCP |

## Sieć

Wszystkie serwisy komunikują się przez mostkową sieć Docker `kagbox`. Tylko porty wymienione wyżej są wystawione na zewnątrz.

## Bezpieczeństwo

- Nigdy nie commit `.env` do repo
- Używaj silnych haseł (min. 16 znaków, mix znaków specjalnych)
- `KAGBOX_SECRET_KEY` powinien być losowym ciągiem (np. `openssl rand -hex 32`)
- W produkcji: umieść za reverse proxy (nginx) z HTTPS
- Ogranicz dostęp do portów 8887, 3400, 3401 do zaufanych sieci
