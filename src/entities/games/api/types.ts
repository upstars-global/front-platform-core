import type { Localisation } from "../../../shared/api";

interface IGamePositioned {
    id: string;
    gamePosition: number;
}

export interface IGameResource {
    id: string;
    gameProvider: string;
    gameProviderSlug: string;
    desktopName: string;
    preview: string;
    slug: string;
    name: string;
    isActive: boolean;
    isDisabled: boolean;
    hasDemoMode: boolean;
    supportedCurrencies: string[];
    isActiveBonusBalance: boolean;
    isDisabledWithBonusBalance: boolean;
    pragmaticLiveTableId: number | null;
    openMobileInIframe: boolean;
    localisation: Localisation;
    badges: Array<{
        type: string;
        theme: string;
        label: string;
    }>;
    gameCategories: Record<string, string>;
    sumWageringMultiplier: number;
}

export interface IGameRecentResource {
    id: string;
    gameProvider: string;
    gameProviderSlug: string;
    desktopName: string;
    preview: string;
    slug: string;
    name: string;
    isActive: boolean;
    isDisabled: boolean;
    hasDemoMode: boolean;
    supportedCurrencies: string[];
    isActiveBonusBalance: boolean;
    isDisabledWithBonusBalance: boolean;
    pragmaticLiveTableId: number | null;
    localisation: Localisation;
    gameProviderStyles: Record<string, unknown>;
    screenshot: string;
    playUrl: string;
    categories: IGamePositioned[];
    producers: IGamePositioned[];
    sumWageringMultiplier: number;
}

export interface IGameProducerResource {
    content: string;
    description: string;
    id: string;
    image: string;
    isNew: boolean;
    localisation: Localisation;
    variables: unknown[];
    meta: {
        title: string;
        description: string;
        keywords: string;
    };
    name: string;
    newGamesCount: number;
    path: string;
    serviceAchievements: unknown[];
    slug: string;
    tags: string[];
    title: string;
    url: string;
}

export interface IGameCategoryResource {
    description: string;
    shortDescription: string|null;
    id: string;
    image: string;
    localisation: Localisation;
    meta: {
        title: string;
        description?: string;
        keywords?: string;
    };
    name: string;
    path: string;
    slug: string;
    tags: { 
      id: string; 
      name: string 
    }[];
    sortableTags: Array<{
        id: string;
        name: string;
        position: number;
    }>;
    url: string;
}
