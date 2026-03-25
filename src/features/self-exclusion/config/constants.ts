import { type ISelfExclusionActivateDTO, SelfExclusionActivatePeriod } from "../../../entities/limits";

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

export const TRANSLATE_MAP = {
    [SelfExclusionActivatePeriod.DAY]: "DAY",
    [SelfExclusionActivatePeriod.MONTH]: "MONTH",
    [SelfExclusionActivatePeriod.YEAR]: "YEAR",
    [SelfExclusionActivatePeriod.FOREVER]: "FOREVER",
};
