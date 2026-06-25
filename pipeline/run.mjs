import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const OPENSPG_API_BASE = process.env.OPENSPG_API_BASE || 'http://localhost:8887';
const DATA_DIR = process.env.KAGBOX_DATA_DIR || '/data';

// ── helpers ────────────────────────────────────────────
const log = (msg) => console.log(`[pipeline] ${msg}`);
const error = (msg) => console.error(`[pipeline] BLAD: ${msg}`);

const parseArgs = () => {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--kb') opts.kb = args[++i];
    else if (args[i] === '--data') opts.data = args[++i];
    else if (args[i] === '--schema') opts.schema = args[++i];
    else if (args[i] === '--resume') opts.resume = true;
    else if (args[i] === '--job-id') opts.jobId = args[++i];
  }
  return opts;
};

// ── pipeline steps ─────────────────────────────────────
const stepValidateSchema = async (opts) => {
  log(`Walidacja schematu: ${opts.schema}`);
  if (!existsSync(opts.schema)) {
    throw new Error(`Plik schematu nie istnieje: ${opts.schema}`);
  }
  const content = readFileSync(opts.schema, 'utf-8');
  log(`Schemat wczytany (${content.length} B)`);
  return content;
};

const stepPushSchema = async (schemaContent, kb) => {
  log(`Wysylanie schematu do OpenSPG (KB: ${kb})`);
  const resp = await fetch(`${OPENSPG_API_BASE}/v1/schemas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId: kb, schema: schemaContent })
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Blad wysylania schematu: ${resp.status} — ${text}`);
  }
  const result = await resp.json();
  log(`Schemat wyslany: ${JSON.stringify(result)}`);
  return result;
};

const stepValidateData = async (opts) => {
  log(`Walidacja danych: ${opts.data}`);
  if (!existsSync(opts.data)) {
    throw new Error(`Katalog danych nie istnieje: ${opts.data}`);
  }
  const files = readdirSync(opts.data).filter(f => f.endsWith('.csv'));
  log(`Znaleziono ${files.length} plikow CSV: ${files.join(', ')}`);
  return files;
};

// ── main ───────────────────────────────────────────────
const main = async () => {
  const opts = parseArgs();

  if (!opts.kb) {
    error('Wymagany parametr: --kb <nazwa-bazy>');
    process.exit(1);
  }

  if (!opts.resume) {
    if (!opts.data) opts.data = join(DATA_DIR, opts.kb, 'dane');
    if (!opts.schema) opts.schema = join(DATA_DIR, opts.kb, 'schema.kag');
  }

  log(`Pipeline dla bazy: ${opts.kb}`);
  log(`OpenSPG API: ${OPENSPG_API_BASE}`);

  try {
    // Krok 1: Walidacja i wyslanie schematu
    const schemaContent = await stepValidateSchema(opts);
    const schemaResult = await stepPushSchema(schemaContent, opts.kb);

    // Krok 2: Walidacja danych
    const dataFiles = await stepValidateData(opts);

    log('Pipeline zakonczony pomyslnie');
    console.log(JSON.stringify({
      status: 'success',
      kb: opts.kb,
      schemaResult,
      dataFiles
    }));
  } catch (err) {
    error(err.message);
    console.log(JSON.stringify({ status: 'error', error: err.message }));
    process.exit(1);
  }
};

main();
