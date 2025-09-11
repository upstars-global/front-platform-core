import { Currency } from '../../../shared/api';

export enum RewardType {
  Cashback = 'cashback',
  DepositBonus = 'deposit_bonus',
  Freespin = 'free_spins',
  Cash = 'cash',
}

export type RewardsTypeCashbackValue = {
  title: string;
  bonus: number;
  wager: number;
  winLimit: number;
};
export type RewardsTypeDepositBonusValue = {
  title: string;
  expired: number;
  description: string;
};
export type RewardsTypeFreeSpinsValue = {
  title: string;
  bonus: number;
  bet: number;
  wager: number;
  winLimit: number;
  currency: Currency
};
export type RewardsTypeCashValue = {
  title: string;
  bonus: number;
  winLimit: number;
  wager: number;
  currency: Currency
};
export type Rewards = {
  type: RewardType;
  value: RewardsTypeCashbackValue | RewardsTypeDepositBonusValue | RewardsTypeFreeSpinsValue | RewardsTypeCashValue;
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
