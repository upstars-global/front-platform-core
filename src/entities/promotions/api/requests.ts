import { jsonApi, jsonHttp, publicApiV1, publicApiV2 } from "../../../shared/libs/http";
import { log } from "../../../shared/helpers/log";
import type {
    ExtractPromoCode,
    ExchangePrizeResource,
    IPromoDataResource,
    IPromoListResource,
    IUserPromoResource,
    IChooseTournamentResource,
    ITournamentListResource,
    ITournamentResource,
    IUserTournamentListResource,
} from "./types";

export const promoAPI = {
    async loadPromoList(tags: string | string[] = [], page: number, perPage: number) {
        const tagList = Array.isArray(tags) ? tags : [ tags ];
        try {
            return await publicApiV1<IPromoListResource[]>({
                url: "action/list",
                type: (securedType) => `Action.${securedType}.Action.List`,
                secured: false,
                data: {
                    filter: {
                        tags: tagList,
                    },
                    pagination: {
                        pageNumber: page,
                        perPage,
                    },
                },
            });
        } catch (error) {
            log.error("LOAD_ACTIVE_PROMO_DATA", error);
        }
    },
    async loadActivePromo(secured: boolean = false) {
        try {
            const response = await publicApiV1<IPromoDataResource>({
                type: (securedType) => `Action.${securedType}.Action.ViewActive`,
                url: "action/view-active",
                secured,
            });
            return response.data as IPromoDataResource;
        } catch (error: unknown) {
            log.error("LOAD_ACTIVE_PROMO_DATA", error);
            throw error;
        }
    },
    async loadUserPromoData() {
        try {
            const response = await publicApiV1<IUserPromoResource[]>({
                url: "action/participant",
                type: (securedType) => `Action.${securedType}.Action.Participant`,
                secured: true,
            });
            return response.data as IUserPromoResource[];
        } catch (error: unknown) {
            log.error("LOAD_USER_PROMO_DATA", error);
            throw error;
        }
    },
    async participateInPromotions(actionId: string) {
        try {
            const response = await publicApiV2<{ actionId: string }>({
                url: "action/be-participant",
                type: (securedType) => `Action.V2.${securedType}.Action.UserParticipant`,
                secured: true,
                data: {
                    data: {
                        actionId,
                    },
                },
            });
            return response.data as { actionId: string };
        } catch (error) {
            log.error("PARTICIPATE_IN_PROMOTIONS", error);
        }
    },
    async loadCurrentPromoBySlug(slug: string, secured: boolean = false) {
        try {
            const response = await publicApiV1<IPromoDataResource>({
                url: "action/view/slug",
                type: (securedType) => `Action.${securedType}.Action.ViewBySlug`,
                data: { data: { slug } },
                secured,
            });
            return response.data as IPromoDataResource;
        } catch (error: unknown) {
            log.error("LOAD_CURRENT_PROMO_PAGE_BY_PAGE", error);
            throw error;
        }
    },
    async exchangePrize(data: Record<string, unknown>, secured: boolean = false) {
        try {
            return await publicApiV1<ExchangePrizeResource>({
                url: "action/prizes/exchange",
                type: (securedType) => `Action.${securedType}.Action.ExchangePrize`,
                data: { data },
                secured,
            });
        } catch (error: unknown) {
            log.error("EXCHANGE_PRIZE", error);
            throw error;
        }
    },
    async extractPromoCode() {
        try {
            const response = await publicApiV1<ExtractPromoCode>({
                url: "action/public-promo-code/extract",
                type: () => "PublicApi.V1.Json.Public.Promo.Code.Extract",
                secured: true,
            });
            return response.data as ExtractPromoCode;
        } catch (error: unknown) {
            log.error("EXTRACT_PROMO_CODE", error);
            throw error;
        }
    },
};

export const tournamentsAPI = {
    async loadTournament(slug: string): Promise<ITournamentResource> {
        try {
            return await jsonApi<ITournamentResource>(`/tournaments/${slug}`, {
                method: "GET",
            });
        } catch (error: unknown) {
            log.error("LOAD_TOURNAMENT_BY_SLUG", error);
            throw error;
        }
    },
    async chooseTournament(id: string): Promise<IChooseTournamentResource> {
        try {
            return await jsonHttp<IChooseTournamentResource>(`/app/tournaments/phase/choose/${id}`);
        } catch (error: unknown) {
            log.error("CHOOSE_TOURNAMENT_BY_ID", error);
            throw error;
        }
    },
    async loadTournamentList(tags: string | string[] = [], page: number, perPage: number) {
        const tagList = Array.isArray(tags) ? tags : [ tags ];
        try {
            return await publicApiV1<ITournamentListResource[]>({
                url: "/tournaments/list",
                type: (securedType) => `Tournament.${securedType}.Tournament.List`,
                secured: false,
                data: {
                    filter: {
                        tags: tagList,
                    },
                    pagination: {
                        pageNumber: page,
                        perPage,
                    },
                },
            });
        } catch (error: unknown) {
            log.error("LOAD_TOURNAMENT_LIST", error);
        }
    },
    async loadUserTournamentList(): Promise<IUserTournamentListResource[] | undefined> {
        try {
            const response = await publicApiV1<IUserTournamentListResource[]>({
                url: "/tournaments/participant/list",
                type: (securedType) => `Tournament.${securedType}.Tournament.UserParticipation.List`,
                secured: true,
            });
            return response.data || [];
        } catch (error: unknown) {
            log.error("LOAD_USER_TOURNAMENT_LIST", error);
        }
    },
};

