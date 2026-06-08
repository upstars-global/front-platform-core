export interface PlacesAutocompleteParams {
  sessionToken: string;
  search: string;
  country: string;
  lang: string;
}

export interface PlacesDetailsParams {
  sessionToken: string;
  placeId: string;
  lang: string;
}

export interface PlaceTextMatch {
  startOffset?: number;
  endOffset?: number;
}

export interface PlaceText {
  text?: string;
  matches?: PlaceTextMatch[];
}

export interface PlaceStructuredFormat {
  mainText?: PlaceText;
  secondaryText?: PlaceText;
}

export interface PlacePrediction {
  place?: string;
  placeId?: string;
  text?: PlaceText;
  structuredFormat?: PlaceStructuredFormat;
  types?: string[];
}

export interface PlaceSuggestion {
  placePrediction?: PlacePrediction;
}

export interface PlacesAutocompleteResponse {
  payload: {
    suggestions?: PlaceSuggestion[];
  }
}

export interface PlaceAddressComponent {
  longText?: string;
  shortText?: string;
  types?: string[];
  languageCode?: string;
}

export interface PlacesDetailsResponse {
  payload: {
    id?: string;
    displayName?: string;
    formattedAddress?: string;
    addressComponents?: PlaceAddressComponent[];
  }
}

export interface MappedPlaceAddress {
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  address: string | null;
}

export interface PlaceAutocompleteSuggestion {
  placeId: string;
  label: string;
}