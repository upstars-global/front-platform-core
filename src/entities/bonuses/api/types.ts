import { Currency, type Localisation } from "../../../shared/api";

export enum GetUserGiftsAvailability {
    AVAILABLE = "available",
    ACTIVE = "active",
    HISTORY = "history",
}

export enum GetUserGiftsSubtype {
    SPORT = "sport",
    CASINO = "casino",
}

export enum GiftResourceStatus {
    RECEIVED = "received",
    ACTIVATED = "activated",
    USED = "used",
    REMOVED = "removed",
    CANCELED = "cancelled",
    EXPIRED = "expired",
}

export enum GiftResourceBonusStatus {
    WAITING = "waiting",
    NEW = "new", // (betting status) same as waiting
    WAIT_ACTIVATION = "wait_activation", // (betting status) same as waiting

    ACTIVE = "active",
    ACTIVATED = "activated", // (betting status) same as active

    WAGER_DONE = "wager_done",
    FINISHED = "finished", // (betting status) same as wager_done

    LOST = "lost",
    CANCELED = "cancelled",
    EXPIRED = "expired",
}

export enum GiftResourceType {
    DEPOSIT_BONUS = "Deposit bonus",
//  NON_DEPOSIT = "NonDeposit", // not in use
    UNIVERSAL_GAMING = "Universal gaming",
    CASH = "Cash",
    GROUP = "Group",
    CASHBACK = "Cashback",
    ACTION_CURRENCY = "Action currency",
    BETTING = "Betting",
    XP = "XP",
    VIP_POINTS = "XP & SP",
    CUSTOM_GIFT = "Custom Gift",
    DEPOSIT_INSURANCE = "Deposit insurance",
}

export enum GiftResourceSubtype {
    WAGERING = "wagering",
    REAL_WAGERING = "real_wagering",
    FREE_BET = "free_bet",
    GIFT_SPIN = "gs",
    FREE_CHIPS = "fc",
    FEATURE_TRIGGER = "ft",
}

export interface IGiftResource {
    id: string;
    giftId: string;
    title: string;
    description: string;
    shortDescription: string;
    type: GiftResourceType;
    status: string;
    rate: number;
    label: string;
    depositNumber: number;
    receivedAt: string;
    expiredAt: string;
    expiresIn: number;
    image: string;
    offerTitle: string|null;
    restrictions: {
        needsValidEmail: boolean;
        needsValidPhone: boolean;
        multiAccountBlock: boolean;
        depositLimits: Array<{
            currency: Currency;
            limit: number;
        }>;
        depositLimit: number;
        paymentMethods: string[];
    };
    restrictionsState: {
        validEmail: boolean;
        validPhone: boolean;
        uniqueAccount: boolean;
        depositProgress: number;
    };
    localisation: Localisation;
    customFields: IGiftCustomFieldsV2;
}

export enum IGiftCustomFieldsV2BetType {
    EXPRESS_AND_SINGLE = 1,
    SINGLE = 2,
    EXPRESS = 3,
}
export interface IGiftCustomFieldsV2Rate {
    currency: Currency;
    bet: number;
}

export interface IGiftCustomFieldsV2 {
    giftDetails?: Array<{
        type: GiftResourceType;
        subtype?: GiftResourceSubtype;
        wager?: number;
    }>;
    amount?: number;
    currency: Currency;
    multiplier?: number;
    sum?: number;
    isQueued?: boolean;
    sums?: Array<Record<string, unknown>>;
    minWageringOdd?: number;
    sumsAsPercent?: boolean;
    sumLimit?: number;
    winLimit?: number;
    gameName?: string;
    winLimitPercent?: boolean;
    cashbackValue?: number;
    betSum?: number;
    wager?: number;
    subtype?: GiftResourceSubtype;
    minNumberOfSelections?: number;
    gameSlug?: string;
    gameTitle?: string;
    allowedBetType?: IGiftCustomFieldsV2BetType;
    meta?: {
        rounds?: number;
        rates?: IGiftCustomFieldsV2Rate[];
        meta?: {
            showRates?: IGiftCustomFieldsV2Rate[];
            showRatesEnabled?: boolean;
        };
    };
    maxTotalOdd?: number;
}

export interface IGiftResourceV2 {
    id: string;
    giftId: string;
    title: string;
    description: string;
    shortDescription: string;
    type: GiftResourceType;
    subType: GetUserGiftsSubtype;
    status: GiftResourceStatus;
    rate: number;
    label: string;
    depositNumber: number;
    receivedAt: string;
    expiredAt: string;
    expiresIn: number;
    image: string;
    offerTitle: string|null;
    restrictions: {
        needsValidEmail: boolean;
        needsValidPhone: boolean;
        multiAccountBlock: boolean;
        depositLimits: Array<{
            currency: Currency;
            limit: number;
        }>;
        depositLimit: number;
        paymentMethods: string[];
    };
    restrictionsState: {
        validEmail: boolean;
        validPhone: boolean;
        uniqueAccount: boolean;
        depositProgress: number;
    };
    localisation?: Localisation;
    customFields: IGiftCustomFieldsV2 | null;
    bonus?: {
        id: string;
        value: number;
        initial: number;
        wager: {
            limit: number;
            value: number;
        };
        type: string;
        status: GiftResourceBonusStatus;
    };
}

export interface IGiftAllResource {
    [GetUserGiftsAvailability.ACTIVE]: IGiftResourceV2[];
    [GetUserGiftsAvailability.AVAILABLE]: IGiftResourceV2[];
}

export enum IGiftActivateResourceErrorCode {
    NEED_ADDITIONAL_ACTIVATION = "NEED_ADDITIONAL_ACTIVATION",
    EMAIL_VERIFICATION_REQUIRED = "EMAIL_VERIFICATION_REQUIRED",
    PHONE_VERIFICATION_REQUIRED = "PHONE_VERIFICATION_REQUIRED",
    UNKNOWN = "UNKNOWN",
}

export interface IGiftActivateResource {
    success: boolean;
    error: string;
    errorCode: IGiftActivateResourceErrorCode;
}

export interface IGetUserGiftsDTO {
    filter: {
        availability: GetUserGiftsAvailability;
        subType: GetUserGiftsSubtype;
    },
    pagination?: {
        pageNumber: number;
        perPage: number;
    },
}

export enum BonusType {
    CASINO = "casino",
    SPORT = "betting",
    INSURANCE = "insurance"
}
