import { useEffect, useRef } from 'react';
import { useRatesStore } from '../store/ratesStore';
import type { LiveRates } from '../types/rates';

// Mock WebSocket server URL — replace with real WS URL in production
const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? 'ws://localhost:3001/rates';

// Mock rate generator for development
function generateMockRates(): LiveRates {
  const baseGold = 62450 + Math.floor(Math.random() * 500 - 250);
  const baseSilver = 78500 + Math.floor(Math.random() * 300 - 150);
  const goldChange = parseFloat((Math.random() * 2 - 1).toFixed(1));
  const silverChange = parseFloat((Math.random() * 1.5 - 0.75).toFixed(1));

  return {
    gold22k: {
      metal: 'gold_22k',
      label: 'Gold 22K / 10g',
      pricePerUnit: baseGold,
      unit: '10g',
      changePercent: goldChange,
      changeAmount: Math.floor((baseGold * goldChange) / 100),
      lastUpdated: new Date().toISOString(),
    },
    gold18k: {
      metal: 'gold_18k',
      label: 'Gold 18K / 10g',
      pricePerUnit: Math.floor(baseGold * 0.818),
      unit: '10g',
      changePercent: goldChange,
      changeAmount: Math.floor(((baseGold * 0.818) * goldChange) / 100),
      lastUpdated: new Date().toISOString(),
    },
    silver: {
      metal: 'silver',
      label: 'Silver / kg',
      pricePerUnit: baseSilver,
      unit: 'kg',
      changePercent: silverChange,
      changeAmount: Math.floor((baseSilver * silverChange) / 100),
      lastUpdated: new Date().toISOString(),
    },
    lastFetched: new Date().toISOString(),
    isLive: true,
  };
}

export function useGoldRates() {
  const { setRates, setConnected, setError } = useRatesStore();
  const wsRef = useRef<WebSocket | null>(null);
  const retryDelay = useRef(1000);
  const mockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // In dev mode, use mock WebSocket with fake updates every 5 seconds
    if (__DEV__) {
      setRates(generateMockRates());
      setConnected(true);

      mockIntervalRef.current = setInterval(() => {
        setRates(generateMockRates());
      }, 5000);

      return () => {
        if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
      };
    }

    // Production: real WebSocket with exponential backoff
    function connect() {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          retryDelay.current = 1000; // reset backoff
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as LiveRates;
            setRates(data);
          } catch {
            // ignore malformed messages
          }
        };

        ws.onerror = () => {
          setError('Connection error');
          setConnected(false);
        };

        ws.onclose = () => {
          setConnected(false);
          // Exponential backoff — max 30s
          const delay = Math.min(retryDelay.current, 30000);
          retryDelay.current *= 2;
          setTimeout(connect, delay);
        };
      } catch {
        setError('Failed to connect');
        setTimeout(connect, retryDelay.current);
      }
    }

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [setRates, setConnected, setError]);
}
