import { Currency } from '../../../shared/api';

export enum RewardType {
  Cashback = 'cashback',
  DepositBonus = 'depositBonus',
  Freespin = 'freeSpins',
}

export type RewardsTypeCashbackValue = {
  title: string;
  cashbackPercent: number;
  wager: number;
  limit: number;
};
export type RewardsTypeDepositBonusValue = {
  title: string;
  bonus: number;
  isBonusAsPercent: boolean;
  maxBonus: number;
  minDeposit: number;
  winLimit: number;
  isWinLimitAsPercent: boolean;
  wager: number;
  currency: Currency
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
  promoText: string;
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
