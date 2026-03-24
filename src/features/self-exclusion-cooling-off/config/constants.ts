import {
  type ISelfExclusionActivateDTO,
  type CoolingOffActivateDTO,
  CollingOffActivatePeriod,
  SelfExclusionActivatePeriod,
  LimitSubtype,
} from "../../../entities/limits";

export const SELF_EXCLUSION_BALANCE_THRESHOLD_BY_CURRENCY: Record<string, number> = {
    USD: 5000,
    EUR: 5000,
    AUD: 5000,
    CAD: 5000,
    NZD: 5000,
    INR: 500000,
    BRL: 20000,
};

export const SELF_EXCLUSION_DEFAULT_BALANCE_THRESHOLD = 5000;

export const COOLING_OFF_TOKEN_QUERY_PARAM = "cooling-off-token";
export const SELF_EXCLUSION_TOKEN_QUERY_PARAM = "self-exclusion-token";

export const SELF_EXCLUSION_DURATIONS: ISelfExclusionActivateDTO["period"][] = [
    { type: SelfExclusionActivatePeriod.DAY, value: 1 },
    { type: SelfExclusionActivatePeriod.DAY, value: 2 },
    { type: SelfExclusionActivatePeriod.DAY, value: 3 },
    { type: SelfExclusionActivatePeriod.DAY, value: 4 },
    { type: SelfExclusionActivatePeriod.DAY, value: 5 },
    { type: SelfExclusionActivatePeriod.DAY, value: 6 },
    { type: SelfExclusionActivatePeriod.DAY, value: 7 },
    { type: SelfExclusionActivatePeriod.DAY, value: 14 },
    { type: SelfExclusionActivatePeriod.MONTH, value: 1 },
    { type: SelfExclusionActivatePeriod.MONTH, value: 2 },
    { type: SelfExclusionActivatePeriod.MONTH, value: 3 },
    { type: SelfExclusionActivatePeriod.MONTH, value: 6 },
    { type: SelfExclusionActivatePeriod.YEAR, value: 1 },
];

export const COOLING_OFF_DURATIONS: CoolingOffActivateDTO['period'][] = [
  { type: CollingOffActivatePeriod.DAY, value: 1 },
  { type: CollingOffActivatePeriod.DAY, value: 3 },
  { type: CollingOffActivatePeriod.DAY, value: 7 },
  { type: CollingOffActivatePeriod.DAY, value: 14 },
  { type: CollingOffActivatePeriod.DAY, value: 30 },
];

export const SELF_EXCLUSION_REASONS = [
    "PERSONAL_REASONS",
    "NO_WINNINGS",
    "MISTAKE_ACCOUNT",
    "VERIFICATION_PROBLEMS",
    "DEPOSIT_ISSUES",
    "WITHDRAWAL_ISSUES",
    "BONUS_ISSUES",
    "LAGS_ON_SITE",
    "GAMBLING_BREAK",
    "TERMS_AND_CONDITIONS_DISAGREE",
    "NON_COMPLIANCE_WITH_LEGAL_REGULATORY_REQUIREMENTS",
    "FEAR_GAMBLING_ADDICTION",
    "UNSATISFACTORY_SUPPORT_SERVICE",
    "INCONVENIENT_USER_INTERFACE",
    "GAMBLING_ADDICTION",
    "SWITCHING_TO_ANOTHER_CASINO",
];

export const REASON_PERIOD_OVERRIDE: Record<string, ISelfExclusionActivateDTO["period"]> = {
    GAMBLING_ADDICTION: { type: SelfExclusionActivatePeriod.FOREVER },
};

export const SELF_EXCLUSION_TRANSLATE_MAP = {
    [SelfExclusionActivatePeriod.DAY]: "DAY",
    [SelfExclusionActivatePeriod.MONTH]: "MONTH",
    [SelfExclusionActivatePeriod.YEAR]: "YEAR",
    [SelfExclusionActivatePeriod.FOREVER]: "FOREVER",
};

export const LIMIT_SUBTYPE_TO_DURATION_KEY: Partial<Record<LimitSubtype, string>> = {
    [LimitSubtype.DAILY]: "1_d",
    [LimitSubtype.DAYS_3]: "3_d",
    [LimitSubtype.DAYS_7]: "7_d",
    [LimitSubtype.DAYS_14]: "14_d",
    [LimitSubtype.DAYS_30]: "30_d",
};

export const COOLING_OFF_TRANSLATE_MAP = {
  [CollingOffActivatePeriod.DAY]: 'DAY',
  [CollingOffActivatePeriod.MONTH]: 'MONTH',
  [CollingOffActivatePeriod.WEEK]: 'WEEK',
};
