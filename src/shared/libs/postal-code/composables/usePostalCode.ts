import { computed } from "vue";

type PostalCodeConfig = {
    pattern: RegExp;
    mask: string;
    placeholder: string;
}

type InputRuleString = (value: string) => boolean | string;

/**
 * Country-specific postal code configurations.
 * Keys are ISO 3166-1 alpha-2 country codes (uppercase).
 *
 * Masks handle all formatting (spaces, character-type enforcement).
 * Patterns validate the already-masked value, so spaces are guaranteed
 * to be in the correct position for countries with a fixed mask.
 * Patterns use /i so lowercase input passes without needing normalization.
 */
const POSTAL_CODE_CONFIGS: Record<string, PostalCodeConfig> = {
    // Canada: A1A 1A1 — mask inserts the space automatically
    CA: { pattern: /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/, mask: "A#A #A#", placeholder: "A1A 1A1" },
    // Australia: 4 digits
    AU: { pattern: /^\d{4}$/, mask: "####", placeholder: "2000" },
    // Italy: 5 digits
    IT: { pattern: /^\d{5}$/, mask: "#####", placeholder: "00100" },
    // Germany: 5 digits
    DE: { pattern: /^\d{5}$/, mask: "#####", placeholder: "12345" },
    // New Zealand: 4 digits
    NZ: { pattern: /^\d{4}$/, mask: "####", placeholder: "6011" },
    // Estonia: 5 digits
    EE: { pattern: /^\d{5}$/, mask: "#####", placeholder: "15165" },
    // Finland: 5 digits
    FI: { pattern: /^\d{5}$/, mask: "#####", placeholder: "00100" },
    // Norway: 4 digits
    NO: { pattern: /^\d{4}$/, mask: "####", placeholder: "0161" },
    // Austria: 4 digits
    AT: { pattern: /^\d{4}$/, mask: "####", placeholder: "1010" },
    // Sweden: 123 45 — mask inserts the space
    SE: { pattern: /^\d{3}\s?\d{2}$/, mask: "### ##", placeholder: "111 22" },
    // Ireland: A12 B345 — mask inserts the space
    IE: { pattern: /^[A-Za-z]\d{2}\s?[A-Za-z\d]{4}$/, mask: "A## NNNN", placeholder: "D01 F5P2" },
    // Netherlands: 1234 AB — mask inserts the space
    NL: { pattern: /^\d{4}\s?[A-Za-z]{2}$/, mask: "#### AA", placeholder: "1012 AB" },
    // United Kingdom: variable length (A9 9AA … AA9A 9AA), no fixed mask.
    // Space is \s? because the user must type it manually without a mask.
    GB: { pattern: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/, mask: "", placeholder: "SW1A 2AA" },
};

/** Fallback.
 * Matches an optional sequence of alphanumeric
 * groups separated by single hyphens or spaces,
 * allowing only letters and digits (case-insensitive)
 * with no leading/trailing separators.
 * Copied from ALPA - requirement from ticket
 */
const DEFAULT_CONFIG: PostalCodeConfig = {
    pattern: /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/i,
    mask: "",
    placeholder: "",
};

/**
 * Returns country-specific postal code mask, placeholder and validation rule.
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code string (e.g. "CA", "AU")
 * @param invalidMessage - factory called with the country placeholder when validation fails;
 *                         the caller is responsible for i18n (keeps this composable i18n-free).
 * @param requiredMessage - returned when the field is empty; omit to let the generic requiredRule handle it.
 */

type UsePostalCodeParams = {
  country: string;
  getFailedPatternMessage: (placeholder: string) => string;
  getFailedRequiredMessage?: () => string;
};
export function usePostalCode(params: UsePostalCodeParams) {
  const config = computed<PostalCodeConfig>(() => {
    const code = params.country?.toUpperCase();
    return code && POSTAL_CODE_CONFIGS[code] ? POSTAL_CODE_CONFIGS[code] : DEFAULT_CONFIG;
  });

  const postalMask = computed(() => config.value.mask);

  const postalPlaceholder = computed(() => config.value.placeholder);

  /** Validates the value exactly as it comes from the masked input. */
  const postalCodeRule: InputRuleString = (value: string) => {
    if (!value) {
      if (params.getFailedRequiredMessage) {
        return params.getFailedRequiredMessage() ?? true;
      }
      return true; // let default requiredRule handle empty values
    }
    return config.value.pattern.test(value) || params.getFailedPatternMessage(config.value.placeholder);
  };

  return {
    postalMask,
    postalPlaceholder,
    postalCodeRule,
  };
}
