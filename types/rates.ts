export interface MetalRate {
  metal: 'gold_22k' | 'gold_18k' | 'gold_14k' | 'silver';
  label: string;
  pricePerUnit: number;   // per 10g for gold, per kg for silver
  unit: string;
  changePercent: number;  // positive = up, negative = down
  changeAmount: number;
  lastUpdated: string;
}

export interface LiveRates {
  gold22k: MetalRate;
  gold18k: MetalRate;
  silver: MetalRate;
  lastFetched: string;
  isLive: boolean;
}
