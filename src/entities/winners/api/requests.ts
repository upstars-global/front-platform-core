import { publicApiV1 } from "../../../shared/libs/http";
import { log } from "../../../shared/helpers/log";
import type { IWinnerResource } from "./types";

export const winnersAPI = {
    async loadWinnersData(secured: boolean): Promise<IWinnerResource | null | undefined> {
        try {
            const response = await publicApiV1<IWinnerResource | null>({
                url: "/winners/get",
                secured,
                type: (securedType) => `Winners.V1.${securedType}.Winners.Get`,
            });
            return response.data;
        } catch (error: unknown) {
            log.error("LOAD_WINNERS_DATA", error);
        }
    },
};
