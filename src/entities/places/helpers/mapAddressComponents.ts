import type { MappedPlaceAddress, PlaceAddressComponent } from '../api/types';

const CITY_TYPES = ['locality', 'postal_town', 'sublocality'] as const;

function getComponent(
  components: PlaceAddressComponent[],
  type: string,
): PlaceAddressComponent | undefined {
  return components.find((component) => component.types?.includes(type));
}

function getComponentText(component: PlaceAddressComponent | undefined): string | null {
  if (!component) {
    return null;
  }

  return component.longText?.trim() || component.shortText?.trim() || null;
}

function getShortText(component: PlaceAddressComponent | undefined): string | null {
  return component?.shortText?.trim() || component?.longText?.trim() || null;
}

function getStreet(components: PlaceAddressComponent[]): string | null {
  const streetNumber = getComponentText(getComponent(components, 'street_number'));
  const route = getComponentText(getComponent(components, 'route'));

  if (streetNumber && route) {
    return `${streetNumber} ${route}`;
  }

  return route || streetNumber;
}

function getCity(components: PlaceAddressComponent[]): string | null {
  for (const type of CITY_TYPES) {
    const city = getComponentText(getComponent(components, type));
    if (city) {
      return city;
    }
  }

  return null;
}

export function mapAddressComponents(
  components: PlaceAddressComponent[] | undefined,
  formattedAddress?: string,
): MappedPlaceAddress {
  const list = components ?? [];
  const stateComponent = getComponent(list, 'administrative_area_level_1');
  const countryComponent = getComponent(list, 'country');

  return {
    street: getStreet(list),
    city: getCity(list),
    state: getShortText(stateComponent),
    zip: getComponentText(getComponent(list, 'postal_code')),
    country: getShortText(countryComponent),
    address: formattedAddress?.trim() || null,
  };
}