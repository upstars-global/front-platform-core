import { jsonHttp } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import type {
  PlacesAutocompleteParams,
  PlacesAutocompleteResponse,
  PlacesDetailsParams,
  PlacesDetailsResponse,
} from './types';
import { isAbortError } from '../../../shared/guards';

function buildQuery(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

export const placesAPI = {
  async autocomplete(params: PlacesAutocompleteParams, signal: AbortSignal) {
    try {
      return await jsonHttp<PlacesAutocompleteResponse>(
        `/fe-api/places/autocomplete?${buildQuery({
          sessionToken: params.sessionToken,
          search: params.search,
          country: params.country,
          lang: params.lang,
        })}`,
        { signal },
      );
    } catch (error) {
      if (isAbortError(error)) throw error;
      
      log.error('PLACES_AUTOCOMPLETE', error);
      throw error;
    }
  },

  async details(params: PlacesDetailsParams) {
    try {
      return await jsonHttp<PlacesDetailsResponse>(
        `/fe-api/places/details?${buildQuery({
          sessionToken: params.sessionToken,
          id: params.id,
          lang: params.lang,
        })}`,
      );
    } catch (error) {
      log.error('PLACES_DETAILS', error);
      throw error;
    }
  },
};