#!/usr/bin/env node
// Simple verification script to check signaling server reachability.
// Usage: node video-call-next/scripts/verify-signaling.ts http(s)://host:port/health

const http = require('http');
const https = require('https');
const url = require('url');

const input = process.argv[2];
if (!input) {
  console.error('Usage: verify-signaling.ts <health-url>');
  process.exit(2);
}

const parsed = url.parse(input);
const lib = parsed.protocol === 'https:' ? https : http;

const options = {
  method: 'GET',
  hostname: parsed.hostname,
  port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
  path: parsed.path || '/',
  timeout: 3000,
};

type HttpIncomingMessage = import('http').IncomingMessage;
const req = lib.request(options, (res: HttpIncomingMessage) => {
  const code = res.statusCode ?? 0;
  const message = res.statusMessage ?? '';
  console.log(`SIGNALLING HEALTH: ${code} ${message}`);
  process.exit(code >= 200 && code < 300 ? 0 : 1);
});

req.on('error', (err) => {
  console.error('Error reaching signaling health endpoint:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Health check timed out');
  req.abort();
  process.exit(1);
});

req.end();
