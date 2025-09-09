export enum RewardType {
  Cashback = 'cashback',
  Gift = 'gift',
  Freespin = 'freespin',
  Cash = 'cash',
}

export type RewardsTypeCashbackValue = {
  title: string;
  cashbackPercent: number;
  wager: number;
};
export type RewardsTypeGiftValue = {
  title: string;
  expired: number;
  description: string;
};

export type Rewards = {
  type: RewardType;
  value: RewardsTypeCashbackValue | RewardsTypeGiftValue;
};
export type StaticLevelDataResources = {
  id: string;
  name: string;
  title: string;
  order: number;
  icon: string;
  xpRequiredToLevelUp: number;
  rewards: Rewards[];
  staticRewards: Record<string, boolean>;
};
export type DynamicStatusDataResources = {
  id: string;
  name: string;
  title: string;
  code: number;
  order: number;
  icon: string;
  promo_text: string;
  spRequiredToConfirm: number;
  spRequiredToLevelUp: number;
  rewards: Rewards[];
  staticRewards: Record<string, boolean>;
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
