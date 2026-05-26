import { log } from '../../../shared/helpers/log';
import { publicApiV1 } from '../../../shared/libs/http';
import type { IRegionResource } from './types';

export const coreAPI = {
    async getRegionsByCountryCode(countryCode: string) {
        try {
            const response = await publicApiV1<IRegionResource[]>({
                url: "/core/country-region/list",
                type: (securedType) => `Core.V1.${securedType}.CountryRegion.List`,
                data: {
                    filter: {
                        countryCode,
                    },
                },
            });
            if (response.error) {
                log.error("REGIONS_BY_COUNTRY_CODE_SERVER", response.error);
                return [];
            }
            return response.data;
        } catch (error) {
            log.error("REGIONS_BY_COUNTRY_CODE", error);
            return [];
        }
    },
};
