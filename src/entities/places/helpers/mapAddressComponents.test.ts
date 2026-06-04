import { describe, it, expect } from 'vitest';
import { mapAddressComponents } from './mapAddressComponents';
import type { PlaceAddressComponent } from '../api/types';

const fullAddressComponents: PlaceAddressComponent[] = [
  {
    longText: '123',
    shortText: '123',
    types: ['street_number'],
  },
  {
    longText: 'Main Street',
    shortText: 'Main St',
    types: ['route'],
  },
  {
    longText: 'Toronto',
    shortText: 'Toronto',
    types: ['locality'],
  },
  {
    longText: 'Ontario',
    shortText: 'ON',
    types: ['administrative_area_level_1'],
  },
  {
    longText: 'M5V 2T6',
    shortText: 'M5V 2T6',
    types: ['postal_code'],
  },
  {
    longText: 'Canada',
    shortText: 'CA',
    types: ['country'],
  },
];

describe('mapAddressComponents', () => {
  it('maps a full address to profile fields', () => {
    expect(mapAddressComponents(fullAddressComponents, '123 Main Street, Toronto, ON M5V 2T6, Canada')).toEqual({
      street: '123 Main Street',
      city: 'Toronto',
      state: 'ON',
      zip: 'M5V 2T6',
      country: 'CA',
      address: '123 Main Street, Toronto, ON M5V 2T6, Canada',
    });
  });

  it('formats street as "Number Route" for number-first countries (e.g., CA)', () => {
    expect(mapAddressComponents(fullAddressComponents).street).toBe('123 Main Street');
  });

  it('formats street as "Route Number" for default/European countries (e.g., UA)', () => {
    const components: PlaceAddressComponent[] = [
      { longText: '22', types: ['street_number'] },
      { longText: 'Khreshchatyk', types: ['route'] },
      { shortText: 'UA', types: ['country'] },
    ];

    expect(mapAddressComponents(components).street).toBe('Khreshchatyk 22');
  });

  it('formats street as "Route Number" if country code is missing', () => {
    const components: PlaceAddressComponent[] = [
      { longText: '10', types: ['street_number'] },
      { longText: 'Unknown Street', types: ['route'] },
    ];

    expect(mapAddressComponents(components).street).toBe('Unknown Street 10');
  });

  it('uses route only when street_number is missing', () => {
    const components = fullAddressComponents.filter((component) => !component.types?.includes('street_number'));

    expect(mapAddressComponents(components)).toEqual({
      street: 'Main Street',
      city: 'Toronto',
      state: 'ON',
      zip: 'M5V 2T6',
      country: 'CA',
      address: null,
    });
  });

  it('uses street_number only when route is missing', () => {
    const components = fullAddressComponents.filter((component) => !component.types?.includes('route'));

    expect(mapAddressComponents(components).street).toBe('123');
  });

  it('falls back to postal_town when locality is missing', () => {
    const components: PlaceAddressComponent[] = [
      {
        longText: 'Springfield',
        shortText: 'Springfield',
        types: ['postal_town'],
      },
      {
        longText: 'Illinois',
        shortText: 'IL',
        types: ['administrative_area_level_1'],
      },
    ];

    expect(mapAddressComponents(components).city).toBe('Springfield');
  });

  it('falls back to sublocality when locality and postal_town are missing', () => {
    const components: PlaceAddressComponent[] = [
      {
        longText: 'Brooklyn',
        shortText: 'Brooklyn',
        types: ['sublocality'],
      },
    ];

    expect(mapAddressComponents(components).city).toBe('Brooklyn');
  });

  it('prefers locality over sublocality based on priority routing', () => {
    const components: PlaceAddressComponent[] = [
      {
        longText: 'Toronto',
        shortText: 'Toronto',
        types: ['locality'],
      },
      {
        longText: 'Old Toronto',
        shortText: 'Old Toronto',
        types: ['sublocality'],
      },
    ];
  
    expect(mapAddressComponents(components).city).toBe('Toronto');
  });

  it('uses shortText for state', () => {
    expect(mapAddressComponents(fullAddressComponents).state).toBe('ON');
  });

  it('falls back to longText for state when shortText is missing', () => {
    const components: PlaceAddressComponent[] = [
      {
        longText: 'Ontario',
        types: ['administrative_area_level_1'],
      },
    ];

    expect(mapAddressComponents(components).state).toBe('Ontario');
  });

  it('uses shortText for country', () => {
    expect(mapAddressComponents(fullAddressComponents).country).toBe('CA');
  });

  it('falls back to longText for country when shortText is missing', () => {
    const components: PlaceAddressComponent[] = [
      {
        longText: 'Canada',
        types: ['country'],
      },
    ];

    expect(mapAddressComponents(components).country).toBe('Canada');
  });

  it('trims whitespace from formattedAddress', () => {
    expect(mapAddressComponents([], '  Main Street  ').address).toBe('Main Street');
  });

  it('returns nulls for an empty components list', () => {
    expect(mapAddressComponents([])).toEqual({
      street: null,
      city: null,
      state: null,
      zip: null,
      country: null,
      address: null,
    });
  });

  it('returns nulls when components are undefined', () => {
    expect(mapAddressComponents(undefined, 'Formatted address')).toEqual({
      street: null,
      city: null,
      state: null,
      zip: null,
      country: null,
      address: 'Formatted address',
    });
  });
});