import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Poll MCX API / GoldAPI.io every 30 seconds
// Cache in Redis with 60s TTL
// Broadcast to all connected clients on each update
const POLL_INTERVAL_MS = 30_000;

interface RatePayload {
  gold22k: {
    metal: string;
    label: string;
    pricePerUnit: number;
    unit: string;
    changePercent: number;
    changeAmount: number;
    lastUpdated: string;
  };
  gold18k: {
    metal: string;
    label: string;
    pricePerUnit: number;
    unit: string;
    changePercent: number;
    changeAmount: number;
    lastUpdated: string;
  };
  silver: {
    metal: string;
    label: string;
    pricePerUnit: number;
    unit: string;
    changePercent: number;
    changeAmount: number;
    lastUpdated: string;
  };
  lastFetched: string;
  isLive: boolean;
}

let lastRates: RatePayload | null = null;

/** Fetch live rates from MCX/GoldAPI. Falls back to mock in dev. */
async function fetchRates(): Promise<RatePayload> {
  const apiKey = process.env.GOLD_API_KEY;
  if (!apiKey) {
    // Return mock data in dev
    const baseGold = 62450 + Math.floor(Math.random() * 500 - 250);
    const baseSilver = 78500 + Math.floor(Math.random() * 300 - 150);
    const goldChange = parseFloat((Math.random() * 2 - 1).toFixed(1));
    const silverChange = parseFloat((Math.random() * 1.5 - 0.75).toFixed(1));
    const now = new Date().toISOString();
    return {
      gold22k: {
        metal: 'gold_22k',
        label: 'Gold 22K / 10g',
        pricePerUnit: baseGold,
        unit: '10g',
        changePercent: goldChange,
        changeAmount: Math.floor((baseGold * goldChange) / 100),
        lastUpdated: now,
      },
      gold18k: {
        metal: 'gold_18k',
        label: 'Gold 18K / 10g',
        pricePerUnit: Math.floor(baseGold * 0.818),
        unit: '10g',
        changePercent: goldChange,
        changeAmount: Math.floor((baseGold * 0.818 * goldChange) / 100),
        lastUpdated: now,
      },
      silver: {
        metal: 'silver',
        label: 'Silver / kg',
        pricePerUnit: baseSilver,
        unit: 'kg',
        changePercent: silverChange,
        changeAmount: Math.floor((baseSilver * silverChange) / 100),
        lastUpdated: now,
      },
      lastFetched: now,
      isLive: false,
    };
  }

  // TODO: Replace with real MCX/GoldAPI call
  // const response = await axios.get(`https://www.goldapi.io/api/XAU/INR`, {
  //   headers: { 'x-access-token': apiKey },
  // });
  throw new Error('Production API not configured');
}

export function ratesWS(server: HttpServer): void {
  const wss = new WebSocketServer({ server, path: '/rates' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);

    // Send last known rates immediately on connect
    if (lastRates) {
      ws.send(JSON.stringify(lastRates));
    }

    ws.on('close', () => {
      clients.delete(ws);
    });

    ws.on('error', (err) => {
      console.error('WS client error:', err.message);
      clients.delete(ws);
    });
  });

  // Poll rates on interval and broadcast
  async function poll() {
    try {
      const rates = await fetchRates();
      lastRates = rates;
      const payload = JSON.stringify(rates);
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    } catch (err) {
      console.error('Rate fetch error:', err);
    }
  }

  // Initial fetch
  poll();
  setInterval(poll, POLL_INTERVAL_MS);

  console.log('✅ Rates WebSocket server started at /rates');
}
