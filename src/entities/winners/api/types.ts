import type { Currency } from "../../../shared/api";

export interface IWinnerGame {
    title: string;
    image: string;
    link: string;
    hasDemoMode: boolean;
    slug: string;
    gameProviderSlug: string;
    isActiveBonusBalance: boolean;
    isDisabledWithBonusBalance: boolean;
}

export interface IWinnerData {
    game: IWinnerGame;
    id: string;
    sum: number;
    currency: Currency;
    realSum: number;
    realCurrency: Currency;
    username: string;
    userId: string;
}

export interface IWinnerOptions {
    currency: Currency;
    rotation: number;
}

export interface IWinnerResource {
    winners: IWinnerData[];
    options: IWinnerOptions;
}
