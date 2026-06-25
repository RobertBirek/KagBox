import { createServer } from 'http';

const PORT = parseInt(process.env.MCP_PORT || '3400', 10);
const HOST = process.env.MCP_HOST || '0.0.0.0';
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN || '';
const WRITE_TOKEN = process.env.MCP_WRITE_TOKEN || '';
const OPENSPG_API_BASE = process.env.OPENSPG_API_BASE || 'http://localhost:8887';

// ── helpers ────────────────────────────────────────────
const jsonResponse = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(JSON.stringify(data));
};

const extractToken = (req) => {
  const auth = req.headers['authorization'] || '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : '';
};

// ── MCP tool handlers ─────────────────────────────────
const tools = {
  list_knowledge_bases: async (args) => {
    const resp = await fetch(`${OPENSPG_API_BASE}/v1/projects`);
    const data = await resp.json();
    return { result: data };
  },

  query_knowledge_graph: async (args) => {
    const { query, kb } = args;
    if (!query) return { error: 'Brak parametru query' };
    const resp = await fetch(`${OPENSPG_API_BASE}/v1/graph/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, projectId: kb, limit: args.limit || 10 })
    });
    const data = await resp.json();
    return { result: data };
  },

  search_documents: async (args) => {
    const { query, kb, limit } = args;
    if (!query) return { error: 'Brak parametru query' };
    const resp = await fetch(`${OPENSPG_API_BASE}/v1/graph/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, projectId: kb || '', limit: limit || 10 })
    });
    const data = await resp.json();
    return { result: data };
  }
};

// ── MCP protocol handler ──────────────────────────────
const handleMcpRequest = async (body) => {
  const { method, params, id } = body;

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'list_knowledge_bases',
            description: 'Zwraca liste dostepnych baz wiedzy',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'query_knowledge_graph',
            description: 'Wykonuje zapytanie do bazy wiedzy',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Treść zapytania' },
                kb: { type: 'string', description: 'ID bazy wiedzy (opcjonalnie)' },
                limit: { type: 'number', description: 'Limit wyników' }
              },
              required: ['query']
            }
          },
          {
            name: 'search_documents',
            description: 'Szuka dokumentów w bazie wiedzy',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Fraza wyszukiwania' },
                kb: { type: 'string', description: 'ID bazy wiedzy (opcjonalnie)' },
                limit: { type: 'number', description: 'Limit wyników' }
              },
              required: ['query']
            }
          }
        ]
      }
    };
  }

  if (method === 'tools/call') {
    const tool = tools[params.name];
    if (!tool) {
      return { jsonrpc: '2.0', id, error: { code: -32601, message: `Nieznane narzedzie: ${params.name}` } };
    }
    try {
      const result = await tool(params.arguments || {});
      return { jsonrpc: '2.0', id, result };
    } catch (err) {
      return { jsonrpc: '2.0', id, error: { code: -32000, message: err.message } };
    }
  }

  return { jsonrpc: '2.0', id, error: { code: -32601, message: `Nieznana metoda: ${method}` } };
};

// ── server ─────────────────────────────────────────────
const server = createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    return res.end();
  }

  // Health check
  if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
    return jsonResponse(res, 200, {
      status: 'ok',
      service: 'kagbox-mcp',
      version: '1.0.0'
    });
  }

  // MCP endpoint
  if (req.method === 'POST' && req.url === '/mcp') {
    // Auth check
    const token = extractToken(req);
    if (AUTH_TOKEN && token !== AUTH_TOKEN) {
      return jsonResponse(res, 401, { error: 'Nieprawidlowy token autoryzacji' });
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body);
        const result = await handleMcpRequest(parsed);
        jsonResponse(res, 200, result);
      } catch (err) {
        jsonResponse(res, 400, { error: err.message });
      }
    });
    return;
  }

  jsonResponse(res, 404, { error: 'Nie znaleziono' });
});

server.listen(PORT, HOST, () => {
  console.log(`[kagbox-mcp] MCP bridge nasluchuje na http://${HOST}:${PORT}`);
  console.log(`[kagbox-mcp] OpenSPG API: ${OPENSPG_API_BASE}`);
  console.log(`[kagbox-mcp] Auth: ${AUTH_TOKEN ? 'wlaczony' : 'wylaczony (NIEBEZPIECZNE)'}`);
});
