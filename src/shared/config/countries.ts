export const COUNTRIES = {
  CANADA: 'CA',
  AUSTRALIA: 'AU',
  NEW_ZEALAND: 'NZ',
  USA: 'US',
  INDIA: 'IN',
  ENGLAND: 'GB',
  BRASILIA: 'BR',
  GERMANY: 'DE',
  AUSTRIA: 'AT',
  ITALY: 'IT',
  FRANCE: 'FR',
  PORTUGAL: 'PT',
  SPAIN: 'ES',
  NETHERLANDS: 'NL',
};

export const REGIONS_BY_COUNTRIES: Record<string, string[]> = {
  [COUNTRIES.CANADA]: ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],
};