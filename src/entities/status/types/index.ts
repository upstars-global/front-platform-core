import type { DynamicStatusDataResources, StaticLevelDataResources } from '../api';

export type MappedDynStatus = {
  data: DynamicStatusDataResources;
  spTo: number;
  confirmTo: number;
  spFrom: number;
  weeklyCashback?: {
    title: string;
    cashbackPercent: number;
    wager: number;
    limit?: number;
    isIcon: boolean;
  }
};

export type MappedStaticLevel = {
  data: StaticLevelDataResources;
  xpTo: number;
  xpFrom: number;
  weeklyCashback?: {
    title: string;
    cashbackPercent: number;
    wager: number;
    limit?: number;
    isIcon: boolean;
  }
};
