import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = parseInt(process.env.KAGBOX_PORT || '3410', 10);
const HOST = process.env.KAGBOX_HOST || '0.0.0.0';
const SECRET_KEY = process.env.KAGBOX_SECRET_KEY || 'dev-secret-key-32-chars-min!!!';
const DATA_DIR = process.env.KAGBOX_DATA_DIR || join(__dirname, '..', '..', 'data');
const OPENSPG_API_BASE = process.env.OPENSPG_API_BASE || 'http://localhost:8887';

// ── helpers ────────────────────────────────────────────
const html = (title, content) => `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — KAG Box</title>
<link rel="stylesheet" href="/styles.css">
</head>
<body><div id="root">${content}</div>
<script src="/app.js" type="module"></script></body></html>`;

const htmlResponse = (res, status, body, type = 'text/html; charset=utf-8') => {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
};

const jsonResponse = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// ── routes ─────────────────────────────────────────────
const routes = {
  // SPA
  GET: {
    '/': async (req, res) => htmlResponse(res, 200, html('Dashboard', '')),
    '/api/status': async (req, res) => jsonResponse(res, 200, {
      status: 'ok',
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        openspg: OPENSPG_API_BASE
      }
    }),
    '/api/knowledge-bases': async (req, res) => {
      try {
        const resp = await fetch(`${OPENSPG_API_BASE}/v1/projects`);
        const data = await resp.json();
        jsonResponse(res, 200, data);
      } catch (err) {
        jsonResponse(res, 502, { error: 'Nie mozna polaczyc z OpenSPG', detail: err.message });
      }
    }
  },
  POST: {
    '/api/knowledge-bases': async (req, res) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const resp = await fetch(`${OPENSPG_API_BASE}/v1/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await resp.json();
          jsonResponse(res, resp.status, result);
        } catch (err) {
          jsonResponse(res, 400, { error: err.message });
        }
      });
    }
  }
};

// ── server ─────────────────────────────────────────────
const server = createServer((req, res) => {
  const { method, url } = req;
  const routeMap = routes[method];
  if (routeMap && routeMap[url]) {
    return routeMap[url](req, res);
  }
  htmlResponse(res, 404, html('404', '<h1>404 — Strona nie znaleziona</h1><a href="/">Wróc</a>'));
});

server.listen(PORT, HOST, () => {
  console.log(`[kagbox-server] KAG Box dashboard nasluchuje na http://${HOST}:${PORT}`);
  console.log(`[kagbox-server] OpenSPG API: ${OPENSPG_API_BASE}`);
  console.log(`[kagbox-server] Katalog danych: ${DATA_DIR}`);
});
