import { Currency, type Localisation } from "../../../shared/api";
import type { IGiftResource } from "./giftResources";

export enum QuestType {
    ACTIVE = "active",
    ACCESS = "access",
    SOON = "soon",
    DONE = "done",
    FALSY = "falsy",
}

export enum PROMO_MECHANIC {
    STATIC = "static",
    EXCHANGE = "exchange",
}

export enum PROMOTION_TYPE {
    TOURNAMENT = "TOURNAMENT",
    PROMO = "PROMO",
}

export enum PROMOTION_STATUS {
    PAST = "past",
    ACTIVE = "active",
    FUTURE = "future",
}

export interface IUserPromoResource {
    id: string;
    localisation: Record<string, unknown>;
    membership: boolean;
    nextPrice: number;
    points: number;
    prizes: IPromoPrizeResource[];
    progress: number;
    receivedPrizes: [];
    residue: number;
    status: PROMOTION_STATUS;
    title: string;
}

export interface IPromoPrizeResource {
    id: string;
    title: string;
    price: number;
    description: string;
    amount: number;
    challengers: number;
    image: string;
    winners: [];
    leftExchanges: number;
    participantsExchanged: number;
    gift: IGiftResource;
    exchangeLimitPerUser: number;
}

export interface IAchievementRewards {
    id: string;
    localisation: Localisation;
    title: string;
    type: string;
}

export interface IAchievementResource {
    id: string;
    type: string;
    title: string;
    subTitle: string;
    image: string;
    buttonName: string;
    buttonLink: string;
    description: string;
    subDescription: null;
    eventLabel: null;
    level: {
        current: number;
        max: number;
    };
    progress: {
        current: number;
        max: number;
        unit: string;
        unitMax: string;
        multiplier: number;
        createdAt: string;
        doneAt: string | null;
    };
    localisation: Localisation;
    rewards: IAchievementRewards[];
    actions: Array<{
        id: string;
    }>;
    startTime: string | null;
    endTime: string | null;
    typeLabel: QuestType;
}
export interface IPromoDataResource {
    id: string;
    title: string;
    rules: string;
    prizesContent: number | null;
    achievements: IAchievementResource[];
    additionalPrize: {
        title: string;
        description: string;
        image: string;
        link: string;
    };
    prizes: IPromoPrizeResource[];
    steps: string;
    status: PROMOTION_STATUS;
    tournament_id: string | null;
    tournament_ids: [];
    background: string;
    useParticipantBtn: boolean;
    currency?: Record<string, unknown>;
    endAt: string;
    startAt: string;
    fund: string;
    pageType: string;
    slug: string;
    bgColor: string;
    localisation: Localisation;
    participantsCount: number;
    participantsExchanged: number;
    pointPrices: Record<Currency, number>;
    access?: number[] | null;
}

export type ExchangePrizeResource = {
    data: Record<string, unknown> | null;
    error: Record<string, unknown> | null;
    responseId: string;
}

export interface IPromoListResource {
    id: string;
    status: PROMOTION_STATUS;
    endAt: string;
    startAt: string;
    image: string;
    imageSvg: string;
    sortOrder: number;
    type: PROMOTION_TYPE.PROMO;
    title: string;
    fund: string;
    slug: string;
    pageType: PROMO_MECHANIC | null;
    bgColor: string;
    localisation: Localisation;
    tags: string[];
    access: number[] | null;
}

export type ExtractPromoCode = {
    id: string;
    name: string;
    isUsed: boolean;
    couponCode: string;
};

export enum TournamentGameTypes {
    CASINO = "casino",
    LIVE = "live",
}

export enum TournamentAccessVoter {
    PARTNER = "PartnerVoter",
    USER = "UserVoter",
    ACTION = "ActionVoter",
    DEPOSIT = "DepositVoter",
    DEPOSIT_LT = "DepositLtVoter",
    BOT = "BotVoter",
    LEVEL = "LevelVoter",
    STATUS = "UserStatusVoter",
}

export interface ITournamentGift {
    id: string;
    localisation: Localisation;
    shortDescription: string;
    title: string;
}
export interface ITournamentMember {
    authorizedUser: boolean;
    nickname: string;
    gifts: ITournamentGift[];
    id: string;
    localisation: Localisation;
    shortDescription?: string;
    title: string;
    lastResult: {
        id: string;
        image: string;
        path: string;
        slug: string;
        title: string;
        nickname: string;
    };
    position: number;
    score: number;
}
export interface ITournamentResource {
    id: string;
    slug: string;
    customBadge: null;
    type: string;
    image: string;
    imageSvg: string;
    victoryType: string;
    position: null;
    membership: boolean;
    title: string;
    description: string;
    rules: string;
    prize: Record<string, string>;
    prizeFund: string;
    status: string;
    endAt: string;
    startAt: string;
    bet: {
        min: Record<string, number>;
        max: Record<string, number>;
    };
    access: Record<TournamentAccessVoter, unknown> | null;
    sortOrder: null;
    meta: Record<string, string>;
    gifts: {
        position: number;
        gifts: ITournamentGift[];
    }[];
    giftsCount: number;
    members: ITournamentMember[];
    winners: ITournamentMember[];
    games: null;
    gamesCount: number;
    pageType: null;
    bgColor: string;
    localisation: Localisation;
    gameTypes: TournamentGameTypes[];
}

export interface IChooseTournamentResource {
    status: string;
}

export interface ITournamentListResource {
    bgColor?: string;
    endAt: string;
    fund?: string;
    id: string;
    image: string;
    imageSvg: string;
    localisation: Localisation;
    pageType?: PROMO_MECHANIC | null;
    slug: string;
    sortOrder: number;
    startAt: string;
    status: PROMOTION_STATUS;
    title: string;
    type: PROMOTION_TYPE.TOURNAMENT;
    gameTypes: TournamentGameTypes[];
    access?: Record<TournamentAccessVoter, unknown> | null;
    prize: Record<Currency, string>;
    prizeFund: string | null;
    tags: string[];
    victoryType: string;
    customBadge?: string | null;
}

export interface IUserTournamentListResource {
    id: string;
    slug: string;
    status: string;
    title: string;
    tags: string[];
    gameTypes: TournamentGameTypes[];
}

