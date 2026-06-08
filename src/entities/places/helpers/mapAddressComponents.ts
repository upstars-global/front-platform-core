import { COUNTRIES } from '../../../shared';
import type { MappedPlaceAddress, PlaceAddressComponent } from '../api/types';

const DEFAULT_CITY_TYPES = ['locality', 'postal_town', 'sublocality'] as const;
const GB_CITY_TYPES = ['postal_town', 'locality', 'sublocality'] as const;

const DEFAULT_STATE_TYPES = [
  'administrative_area_level_1',
  'administrative_area_level_2',
] as const;

const LEVEL_2_STATE_TYPES = [
  'administrative_area_level_2',
  'administrative_area_level_1',
] as const;

const NUMBER_FIRST_COUNTRIES = new Set([
  COUNTRIES.USA,
  COUNTRIES.CANADA,
  COUNTRIES.ENGLAND,
  COUNTRIES.AUSTRALIA,
  COUNTRIES.NEW_ZEALAND,
  COUNTRIES.IRELAND,
  COUNTRIES.FRANCE,
  COUNTRIES.SOUTH_AFRICA,
  COUNTRIES.INDIA,
  COUNTRIES.SINGAPORE,
  COUNTRIES.PHILIPPINES,
]);

const LEVEL_2_STATE_COUNTRIES = new Set([
  COUNTRIES.ITALY, 
  COUNTRIES.FRANCE, 
  COUNTRIES.ENGLAND
]);

function getComponent(
  components: PlaceAddressComponent[],
  type: string,
): PlaceAddressComponent | undefined {
  return components.find((component) => component.types?.includes(type));
}

function getComponentText(
  component: PlaceAddressComponent | undefined,
  prefer: 'long' | 'short' = 'long',
): string | null {
  if (!component) return null;

  return prefer === 'long'
    ? component.longText?.trim() || component.shortText?.trim() || null
    : component.shortText?.trim() || component.longText?.trim() || null;
}

function getStreet(components: PlaceAddressComponent[], countryCode?: string | null): string | null {
  const streetNumber = getComponentText(getComponent(components, 'street_number'));
  const route = getComponentText(getComponent(components, 'route'));

  if (streetNumber && route) {
    return NUMBER_FIRST_COUNTRIES.has(countryCode ?? '')
      ? `${streetNumber} ${route}`
      : `${route} ${streetNumber}`;
  }

  return route || streetNumber;
}

function getCity(components: PlaceAddressComponent[], countryCode?: string | null): string | null {
  const types = countryCode === COUNTRIES.ENGLAND ? GB_CITY_TYPES : DEFAULT_CITY_TYPES;

  for (const type of types) {
    const city = getComponentText(getComponent(components, type));
    if (city) return city;
  }

  return null;
}

function getState(components: PlaceAddressComponent[], countryCode?: string | null): string | null {
  const types = LEVEL_2_STATE_COUNTRIES.has(countryCode ?? '') 
    ? LEVEL_2_STATE_TYPES 
    : DEFAULT_STATE_TYPES;

  for (const type of types) {
    const state = getComponentText(getComponent(components, type), 'short');
    if (state) return state;
  }

  return null;
}

export function mapAddressComponents(
  components: PlaceAddressComponent[] | undefined,
  formattedAddress?: string,
): MappedPlaceAddress {
  const normalizedComponents = components ?? [];
  const countryComponent = getComponent(normalizedComponents, 'country');
  const countryCode = countryComponent?.shortText?.trim().toUpperCase() || null;

  return {
    street: getStreet(normalizedComponents, countryCode),
    city: getCity(normalizedComponents, countryCode),
    state: getState(normalizedComponents, countryCode),
    zip: getComponentText(getComponent(normalizedComponents, 'postal_code')),
    country: getComponentText(countryComponent, 'short'),
    address: formattedAddress?.trim() || null,
  };
}