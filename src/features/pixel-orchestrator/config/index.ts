import { type PixelConfigMap, PixelType, PixelGeoCountry } from '../types';

/**
 * Collects all unique geos that are allowed for deposit-related pixels across all pixel configs.
 * This is computed once at module load time for O(1) lookup performance.
 */
function collectAllowedDepositGeos<T>(...configs: PixelConfigMap<T>[]): Set<string> {
    const depositPixelTypes = [ PixelType.FIRST_TIME_DEPOSIT, PixelType.DEPOSIT ];
    const allowedGeos = new Set<string>();

    for (const config of configs) {
        for (const pixelType of depositPixelTypes) {
            const pixelConfig = config[pixelType];
            if (pixelConfig?.enabledGeos) {
                for (const geo of pixelConfig.enabledGeos) {
                    allowedGeos.add(geo);
                }
            }
        }
    }

    return allowedGeos;
}

/**
 * Cached set of all geos allowed for deposit pixels.
 * Computed once at module load time from all pixel configs.
 */
export function isGeoAllowedForDepositPixels<T = unknown>(userGeo: string, ...configs: PixelConfigMap<T>[]): boolean {
    const allowedDepositGeos = collectAllowedDepositGeos<T>(...configs);

    if (allowedDepositGeos.has(PixelGeoCountry.All)) {
      return true;
    }

    return allowedDepositGeos.has(userGeo);
}
