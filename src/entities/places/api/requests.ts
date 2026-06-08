import { publicApiV1 } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import type {
  PlacesAutocompleteParams,
  PlacesAutocompleteResponse,
  PlacesDetailsParams,
  PlacesDetailsResponse,
} from './types';
import { isAbortError } from '../../../shared/guards';

export const placesAPI = {
  async autocomplete(params: PlacesAutocompleteParams, signal?: AbortSignal) {
    try {
      return await publicApiV1<PlacesAutocompleteResponse>({
        url: '/places/autocomplete',
        type: () => 'GooglePlaces.V1.PublicSecured.Places.Autocomplete',
        secured: true,
        data: {
          data: {
            sessionToken: params.sessionToken,
            search: params.search,
            country: params.country,
            lang: params.lang,
          }
        },
        signal,
      });
    } catch (error) {
      if (isAbortError(error)) throw error;
      
      log.error('PLACES_AUTOCOMPLETE', error);
      throw error;
    }
  },

  async details(params: PlacesDetailsParams) {
    try {
      return await publicApiV1<PlacesDetailsResponse>({
        url: '/places/details',
        type: () => 'GooglePlaces.V1.PublicSecured.Places.Details',
        secured: true,
        data: {
          data: {
            sessionToken: params.sessionToken,
            placeId: params.placeId,
            lang: params.lang,
          }
        },
      });
    } catch (error) {
      log.error('PLACES_DETAILS', error);
      throw error;
    }
  },
};