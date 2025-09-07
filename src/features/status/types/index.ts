import type { DynamicStatusDataResources, StaticLevelDataResources } from '../../../entities/status';

export type MappedDynStatus = {
  data: DynamicStatusDataResources;
  spTo: number;
  confirmTo: number;
  spFrom: number;
};

export type MappedStaticLevel = {
  data: StaticLevelDataResources;
  xpTo: number;
  xpFrom: number;
};
