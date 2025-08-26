type Rewards = {
  type: string;
  value: {
    title: string;
    cashbackPercent: number;
    wager: number;
  };
};
export type StaticLevelDataResources = {
  id: string;
  name: string;
  order: number;
  icon: string;
  xpRequiredToLevelUp: number;
  rewards: Rewards[];
  staticRewards: Record<string, boolean | number>;
  metadata: Record<string, unknown>;
};
export type DynamicStatusDataResources = {
  id: string;
  name: string;
  title: string;
  code: number;
  order: number;
  icon: string;
  spRequiredToConfirm: number;
  spRequiredToLevelUp: number;
  rewards: Rewards[];
  staticRewards: Record<string, boolean | number>;
};
export type DynamicsSeasonInfoResources = {
  gradient: string;
  startsAt: string;
  endsAt: string;
  title: string;
  icon: string;
  description: string;
};
export type StatusDataResources = {
  staticProgressionConfig: {
    levels: StaticLevelDataResources[];
  };
  seasonConfig: {
    seasonInfo: DynamicsSeasonInfoResources;
    statuses: DynamicStatusDataResources[];
  };
};
