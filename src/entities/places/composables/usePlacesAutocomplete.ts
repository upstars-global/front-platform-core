import { computed, onScopeDispose, ref, toValue, type MaybeRefOrGetter } from 'vue';
import { v4 as uuid } from 'uuid';
import { placesAPI } from '../api/requests';
import type {
  MappedPlaceAddress,
  PlaceAutocompleteSuggestion,
  PlacePrediction,
  PlacesAutocompleteResponse,
} from '../api/types';
import { mapAddressComponents } from '../helpers/mapAddressComponents';
import { isAbortError } from '../../../shared/guards';
import { createCache } from '../../../shared/helpers/cache/createCache';

const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_MIN_SEARCH_LENGTH = 3;
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_MAX_SIZE = 50; // 50 suggestions

export interface UsePlacesAutocompleteOptions {
  country: MaybeRefOrGetter<string>;
  lang: MaybeRefOrGetter<string>;
  debounceMs?: number;
  minSearchLength?: number;
  cacheTtlMs?: number;
  cacheMaxSize?: number;
}

function getPlaceId(prediction: PlacePrediction): string | null {
  if (prediction.placeId) return prediction.placeId;

  if (prediction.place?.startsWith('places/')) return prediction.place.slice('places/'.length);

  return prediction.place ?? null;
}

function getSuggestionLabel(prediction: PlacePrediction): string {
  if (prediction.text?.text) return prediction.text.text;

  const main = prediction.structuredFormat?.mainText?.text;
  const secondary = prediction.structuredFormat?.secondaryText?.text;

  if (main && secondary) return `${main}, ${secondary}`;

  return main || secondary || '';
}

function parseSuggestions(response: PlacesAutocompleteResponse | undefined): PlaceAutocompleteSuggestion[] {
  if (!response?.payload.suggestions) return [];

  return response.payload.suggestions
    .map((suggestion) => {
      const prediction = suggestion.placePrediction;

      if (!prediction) return null;

      const placeId = getPlaceId(prediction);

      const label = getSuggestionLabel(prediction);

      if (!placeId || !label) return null;

      return { placeId, label };
    })
    .filter((item): item is PlaceAutocompleteSuggestion => item !== null);
}

export function usePlacesAutocomplete(options: UsePlacesAutocompleteOptions) {
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const minSearchLength = options.minSearchLength ?? DEFAULT_MIN_SEARCH_LENGTH;
  const cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  const cacheMaxSize = options.cacheMaxSize ?? DEFAULT_CACHE_MAX_SIZE;

  const search = ref('');
  const sessionToken = ref(uuid());
  const suggestions = ref<PlaceAutocompleteSuggestion[]>([]);
  const isLoadingAutocomplete = ref(false);
  const isLoadingDetails = ref(false);
  const error = ref<unknown>(null);

  const cache = createCache<PlaceAutocompleteSuggestion[]>({
    ttlMs: cacheTtlMs,
    maxSize: cacheMaxSize,
  });

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let abortController: AbortController | null = null;

  function resetSession() {
    sessionToken.value = uuid();
  }

  function clearSuggestions() {
    suggestions.value = [];
    error.value = null;
  }

  async function fetchAutocomplete() {
    const query = search.value.trim();
  
    if (query.length < minSearchLength) {
      clearSuggestions();
      return;
    }

    abortController?.abort();
  
    const cacheKey = `${query}:${toValue(options.country)}:${toValue(options.lang)}`;
    const cached = cache.get(cacheKey);
  
    if (cached) {
      suggestions.value = cached;
      return;
    }
  
    abortController = new AbortController();
  
    isLoadingAutocomplete.value = true;
    error.value = null;
  
    try {
      const response = await placesAPI.autocomplete(
        {
          sessionToken: sessionToken.value,
          search: query,
          country: toValue(options.country),
          lang: toValue(options.lang),
        },
        abortController.signal,
      );

      if (response.error) {
        throw new Error(response.error.description);
      }
  
      const parsed = parseSuggestions(response.data);

      cache.set(cacheKey, parsed);

      suggestions.value = parsed;
    } catch (err) {
      if (isAbortError(err)) return;
  
      error.value = err;
      suggestions.value = [];
    } finally {
      isLoadingAutocomplete.value = false;
    }
  }

  function onSearchInput(value: string) {
    search.value = value;

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      fetchAutocomplete();
    }, debounceMs);
  }

  async function selectPlace(placeId: string): Promise<MappedPlaceAddress | null> {
    isLoadingDetails.value = true;
    error.value = null;

    try {
      const response = await placesAPI.details({
        sessionToken: sessionToken.value,
        placeId,
        lang: toValue(options.lang),
      });

      if (!response.data?.payload?.addressComponents) return null;

      const address = mapAddressComponents(response.data.payload.addressComponents, response.data.payload.formattedAddress);

      resetSession();
      clearSuggestions();
      
      search.value = address.address ?? '';

      return address;
    } catch (err) {
      error.value = err;
      return null;
    } finally {
      isLoadingDetails.value = false;
    }
  }

  onScopeDispose(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    abortController?.abort();
  });

  const hasSuggestions = computed(() => suggestions.value.length > 0);

  return {
    search,
    suggestions,
    hasSuggestions,
    isLoadingAutocomplete,
    isLoadingDetails,
    error,
    onSearchInput,
    clearSuggestions,
    selectPlace,
  };
}
