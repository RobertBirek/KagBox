# OpenSPG KAG Audit — 30 June 2026

Audyt naprawczy i porządkowy dashboardu ERP KB (OpenSPG) po fazie implementacji
funkcji automatycznego uczenia, auto-draftu, auto-reroute, trendów i alertów.

---

## 1. Zakres

Przegląd kodu, wykrycie i naprawa realnych błędów, uporządkowanie widoczności
raportów, dodanie panelu KAG Readiness na głównym dashboardzie.

---

## 2. Naprawione błędy

### 2.1 Auto-draft dry-run odwrócony

**Plik:** `scripts/run_dashboard_discovery.mjs:636`

Flaga `--dry-run` przy `--auto-draft` działała odwrotnie: `--dry-run` tworzył
realne drafty, a bez `--dry-run` wchodził w tryb suchy.

**Przyczyna:** `dryRun: options.dryRun !== true` zamiast `dryRun: options.dryRun`.

### 2.2 Wykres trendów nie renderował linii

**Plik:** `src/TrendsPage.jsx:102`

Funkcja generowała składnię SVG path (`M... L...`) i przekazywała ją do atrybutu
`points` elementu `<polyline>`, który oczekuje par współrzędnych.

**Naprawa:** Zmiana na `<path d=...>`.

### 2.3 Zakres "All" w trendach pokazywał 1 dzień

**Plik:** `scripts/erp_kb_dashboard_server.mjs:2347`

UI wysyłało `days=0` dla zakresu "All", ale backend obcinał do minimum 1.

**Naprawa:** `Math.max(0, ...)` zamiast `Math.max(1, ...)`, pusta wartość `cutoff`
przy `days===0` oznacza brak filtra.

### 2.4 Trend snapshots bez deduplikacji

Przy wielokrotnym uruchomieniu discovery tego samego dnia, snapshot trendów
dopisywał nowy wiersz z tą samą datą i KB. UI i raport liczyły je jako osobne
"dni", zawyżając średnie.

**Naprawa:** W `handleGetTrends` agregacja `latestPerDay` — ostatni wpis
dla pary `date|kbNamespace` wygrywa.

### 2.5 EmptyState ignorował prop `message`

**Plik:** `src/LearningPage.jsx:166`, `src/shared/EmptyState.jsx`

Komponent `EmptyState` nie obsługiwał prop `message` — był wyświetlany pusty.

**Naprawa:** Zmiana na `description=`.

### 2.6 Raport tygodniowy niewidoczny na liście

**Plik:** `scripts/erp_kb_dashboard_server.mjs:315`

Wygenerowany `ERP_KB_Quality_Weekly_Report.md` był zapisywany, ale nie pojawiał
się w rejestrze `REPORTS`. Operator dostawał komunikat "wygenerowano" bez linku.

**Naprawa:** Dodanie wpisu `quality_weekly` do `REPORTS`.

---

## 3. Nowy panel: KAG Readiness

**Plik:** `src/Overview.jsx`, `src/styles/overview.css`

Kompaktowy panel na głównej stronie dashboardu z sygnałami stanu:

- LLM — czy skonfigurowany
- Tavily / Firecrawl / Exa — klucze API providerów
- Auto-draft gate — czy aktywny
- Learning state — czy zebrane thresholdy
- Alerty — liczba aktywnych alertów

Każdy sygnał to klikalny przycisk przechodzący do odpowiedniej zakładki.

---

## 4. Weryfikacja

| Check | Status |
|---|---|
| `npm run check` | OK |
| `npm run build` | OK |
| `node scripts/test_dashboard_discovery.mjs` | OK (3 testy autoDraftState) |
| `node scripts/test_dashboard_automation.mjs` | OK (16 checks) |
| `node scripts/test_feedback_learning.mjs` | OK (3 testy Phase 3) |

---

## 5. Deploy

```bash
git commit -m "chore: audit fixes"
git push origin main
sudo systemctl restart erp-kb-dashboard.service
```

Dashboard działa na `http://10.10.254.42:3410/panel` z auth mode `none`.

---

## 6. Status końcowy

- Wszystkie znalezione błędy naprawione
- Panel KAG Readiness dodany bez nowej osobnej strony
- Raporty widoczne i linkowalne
- Trendy deduplikowane i poprawnie renderowane
- Auto-draft bezpieczny (dry-run nie mutuje stanu)
