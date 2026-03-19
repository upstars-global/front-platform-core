export enum LimitType {
  DEPOSIT = 'deposit',
  LOSS = 'loss',
  SELF_EXCLUSION = 'self-exclusion',
  COOLING_OFF = 'cooling-off',
}

export enum LimitSubtype {
  DAILY = 'daily',
  THREE_DAYS = '3days',
  WEEKLY = 'weekly',
  TWO_WEEKS = '2weeks',
  MONTHLY = 'monthly',
}

export enum LimitStatus {
  DISABLED = 'disabled',
  PROLONGATION_DISABLE = 'prolongation_disabled',
  PROLONGATION_UPDATED = 'prolongation_updated',
  WAITING_ACTIVATION = 'waiting_activation',
  ACTIVE = 'active',
  WAITING_DISABLE = 'waiting_disable',
  WAITING_CHANGES = 'waiting_changes',
}

export type ILimitResource<T extends LimitType = LimitType> = {
  id: string;
  userId: string;
  type: T;
  subType: LimitSubtype;
  limit: number;
  nextLimit: number | null;
  used: number;
  setupDate: string;
  reloadDate: string;
  changeDate: string | null;
  tillDate: string;
  status: LimitStatus;
  disabled: boolean;
}

// DTOs
export type IManageLimitDTO<T extends LimitType = LimitType> = {
  subType: LimitSubtype;
  type: T;
  limit: number;
}

export type IDisableLimitDTO<T extends LimitType = LimitType> = {
  subType: LimitSubtype;
  type: T;
}

export enum SelfExclusionActivatePeriod {
  DAY = 'd',
  MONTH = 'm',
  YEAR = 'y',
  FOREVER = 'forever',
}
export enum CollingOffActivatePeriod {
  DAY = 'd',
  MONTH = 'm',
  WEEK = 'w',
}

export type ISelfExclusionActivateDTO = {
  token: string;
  reason: string;
  period: {
    type: SelfExclusionActivatePeriod;
    value?: number;
  };
}
export type CoolingOffActivateDTO = {
  isLicensedDomain: boolean;
  period: {
    type: CollingOffActivatePeriod;
    value: number;
  };
};
