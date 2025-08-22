export type StaticLevelDataResources = {
  id: string;
  name: string;
  order: number;
  xpRequiredToLevelUp: number;
  rewards: [
    {
      type: string;
      value: {
        title: string;
        cashbackPercent: number;
        wager: number;
      };
    },
  ];
  staticRewards: Record<string, unknown>;
  metadata: Record<string, unknown>;
};
export type DynamicStatusDataResources = {
  id: string;
  name: string;
  code: number;
  order: number;
  spRequiredToConfirm: number;
  spRequiredToLevelUp: number;
  rewards: [
    {
      type: string;
      value: {
        title: string;
        cashbackPercent: number;
        wager: number;
      };
    },
  ];
  staticRewards: Record<string, unknown>;
  metadata: Record<string, unknown>;
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
