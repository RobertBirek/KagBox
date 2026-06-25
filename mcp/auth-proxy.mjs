import { createServer } from 'http';

const PORT = parseInt(process.env.AUTH_PROXY_PORT || '3401', 10);
const HOST = process.env.AUTH_PROXY_HOST || '0.0.0.0';
const PROXY_TARGET = process.env.PROXY_TARGET || 'http://localhost:3400';
const PROXY_READ_TOKEN = process.env.PROXY_READ_TOKEN || '';

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

const proxyRequest = (req, callback) => {
  const options = new URL(PROXY_TARGET);
  const proxyReq = http.request(
    {
      hostname: options.hostname,
      port: options.port,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: options.host }
    },
    callback
  );
  req.pipe(proxyReq);
};

import http from 'http';

const server = createServer((req, res) => {
  // CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    return res.end();
  }

  // Health dla dashboardu
  if (req.method === 'GET' && req.url === '/health') {
    return jsonResponse(res, 200, {
      status: 'reachable',
      httpStatus: 200,
      proxyTarget: PROXY_TARGET
    });
  }

  // Weryfikacja tokena
  const token = extractToken(req);
  if (PROXY_READ_TOKEN && token !== PROXY_READ_TOKEN) {
    return jsonResponse(res, 401, { error: 'Nieprawidlowy token autoryzacji' });
  }

  // Proxy do MCP bridge
  proxyRequest(req, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[kagbox-auth-proxy] Auth proxy nasluchuje na http://${HOST}:${PORT}`);
  console.log(`[kagbox-auth-proxy] Proxy target: ${PROXY_TARGET}`);
  console.log(`[kagbox-auth-proxy] Auth: ${PROXY_READ_TOKEN ? 'wlaczony' : 'wylaczony (NIEBEZPIECZNE)'}`);
});
