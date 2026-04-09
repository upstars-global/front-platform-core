import { publicApiV1, publicApiV2 } from "../../../shared/libs/http";
import { log } from "../../../shared/helpers/log";
import type {
    IGameCategoryResource,
    IGameProducerResource,
    IGameRecentResource,
    IGameResource,
} from "./types";

export const gamesAPI = {
    async loadRecentGamesByPage(): Promise<IGameRecentResource[]> {
        try {
            const response = await publicApiV1<IGameRecentResource[]>({
                url: "/game/recent/list",
                secured: true,
                type: (securedType: string) => `Games.${securedType}.Games.ViewRecent`,
            });

            if (response.error) {
                log.error("LOAD_GAME_RECENT", response.error);
            }
            return Array.isArray(response.data) ? response.data : [];
        } catch (error: unknown) {
            log.error("LOAD_GAME_RECENT", error);
        }

        return [];
    },
    async loadGamesProducers(tags: string | string[], secured: boolean): Promise<IGameProducerResource[]> {
        const tagList = Array.isArray(tags) ? tags : [ tags ];
        try {
            const response = await publicApiV1<IGameProducerResource[]>({
                url: "/game/producer/list",
                secured,
                type: (securedType) => `Games.${securedType}.Producer.List`,
                data: {
                    filter: {
                        tags: tagList,
                    },
                },
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            log.error("LOAD_GAMES_PRODUCERS", error);
        }

        return [];
    },
    async loadGamesByProducer(secured: boolean, slug: string, page: number, perPage: number) {
        try {
            return await publicApiV1<IGameResource[]>({
                url: "/game/by-producer/list",
                secured,
                type: (securedType) => `Games.${securedType}.Games.ViewByProducer`,
                data: {
                    data: {
                        identifier: slug,
                    },
                    pagination: {
                        pageNumber: page,
                        perPage,
                    },
                },
            });
        } catch (error) {
            log.error("LOAD_GAMES_BY_PRODUCER", error);
            throw error;
        }
    },
    async loadGameCategoryList(tags: string | string[] = []): Promise<IGameCategoryResource[]> {
        try {
            const tagsList = Array.isArray(tags) ? tags : [ tags ];
            const response = await publicApiV1<IGameCategoryResource[]>({
                url: "/game/category/list",
                secured: false,
                type: (securedType) => `Games.${securedType}.Category.List`,
                data: {
                    filter: {
                        tags: tagsList,
                    },
                },
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            log.error("LOAD_GAME_CATEGORY_LIST", error);
        }

        return [];
    },
    async loadGameBySlug(secured: boolean, slug: string) {
        try {
            const response = await publicApiV1<IGameResource | null>({
                url: "/game/by-slug",
                secured,
                type: (securedType) => `Games.${securedType}.Game.ViewBySlug`,
                data: {
                    data: {
                        slug,
                    },
                },
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            log.error("LOAD_GAME_BY_SLUG", error);
            throw error;
        }
    },
    async loadGamesByCategory(secured: boolean, slug: string, page: number, perPage: number) {
        try {
            return await publicApiV1<IGameResource[]>({
                url: "game/by-category/list",
                secured,
                type: (securedType) => `Games.${securedType}.Games.ViewByCategory`,
                data: {
                    data: {
                        identifier: slug,
                    },
                    pagination: {
                        pageNumber: page,
                        perPage,
                    },
                },
            });
        } catch (error) {
            log.error("LOAD_GAMES_BY_CATEGORY", error);
            throw error;
        }
    },
    async loadGamesByPage(secured: boolean, slug: string, page: number, perPage: number) {
        try {
            return await publicApiV1<IGameResource[]>({
                url: "game/by-page/list",
                secured,
                type: (securedType) => `Games.${securedType}.Games.ViewByPage`,
                data: {
                    data: {
                        identifier: slug,
                    },
                    pagination: {
                        pageNumber: page,
                        perPage,
                    },
                },
            });
        } catch (error) {
            log.error("LOAD_GAMES_BY_PAGE", error);
            throw error;
        }
    },
    async loadGamesByTournament(secured: boolean, slug: string, token: string | undefined, page: number, perPage: number) {
        try {
            return await publicApiV1<IGameResource[]>({
                url: "game/by-tournament-phase/list",
                secured,
                type: (securedType) => `Games.${securedType}.Games.ViewByTournamentPhase`,
                data: {
                    filter: {
                        identifier: slug,
                        token,
                    },
                    pagination: {
                        pageNumber: page,
                        perPage,
                    },
                },
            });
        } catch (error) {
            log.error("LOAD_GAMES_BY_PAGE", error);
            throw error;
        }
    },
    async loadRecommendedGames(page: number, perPage: number) {
        try {
            return await publicApiV1<IGameResource[]>({
                url: "game/recommended/list",
                secured: true,
                type: (securedType) => `Games.${securedType}.RecommendedGames.ByCategory`,
                data: {
                    pagination: {
                        pageNumber: page,
                        perPage,
                    },
                },
            });
        } catch (error: unknown) {
            log.error("LOAD_RECOMMENDED_GAMES", error);
        }
    },
    async searchGamesByName(secured: boolean, token: string, page: number, perPage: number) {
        try {
            return await publicApiV2<IGameResource[]>({
                url: "/game/by-token/list",
                secured,
                type: (securedType) => `Games.V2.${securedType}.Games.ViewByToken`,
                data: {
                    data: {
                        token,
                    },
                    pagination: {
                        pageNumber: page,
                        perPage,
                    },
                },
            });
        } catch (error) {
            log.error("SEARCH_GAMES_BY_NAME", error);
            throw error;
        }
    },
};
